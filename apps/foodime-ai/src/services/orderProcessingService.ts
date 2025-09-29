import { advancedSTTService, STTResult } from './advancedSTTService';
import { advancedTTSService, TTSConfig } from './advancedTTSService';
import { aiService } from './aiService';

// Order-related types
export interface OrderItem {
  id: string;
  name: string;
  category: 'appetizer' | 'main' | 'dessert' | 'drink' | 'side' | 'special';
  price: number;
  quantity: number;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  customizations: string[];
  notes?: string;
}

export interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  specialInstructions?: string;
}

export interface ProcessedOrder {
  id: string;
  restaurantId: string;
  customer: CustomerInfo;
  items: OrderItem[];
  orderType: 'pickup' | 'delivery' | 'dine-in';
  totalAmount: number;
  orderTime: Date;
  estimatedReadyTime?: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  rawTranscription: string;
  confidence: number;
  conversationLog: ConversationEntry[];
}

export interface ConversationEntry {
  timestamp: Date;
  type: 'customer' | 'ai' | 'system';
  content: string;
  confidence?: number;
}

export interface RestaurantMenu {
  id: string;
  name: string;
  categories: MenuCategory[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes?: { name: string; price: number; }[];
  customizations?: string[];
  allergens?: string[];
  available: boolean;
}

export interface OrderProcessingConfig {
  sttProvider: string;
  ttsProvider: string;
  aiProvider: string;
  restaurant: {
    id: string;
    name: string;
    phone: string;
    timezone: string;
  };
  language: string;
  maxConversationTime: number; // in seconds
  confirmationRequired: boolean;
}

interface AIResponseItem {
  name: string;
  quantity?: number;
  size?: string;
  customizations?: string[];
  notes?: string;
}

interface AIResponse {
  intent: 'add_item' | 'modify_item' | 'remove_item' | 'provide_info' | 'confirm_order' | 'cancel_order' | 'general_conversation';
  response: string;
  items?: AIResponseItem[];
  modifications?: OrderModification[];
  itemsToRemove?: string[];
  customerInfo?: Partial<CustomerInfo>;
  confidence: number;
}

interface OrderModification {
  itemId: string;
  field: keyof OrderItem;
  value: string | number | string[];
}

export class OrderProcessingService {
  private currentOrder: Partial<ProcessedOrder> | null = null;
  private conversationLog: ConversationEntry[] = [];
  private restaurantMenu: RestaurantMenu | null = null;
  private isProcessingOrder = false;

  constructor() {
    // Initialize with default menu (in production, this would be loaded from database)
    this.loadDefaultMenu();
  }

  private loadDefaultMenu() {
    // Sample menu for testing
    this.restaurantMenu = {
      id: 'sample-restaurant',
      name: 'Foodime Pizzeria',
      categories: [
        {
          id: 'pizzas',
          name: 'Pizzas',
          items: [
            {
              id: 'margherita',
              name: 'Margherita Pizza',
              description: 'Fresh tomato sauce, mozzarella, basil',
              price: 18.99,
              category: 'main',
              sizes: [
                { name: 'small', price: 15.99 },
                { name: 'medium', price: 18.99 },
                { name: 'large', price: 22.99 }
              ],
              customizations: ['extra cheese', 'thin crust', 'thick crust', 'gluten-free'],
              available: true
            },
            {
              id: 'pepperoni',
              name: 'Pepperoni Pizza',
              description: 'Tomato sauce, mozzarella, pepperoni',
              price: 21.99,
              category: 'main',
              sizes: [
                { name: 'small', price: 18.99 },
                { name: 'medium', price: 21.99 },
                { name: 'large', price: 25.99 }
              ],
              customizations: ['extra cheese', 'extra pepperoni', 'thin crust', 'thick crust'],
              available: true
            }
          ]
        },
        {
          id: 'appetizers',
          name: 'Appetizers',
          items: [
            {
              id: 'garlic-bread',
              name: 'Garlic Bread',
              description: 'Toasted bread with garlic butter',
              price: 8.99,
              category: 'appetizer',
              customizations: ['extra garlic', 'cheese topping'],
              available: true
            },
            {
              id: 'mozzarella-sticks',
              name: 'Mozzarella Sticks',
              description: 'Breaded mozzarella sticks with marinara sauce',
              price: 9.99,
              category: 'appetizer',
              customizations: ['extra sauce'],
              available: true
            }
          ]
        }
      ]
    };
  }

  private async speak(text: string, ttsProvider: string): Promise<void> {
    const ttsConfig: TTSConfig = {
      provider: ttsProvider,
      voice: 'nova', // Default voice
      speed: 1.0,
      pitch: 1.0
    };

    try {
      await advancedTTSService.speak(text, ttsConfig);
    } catch (error) {
      console.error('Error speaking:', error);
    }
  }

  private addConversationEntry(type: 'customer' | 'ai' | 'system', content: string, confidence?: number): void {
    const entry: ConversationEntry = {
      timestamp: new Date(),
      type,
      content,
      confidence
    };
    
    this.conversationLog.push(entry);
  }

  private async cancelOrder(config: OrderProcessingConfig): Promise<void> {
    const cancelMessage = "No problem! Your order has been cancelled. Have a great day!";
    await this.speak(cancelMessage, config.ttsProvider);
    this.addConversationEntry('ai', cancelMessage);
    this.completeOrderProcessing();
  }

  private async processWithAI(input: string, config: OrderProcessingConfig): Promise<AIResponse> {
    // Create a detailed system prompt for order processing
    const systemPrompt = `
You are an AI assistant for ${config.restaurant.name}, a restaurant taking phone orders. 
Your job is to understand customer requests and extract structured information.

Current menu:
${JSON.stringify(this.restaurantMenu, null, 2)}

Current order state:
${JSON.stringify(this.currentOrder, null, 2)}

Instructions:
1. Be friendly, professional, and helpful
2. Understand the customer's intent (add_item, modify_item, remove_item, provide_info, confirm_order, cancel_order, or general_conversation)
3. Extract specific items, quantities, sizes, and customizations
4. Ask clarifying questions when needed
5. Suggest menu items when appropriate
6. Calculate totals accurately
7. Use 4-digit codes for any reference numbers (as per rflct preference)
8. Keep responses conversational and natural

Respond with a JSON object containing:
{
  "intent": "add_item|modify_item|remove_item|provide_info|confirm_order|cancel_order|general_conversation",
  "response": "What you would say to the customer",
  "items": [{"name": "", "quantity": 1, "size": "", "customizations": []}], // for add_item
  "modifications": [{"itemId": "", "changes": {}}], // for modify_item
  "itemsToRemove": ["itemId1", "itemId2"], // for remove_item
  "customerInfo": {"name": "", "phone": "", "address": ""}, // for provide_info
  "confidence": 0.9 // How confident you are in the interpretation
}

Customer said: "${input}"
`;

    const chatConfig = {
      aiProvider: config.aiProvider,
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt
    };

    const aiResponse = await aiService.sendMessage(input, chatConfig);
    
    try {
      // Try to parse JSON response
      return JSON.parse(aiResponse);
    } catch {
      // If not JSON, treat as general conversation
      return {
        intent: 'general_conversation',
        response: aiResponse,
        confidence: 0.8
      };
    }
  }

  private async addItemToOrder(items: AIResponseItem[], config: OrderProcessingConfig): Promise<void> {
    if (!this.currentOrder || !items || items.length === 0) return;

    for (const item of items) {
      const menuItem = this.findMenuItem(item.name);
      if (menuItem) {
        const orderItem: OrderItem = {
          id: this.generateItemId(),
          name: menuItem.name,
          category: menuItem.category as OrderItem['category'],
          price: this.calculateItemPrice(menuItem, item.size),
          quantity: item.quantity || 1,
          size: item.size,
          customizations: item.customizations || [],
          notes: item.notes
        };

        this.currentOrder.items!.push(orderItem);
        this.updateOrderTotal();

        const confirmation = `Great! I've added ${item.quantity || 1} ${item.size || 'regular'} ${menuItem.name} to your order. ${item.customizations && item.customizations.length > 0 ? 'With ' + item.customizations.join(', ') + '. ' : ''}Anything else?`;
        await this.speak(confirmation, config.ttsProvider);
        this.addConversationEntry('ai', confirmation);
      } else {
        const notFound = `I'm sorry, we don't have "${item.name}" on our menu. Would you like to hear about our available ${this.guessCategory(item.name)}?`;
        await this.speak(notFound, config.ttsProvider);
        this.addConversationEntry('ai', notFound);
      }
    }
  }

  private guessCategory(itemName: string): string {
    const name = itemName.toLowerCase();
    if (name.includes('pizza')) return 'pizzas';
    if (name.includes('drink') || name.includes('soda') || name.includes('water')) return 'drinks';
    if (name.includes('bread') || name.includes('stick')) return 'appetizers';
    return 'items';
  }

  async startOrderProcessing(config: OrderProcessingConfig): Promise<void> {
    if (this.isProcessingOrder) {
      throw new Error('Already processing an order');
    }

    this.isProcessingOrder = true;
    this.currentOrder = {
      id: this.generateOrderId(),
      restaurantId: config.restaurant.id,
      customer: {},
      items: [],
      totalAmount: 0,
      orderTime: new Date(),
      status: 'pending',
      rawTranscription: '',
      confidence: 0,
      conversationLog: []
    };
    this.conversationLog = [];

    try {
      // Start with a greeting
      const greeting = `Hello! Welcome to ${config.restaurant.name}. I'm your AI assistant ready to take your order. What would you like today?`;
      await this.speak(greeting, config.ttsProvider);
      this.addConversationEntry('ai', greeting);

      // Start listening for the customer's order
      await this.startListening(config);
    } catch (error) {
      console.error('Error starting order processing:', error);
      this.isProcessingOrder = false;
      throw error;
    }
  }

  private async startListening(config: OrderProcessingConfig): Promise<void> {
    const sttConfig = {
      provider: config.sttProvider,
      language: config.language || 'en-US',
      continuous: true,
      interimResults: true
    };

    await advancedSTTService.startListening(
      sttConfig,
      async (result: STTResult) => {
        if (result.isFinal && result.text.trim()) {
          await this.processCustomerInput(result.text, result.confidence, config);
        }
      },
      () => {
        console.log('Speech recognition ended');
      },
      (error: Error) => {
        console.error('Speech recognition error:', error);
      }
    );
  }

  private generateOrderId(): string {
    return `ord_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  }

  private generateItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  }

  private generateOrderCode(): string {
    // Generate 4-digit code as per rflct preference
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  private updateOrderTotal(): void {
    if (!this.currentOrder) return;

    this.currentOrder.totalAmount = this.currentOrder.items!.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  private generateOrderSummary(): string {
    if (!this.currentOrder || this.currentOrder.items!.length === 0) return '';

    return this.currentOrder.items!.map(item => {
      const sizeText = item.size ? `${item.size} ` : '';
      const quantityText = item.quantity > 1 ? `${item.quantity} ` : '';
      const customizationsText = item.customizations.length > 0 ? ` with ${item.customizations.join(', ')}` : '';
      return `${quantityText}${sizeText}${item.name}${customizationsText}`;
    }).join(', ');
  }

  private async modifyOrderItem(modifications: OrderModification[], config: OrderProcessingConfig): Promise<void> {
    // Implementation for modifying existing items
    const response = "I can help you modify your order. What changes would you like to make?";
    await this.speak(response, config.ttsProvider);
    this.addConversationEntry('ai', response);
  }

  private async removeItemFromOrder(itemsToRemove: string[], config: OrderProcessingConfig): Promise<void> {
    // Implementation for removing items
    const response = "I'll remove those items from your order. What else can I get for you?";
    await this.speak(response, config.ttsProvider);
    this.addConversationEntry('ai', response);
  }

  private async updateCustomerInfo(customerInfo: Partial<CustomerInfo>, config: OrderProcessingConfig): Promise<void> {
    if (!this.currentOrder) return;

    this.currentOrder.customer = { ...this.currentOrder.customer, ...customerInfo };
    
    const response = "Thank you for that information. Is there anything else you'd like to add to your order?";
    await this.speak(response, config.ttsProvider);
    this.addConversationEntry('ai', response);
  }

  private completeOrderProcessing(): void {
    this.isProcessingOrder = false;
    advancedSTTService.stopListening();
  }

  // Public methods for external use
  async stopOrderProcessing(): Promise<void> {
    await advancedSTTService.stopListening();
    this.completeOrderProcessing();
  }

  getCurrentOrder(): Partial<ProcessedOrder> | null {
    return this.currentOrder;
  }

  getConversationLog(): ConversationEntry[] {
    return [...this.conversationLog];
  }

  isProcessing(): boolean {
    return this.isProcessingOrder;
  }

  // Test method to simulate an order
  async testOrderProcessing(): Promise<void> {
    const testConfig: OrderProcessingConfig = {
      sttProvider: 'web-speech',
      ttsProvider: 'web-speech',
      aiProvider: 'openai',
      restaurant: {
        id: 'test-restaurant',
        name: 'Test Pizzeria',
        phone: '555-0123',
        timezone: 'America/New_York'
      },
      language: 'en-US',
      maxConversationTime: 300,
      confirmationRequired: true
    };

    console.log('🍕 Starting test order processing...');
    await this.startOrderProcessing(testConfig);
  }
}

export const orderProcessingService = new OrderProcessingService();
