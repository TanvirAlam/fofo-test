import twilio from "twilio"

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// Function to make a call
export async function makeCall(to: string, url: string) {
  try {
    const call = await client.calls.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      url,
    })

    return { success: true, callSid: call.sid }
  } catch (error) {
    console.error("Error making call:", error)
    return { success: false, error: "Failed to make call" }
  }
}

// Function to send SMS
export async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    })

    return { success: true, messageSid: message.sid }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return { success: false, error: "Failed to send SMS" }
  }
}

// Function to handle incoming call
export function handleIncomingCall(twiml: any) {
  const response = new twilio.twiml.VoiceResponse()

  // Add gather for speech input
  const gather = response.gather({
    input: "speech",
    action: "/api/twilio/process-speech",
    speechTimeout: "auto",
    language: "en-US",
  })

  gather.say("Hello, welcome to Foodime. What would you like to order today?")

  // If no input, try again
  response.redirect("/api/twilio/incoming-call")

  return response.toString()
}

export default {
  makeCall,
  sendSMS,
  handleIncomingCall,
}
