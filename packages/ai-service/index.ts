import { OpenAI } from "openai"
import { generateText } from "ai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Function to handle conversation with GPT
export async function handleConversation(prompt: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return { success: true, text }
  } catch (error) {
    console.error("Error in AI conversation:", error)
    return { success: false, error: "Failed to process conversation" }
  }
}

// Function to analyze order details
export async function analyzeOrder(orderText: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Extract the following information from this food order: 
      ${orderText}
      
      Return a JSON object with these fields:
      - items: array of ordered items with quantity and any customizations
      - customerName: the customer's name if mentioned
      - deliveryAddress: delivery address if mentioned
      - phoneNumber: contact number if mentioned
      - specialInstructions: any special instructions
      `,
    })

    return { success: true, data: JSON.parse(text) }
  } catch (error) {
    console.error("Error analyzing order:", error)
    return { success: false, error: "Failed to analyze order" }
  }
}

export default {
  handleConversation,
  analyzeOrder,
}
