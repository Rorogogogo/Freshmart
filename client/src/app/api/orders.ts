import {
  CreateOrderRequest,
  OrderResponse,
  OrdersResponse,
} from '@/types/order'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function createOrder(
  orderData: CreateOrderRequest
): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to create order')
  }

  return await response.json()
}

export async function getOrderById(orderId: string): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to get order')
  }

  return await response.json()
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderResponse> {
  const response = await fetch(`${API_URL}/orders/number/${orderNumber}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to get order')
  }

  return await response.json()
}

export async function getUserOrders(
  page = 1,
  pageSize = 10
): Promise<OrdersResponse> {
  const response = await fetch(
    `${API_URL}/orders?page=${page}&pageSize=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to get orders')
  }

  return await response.json()
}

export async function sendOrderConfirmation(orderId: string): Promise<any> {
  const response = await fetch(
    `${API_URL}/orders/${orderId}/send-confirmation`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to send confirmation')
  }

  return await response.json()
}
