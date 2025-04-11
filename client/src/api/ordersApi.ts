import { API_URL, api } from './apiConfig'
import {
  CreateOrderRequest,
  OrderResponse,
  OrdersResponse,
} from '@/types/order'

/**
 * Create a new order
 * @param orderData Order data including items and shipping information
 * @returns Promise with order response
 */
export const createOrder = async (
  orderData: CreateOrderRequest
): Promise<OrderResponse> => {
  try {
    const response = await api.post('/api/orders', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

/**
 * Get an order by ID
 * @param orderId The order ID
 * @returns Promise with order response
 */
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const response = await api.get(`/api/orders/${orderId}`)
    return response.data
  } catch (error) {
    console.error('Error getting order:', error)
    throw error
  }
}

/**
 * Get an order by order number
 * @param orderNumber The order number
 * @returns Promise with order response
 */
export const getOrderByNumber = async (
  orderNumber: string
): Promise<OrderResponse> => {
  try {
    const response = await api.get(`/api/orders/number/${orderNumber}`)
    return response.data
  } catch (error) {
    console.error('Error getting order by number:', error)
    throw error
  }
}

/**
 * Get orders for the authenticated user
 * @param page Page number (default: 1)
 * @param pageSize Number of items per page (default: 10)
 * @returns Promise with orders response
 */
export const getUserOrders = async (
  page = 1,
  pageSize = 10
): Promise<OrdersResponse> => {
  try {
    const response = await api.get(
      `/api/orders?page=${page}&pageSize=${pageSize}`
    )
    return response.data
  } catch (error) {
    console.error('Error getting user orders:', error)
    throw error
  }
}

/**
 * Resend order confirmation email
 * @param orderId The order ID
 * @returns Promise with response
 */
export const sendOrderConfirmation = async (orderId: string): Promise<any> => {
  try {
    const response = await api.post(`/api/orders/${orderId}/send-confirmation`)
    return response.data
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    throw error
  }
}
