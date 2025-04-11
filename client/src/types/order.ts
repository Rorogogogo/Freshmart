export interface OrderItem {
  id: string
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  subtotal: number
  productImageUrl: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  orderDate: string
  totalAmount: number
  status: string
  shippingAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  email: string
  userName: string
  items: OrderItem[]
}

export interface CreateOrderItem {
  productId: string
  quantity: number
}

export interface CreateOrderRequest {
  items: CreateOrderItem[]
  shippingAddress: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  email: string
}

export interface OrdersResponse {
  success: boolean
  message: string
  statusCode: number
  data: Order[]
  totalCount: number
  totalPages: number
  page: number
  pageSize: number
}

export interface OrderResponse {
  success: boolean
  message: string
  statusCode: number
  data: Order
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phoneNumber: string
  email: string
}
