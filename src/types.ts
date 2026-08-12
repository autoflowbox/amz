export type OrderStatus = '' | 'Chờ ship' | 'Chờ in' | 'Đã gửi' | 'Lưu ý' | 'DONE' | 'Hủy đơn'

export interface Shop {
  id: string
  name: string
  created_at: string
}

export interface ProductDefinition {
  id: string
  id_tem: string
  code: string
  product_name: string
  cost: number
  shipping: number
  weight: number
  p_weight: number
  length: number
  width: number
  height: number
  hs_code: string
  item_price: number
  note1: string
  note2: string
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  sku: string
  sku_code: string
  quantity: number
  sort_order: number
}

export interface OrderFile {
  id: string
  order_id: string
  file_name: string
  storage_path: string
  uploaded_at: string
}

export interface Order {
  id: string
  shop_id: string | null
  order_id: string
  address: string
  price: number
  shipping_date: string | null
  note: string
  status: OrderStatus
  assignee: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
  order_files?: OrderFile[]
}
