import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Customer functions
export async function getCustomers() {
  const { data, error } = await supabase.from("customers").select("*")

  if (error) throw error
  return data
}

export async function getCustomerById(id: string) {
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single()

  if (error) throw error
  return data
}

export async function createCustomer(customer: any) {
  const { data, error } = await supabase.from("customers").insert(customer).select()

  if (error) throw error
  return data[0]
}

// Order functions
export async function getOrders(customerId?: string) {
  let query = supabase.from("orders").select("*")

  if (customerId) {
    query = query.eq("customer_id", customerId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function createOrder(order: any) {
  const { data, error } = await supabase.from("orders").insert(order).select()

  if (error) throw error
  return data[0]
}

// Call history functions
export async function getCallHistory(customerId?: string) {
  let query = supabase.from("call_history").select("*")

  if (customerId) {
    query = query.eq("customer_id", customerId)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function createCallRecord(call: any) {
  const { data, error } = await supabase.from("call_history").insert(call).select()

  if (error) throw error
  return data[0]
}

export default {
  getCustomers,
  getCustomerById,
  createCustomer,
  getOrders,
  createOrder,
  getCallHistory,
  createCallRecord,
}
