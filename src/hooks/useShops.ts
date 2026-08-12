import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'
import type { Shop } from '../types'

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: async (): Promise<Shop[]> => {
      const { data, error } = await supabase.from('shops').select('*').order('name')
      if (error) throw error
      return data
    },
  })
}

export function useAddShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (name: string): Promise<Shop> => {
      const { data, error } = await supabase.from('shops').insert({ name }).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    },
  })
}

/** Renames a shop — updates the shared `shops` row, so it's reflected everywhere that shop_id is used. */
export function useUpdateShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }): Promise<Shop> => {
      const { data, error } = await supabase.from('shops').update({ name }).eq('id', id).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] })
    },
  })
}
