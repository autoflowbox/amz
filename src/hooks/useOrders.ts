import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'
import type { Order, OrderItem, OrderStatus } from '../types'

const ORDER_SELECT = '*, order_items(*), order_files(*)'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select(ORDER_SELECT)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as unknown as Order[]
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .insert({ status: 'Chờ ship' })
        .select(ORDER_SELECT)
        .single()
      if (error) throw error
      return data as unknown as Order
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export type OrderPatch = Partial<
  Pick<
    Order,
    'shop_id' | 'order_id' | 'address' | 'price' | 'shipping_date' | 'note' | 'status' | 'assignee'
  >
>

export function useUpdateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: OrderPatch }) => {
      const { error } = await supabase.from('orders').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDeleteOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export interface SkuLineInput {
  sku: string
  sku_code: string
  quantity: number
}

/** Replaces all SKU lines for an order in one go — simplest consistent way to save the SKU editor. */
export function useReplaceOrderItems() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ orderId, items }: { orderId: string; items: SkuLineInput[] }) => {
      const { error: deleteError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId)
      if (deleteError) throw deleteError

      if (items.length > 0) {
        const rows = items.map((item, index) => ({
          order_id: orderId,
          sku: item.sku,
          sku_code: item.sku_code,
          quantity: item.quantity,
          sort_order: index,
        }))
        const { error: insertError } = await supabase.from('order_items').insert(rows)
        if (insertError) throw insertError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export type { OrderItem }
