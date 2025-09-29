# 🍽️ Restaurant Menu Integration and AI Knowledge Base

## Summary

Integrate the main server's restaurant menu system with the AI service to enable
intelligent order processing. The AI needs access to real-time menu data,
pricing, availability, and restaurant-specific information to process orders
accurately and provide helpful recommendations.

## Problem Statement

Currently, the AI service uses a hardcoded sample menu (Foodime Pizzeria) for
testing. For production use, we need:

- Dynamic menu loading from the main database
- Real-time menu updates and availability changes
- Restaurant-specific customizations and pricing
- AI understanding of menu structure and relationships
- Intelligent item suggestions and upselling

## Current State Analysis

### Server Menu System

Looking at the existing database schema, the server has:

- `restaurants` table for restaurant information
- `menus` table for menu management
- Restaurant-specific menu items and categories
- Pricing and availability management

### AI Service Menu Handling

- Hardcoded sample menu in `orderProcessingService.ts`
- Basic item matching by name
- Simple category guessing logic
- No real-time updates or restaurant-specific data

## Proposed Solution

### 1. Database Schema Enhancements

#### A. Menu Intelligence Schema

```typescript
// /apps/server/src/db/schema/menu-ai.ts
export const menuAIMetadata = pgTable("menu_ai_metadata", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id")
    .references(() => restaurants.id)
    .notNull(),
  itemId: uuid("item_id")
    .references(() => menuItems.id)
    .notNull(),

  // AI-specific metadata
  aliases: text("aliases"), // JSON array of alternative names
  keywords: text("keywords"), // JSON array of searchable terms
  popularityScore: decimal("popularity_score", { precision: 3, scale: 2 }),
  recommendationTags: text("recommendation_tags"), // JSON array

  // Upselling and cross-selling
  suggestedWith: text("suggested_with"), // JSON array of item IDs
  upsellItems: text("upsell_items"), // JSON array of item IDs

  // AI training data
  commonCustomizations: text("common_customizations"), // JSON array
  customerQuestions: text("customer_questions"), // JSON array of FAQ

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const menuAvailability = pgTable("menu_availability", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id")
    .references(() => restaurants.id)
    .notNull(),
  itemId: uuid("item_id")
    .references(() => menuItems.id)
    .notNull(),

  isAvailable: boolean("is_available").default(true),
  estimatedWaitTime: integer("estimated_wait_time"), // in minutes
  temporaryPriceChange: decimal("temporary_price_change", {
    precision: 10,
    scale: 2,
  }),
  availabilityNote: text("availability_note"),

  // Time-based availability
  availableFrom: time("available_from"),
  availableTo: time("available_to"),
  availableDays: text("available_days"), // JSON array of weekdays

  lastUpdated: timestamp("last_updated").defaultNow(),
  updatedBy: uuid("updated_by"), // staff member ID
});
```

#### B. AI Learning and Analytics

```typescript
export const aiOrderAnalytics = pgTable("ai_order_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  restaurantId: uuid("restaurant_id")
    .references(() => restaurants.id)
    .notNull(),
  sessionCode: varchar("session_code", { length: 4 }).notNull(),

  // Customer interaction patterns
  customerInput: text("customer_input").notNull(),
  interpretedItems: text("interpreted_items"), // JSON array
  suggestedItems: text("suggested_items"), // JSON array
  finalOrder: text("final_order"), // JSON array

  // AI performance metrics
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }),
  processingTime: integer("processing_time"), // in milliseconds
  accuracyRating: integer("accuracy_rating"), // 1-5 scale, set by staff

  createdAt: timestamp("created_at").defaultNow(),
});
```

### 2. Menu Data Service

#### A. Server-Side Menu API

```typescript
// /apps/server/src/services/menuService.ts
export class MenuService {
  async getRestaurantMenu(
    restaurantId: string
  ): Promise<EnhancedRestaurantMenu> {
    const menu = await this.db
      .select()
      .from(menus)
      .leftJoin(menuCategories, eq(menus.id, menuCategories.menuId))
      .leftJoin(menuItems, eq(menuCategories.id, menuItems.categoryId))
      .leftJoin(menuAIMetadata, eq(menuItems.id, menuAIMetadata.itemId))
      .leftJoin(menuAvailability, eq(menuItems.id, menuAvailability.itemId))
      .where(eq(menus.restaurantId, restaurantId));

    return this.transformToAIFormat(menu);
  }

  async updateItemAvailability(
    restaurantId: string,
    itemId: string,
    availability: MenuItemAvailability
  ): Promise<void> {
    await this.db
      .insert(menuAvailability)
      .values({
        restaurantId,
        itemId,
        ...availability,
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: [menuAvailability.restaurantId, menuAvailability.itemId],
        set: {
          ...availability,
          lastUpdated: new Date(),
        },
      });

    // Broadcast update to AI service
    await this.notifyAIService("menu:availability:update", {
      restaurantId,
      itemId,
      availability,
    });
  }

  async getMenuRecommendations(
    restaurantId: string,
    currentItems: string[]
  ): Promise<MenuRecommendation[]> {
    // Implement recommendation logic based on:
    // - Current order items
    // - Popular combinations
    // - Upselling opportunities
    // - Available items
  }
}
```

#### B. GraphQL Menu Operations

```graphql
# New GraphQL schema additions
extend type Restaurant {
  aiEnabledMenu: AIEnabledMenu!
  menuAvailability: [MenuItemAvailability!]!
}

type AIEnabledMenu {
  id: ID!
  categories: [AIMenuCategory!]!
  popularItems: [MenuItem!]!
  featuredCombos: [MenuCombo!]!
  lastUpdated: DateTime!
}

type AIMenuCategory {
  id: ID!
  name: String!
  items: [AIMenuItem!]!
  orderIndex: Int!
}

type AIMenuItem {
  id: ID!
  name: String!
  description: String!
  price: Float!
  isAvailable: Boolean!
  estimatedWaitTime: Int

  # AI-specific fields
  aliases: [String!]!
  keywords: [String!]!
  popularityScore: Float!
  recommendationTags: [String!]!
  suggestedWith: [MenuItem!]!
  upsellItems: [MenuItem!]!
  commonCustomizations: [String!]!
}

extend type Mutation {
  updateMenuItemAvailability(
    restaurantId: ID!
    itemId: ID!
    availability: MenuItemAvailabilityInput!
  ): MenuItemAvailability!

  updateMenuAIMetadata(
    itemId: ID!
    metadata: MenuAIMetadataInput!
  ): MenuAIMetadata!
}

extend type Query {
  restaurantAIMenu(restaurantId: ID!): AIEnabledMenu!
  menuRecommendations(
    restaurantId: ID!
    currentItems: [ID!]!
  ): [MenuRecommendation!]!
}
```

### 3. AI Service Menu Integration

#### A. Dynamic Menu Loading

```typescript
// /apps/foodime-ai/src/services/menuService.ts
export class AIMenuService {
  private menus: Map<string, EnhancedRestaurantMenu> = new Map();
  private menuUpdateListeners: Map<string, Function[]> = new Map();

  async loadRestaurantMenu(
    restaurantId: string
  ): Promise<EnhancedRestaurantMenu> {
    try {
      const response = await fetch(
        `${config.serverUrl}/api/menu/${restaurantId}/ai`,
        {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const menu = (await response.json()) as EnhancedRestaurantMenu;
      this.menus.set(restaurantId, menu);

      // Build AI search index
      await this.buildSearchIndex(restaurantId, menu);

      return menu;
    } catch (error) {
      console.error("Error loading restaurant menu:", error);
      throw new Error(`Failed to load menu for restaurant ${restaurantId}`);
    }
  }

  async buildSearchIndex(
    restaurantId: string,
    menu: EnhancedRestaurantMenu
  ): Promise<void> {
    const searchIndex = new Map<string, MenuSearchResult>();

    menu.categories.forEach(category => {
      category.items.forEach(item => {
        // Index by name
        searchIndex.set(item.name.toLowerCase(), {
          item,
          category: category.name,
          matchType: "exact",
        });

        // Index by aliases
        item.aliases?.forEach(alias => {
          searchIndex.set(alias.toLowerCase(), {
            item,
            category: category.name,
            matchType: "alias",
          });
        });

        // Index by keywords
        item.keywords?.forEach(keyword => {
          searchIndex.set(keyword.toLowerCase(), {
            item,
            category: category.name,
            matchType: "keyword",
          });
        });
      });
    });

    this.searchIndices.set(restaurantId, searchIndex);
  }

  findMenuItem(restaurantId: string, query: string): MenuSearchResult[] {
    const searchIndex = this.searchIndices.get(restaurantId);
    if (!searchIndex) return [];

    const normalizedQuery = query.toLowerCase();
    const results: MenuSearchResult[] = [];

    // Exact matches first
    const exactMatch = searchIndex.get(normalizedQuery);
    if (exactMatch) {
      results.push({ ...exactMatch, confidence: 1.0 });
    }

    // Fuzzy matches
    searchIndex.forEach((result, key) => {
      if (key.includes(normalizedQuery) || normalizedQuery.includes(key)) {
        const confidence = this.calculateSimilarity(normalizedQuery, key);
        if (
          confidence > 0.6 &&
          !results.find(r => r.item.id === result.item.id)
        ) {
          results.push({ ...result, confidence });
        }
      }
    });

    return results.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }
}
```

#### B. Enhanced Order Processing

```typescript
// Enhanced order processing with real menu data
export class EnhancedOrderProcessingService extends OrderProcessingService {
  private menuService: AIMenuService;

  constructor() {
    super();
    this.menuService = new AIMenuService();
  }

  async startOrderProcessing(config: OrderProcessingConfig): Promise<void> {
    // Load restaurant menu before starting
    await this.menuService.loadRestaurantMenu(config.restaurant.id);

    // Subscribe to menu updates
    this.subscribeToMenuUpdates(config.restaurant.id);

    await super.startOrderProcessing(config);
  }

  private async processWithAI(
    input: string,
    config: OrderProcessingConfig
  ): Promise<AIResponse> {
    const menu = this.menuService.getMenu(config.restaurant.id);

    const enhancedSystemPrompt = `
You are an AI assistant for ${config.restaurant.name}, taking phone orders.

CURRENT MENU (with AI metadata):
${JSON.stringify(menu, null, 2)}

MENU INTELLIGENCE:
- Use item aliases and keywords for better matching
- Consider popularity scores for recommendations
- Suggest upsell items when appropriate
- Check availability before confirming items
- Use common customizations as examples

CURRENT ORDER STATE:
${JSON.stringify(this.currentOrder, null, 2)}

CONVERSATION CONTEXT:
Previous interactions: ${this.conversationLog
      .slice(-3)
      .map(entry => `${entry.type}: ${entry.content}`)
      .join("\n")}

Instructions:
1. Match customer requests to actual menu items using aliases and keywords
2. Suggest popular items and combos when customers are unsure
3. Offer relevant upsells (suggested_with, upsell_items)
4. Check item availability and suggest alternatives if needed
5. Ask about common customizations for selected items
6. Calculate accurate totals with current pricing
7. Use 4-digit codes for order references (rflct preference)
8. Be conversational and helpful

Customer said: "${input}"
`;

    const chatConfig = {
      aiProvider: config.aiProvider,
      model: "gpt-4",
      temperature: 0.3,
      maxTokens: 1000,
      systemPrompt: enhancedSystemPrompt,
    };

    const aiResponse = await aiService.sendMessage(input, chatConfig);

    // Log AI interaction for analytics
    await this.logAIInteraction(input, aiResponse, config);

    try {
      return JSON.parse(aiResponse);
    } catch {
      return {
        intent: "general_conversation",
        response: aiResponse,
        confidence: 0.8,
      };
    }
  }

  private async addItemToOrder(
    items: AIResponseItem[],
    config: OrderProcessingConfig
  ): Promise<void> {
    const menu = this.menuService.getMenu(config.restaurant.id);

    for (const item of items) {
      const searchResults = this.menuService.findMenuItem(
        config.restaurant.id,
        item.name
      );

      if (searchResults.length > 0) {
        const bestMatch = searchResults[0];
        const menuItem = bestMatch.item;

        // Check availability
        if (!menuItem.isAvailable) {
          await this.handleUnavailableItem(menuItem, config);
          continue;
        }

        const orderItem: OrderItem = {
          id: this.generateItemId(),
          name: menuItem.name,
          category: this.getCategoryForItem(menuItem.id, menu),
          price: this.calculateItemPrice(menuItem, item.size),
          quantity: item.quantity || 1,
          size: item.size,
          customizations: item.customizations || [],
          notes: item.notes,
          menuItemId: menuItem.id,
        };

        this.currentOrder.items!.push(orderItem);
        this.updateOrderTotal();

        // Suggest upsells
        await this.suggestUpsells(menuItem, config);

        const confirmation = this.buildItemConfirmation(orderItem, menuItem);
        await this.speak(confirmation, config.ttsProvider);
        this.addConversationEntry("ai", confirmation);
      } else {
        await this.handleUnknownItem(item.name, config);
      }
    }
  }

  private async suggestUpsells(
    menuItem: AIMenuItem,
    config: OrderProcessingConfig
  ): Promise<void> {
    if (menuItem.upsellItems && menuItem.upsellItems.length > 0) {
      const upsellSuggestion = `Would you like to add ${menuItem.upsellItems[0].name} to go with that? It's very popular with the ${menuItem.name}.`;
      await this.speak(upsellSuggestion, config.ttsProvider);
      this.addConversationEntry("ai", upsellSuggestion);
    }
  }

  private async handleUnavailableItem(
    menuItem: AIMenuItem,
    config: OrderProcessingConfig
  ): Promise<void> {
    const alternatives = this.menuService.findSimilarAvailableItems(
      config.restaurant.id,
      menuItem.id
    );

    let response = `I'm sorry, ${menuItem.name} is currently unavailable`;

    if (menuItem.estimatedWaitTime) {
      response += ` (estimated wait time: ${menuItem.estimatedWaitTime} minutes)`;
    }

    if (alternatives.length > 0) {
      response += `. Would you like to try our ${alternatives[0].name} instead? It's similar and very popular.`;
    } else {
      response += `. What else can I get for you?`;
    }

    await this.speak(response, config.ttsProvider);
    this.addConversationEntry("ai", response);
  }
}
```

### 4. Real-time Menu Updates

#### A. Server-Side Broadcasting

```typescript
// /apps/server/src/services/menuBroadcastService.ts
export class MenuBroadcastService {
  constructor(
    private io: Server,
    private menuService: MenuService
  ) {}

  async broadcastMenuUpdate(
    restaurantId: string,
    updateType: string,
    data: any
  ): Promise<void> {
    // Notify AI service
    this.io.to(`ai-service`).emit("menu:update", {
      restaurantId,
      updateType,
      data,
      timestamp: new Date(),
    });

    // Notify restaurant interfaces
    this.io.to(`restaurant:${restaurantId}`).emit("menu:update", {
      updateType,
      data,
      timestamp: new Date(),
    });
  }

  async broadcastAvailabilityChange(
    restaurantId: string,
    itemId: string,
    availability: MenuItemAvailability
  ): Promise<void> {
    await this.broadcastMenuUpdate(restaurantId, "availability_change", {
      itemId,
      availability,
    });
  }
}
```

#### B. AI Service Update Handling

```typescript
// /apps/foodime-ai/src/services/menuUpdateHandler.ts
export class MenuUpdateHandler {
  constructor(private menuService: AIMenuService) {}

  handleMenuUpdate(data: MenuUpdateEvent): void {
    const { restaurantId, updateType, data: updateData } = data;

    switch (updateType) {
      case "availability_change":
        this.handleAvailabilityChange(restaurantId, updateData);
        break;
      case "price_change":
        this.handlePriceChange(restaurantId, updateData);
        break;
      case "item_added":
        this.handleItemAdded(restaurantId, updateData);
        break;
      case "item_removed":
        this.handleItemRemoved(restaurantId, updateData);
        break;
    }
  }

  private async handleAvailabilityChange(
    restaurantId: string,
    data: { itemId: string; availability: MenuItemAvailability }
  ): Promise<void> {
    await this.menuService.updateItemAvailability(
      restaurantId,
      data.itemId,
      data.availability
    );

    // Rebuild search index
    const menu = this.menuService.getMenu(restaurantId);
    if (menu) {
      await this.menuService.buildSearchIndex(restaurantId, menu);
    }
  }
}
```

## Acceptance Criteria

### Database & API ✅

- [ ] Menu AI metadata schema created and migrated
- [ ] Menu availability tracking implemented
- [ ] GraphQL schema extended with AI menu operations
- [ ] REST API endpoints for menu data functional
- [ ] Real-time menu update broadcasting working

### AI Integration ✅

- [ ] Dynamic menu loading from server implemented
- [ ] AI search index building and updating functional
- [ ] Fuzzy matching for menu items working
- [ ] Availability checking integrated into order process
- [ ] Upselling and recommendation logic implemented

### Real-time Updates ✅

- [ ] Menu changes broadcast to AI service immediately
- [ ] Availability updates reflected in active order sessions
- [ ] Search indices updated automatically
- [ ] Order processing adapts to menu changes

### Analytics & Learning ✅

- [ ] AI interaction logging functional
- [ ] Menu item popularity tracking implemented
- [ ] Recommendation effectiveness measured
- [ ] Performance analytics dashboard available

## Technical Requirements

- Real-time menu synchronization (< 1 second delay)
- Fuzzy search with 80%+ accuracy
- Support for 1000+ menu items per restaurant
- Sub-100ms menu item lookup performance
- 99.9% availability checking accuracy

## Dependencies

- Existing database schema and migrations
- Socket.IO for real-time updates
- GraphQL server extensions
- AI service enhancements

## Testing Strategy

1. **Menu Loading Tests**: Dynamic menu fetching and parsing
2. **Search Accuracy Tests**: Fuzzy matching and aliases
3. **Real-time Update Tests**: Live menu change propagation
4. **Performance Tests**: Large menu handling
5. **Integration Tests**: End-to-end order processing with real menus

## Related Issues

- [ ] Issue #1: API Integration Layer
- [ ] Issue #2: Real-time Order Processing with Socket.IO
- [ ] Issue #4: Performance Monitoring and Analytics
