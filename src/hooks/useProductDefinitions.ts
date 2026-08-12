import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'
import type { ProductDefinition } from '../types'

export function useProductDefinitions() {
  return useQuery({
    queryKey: ['product_definitions'],
    queryFn: async (): Promise<ProductDefinition[]> => {
      const { data, error } = await supabase
        .from('product_definitions')
        .select('*')
        .order('code')
      if (error) throw error
      return data
    },
  })
}

export function useAddProductDefinition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
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
    }): Promise<ProductDefinition> => {
      const { data, error } = await supabase
        .from('product_definitions')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_definitions'] })
    },
  })
}

export function useUpdateProductDefinition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string
      patch: Partial<
        Pick<
          ProductDefinition,
          | 'id_tem'
          | 'code'
          | 'product_name'
          | 'cost'
          | 'shipping'
          | 'weight'
          | 'p_weight'
          | 'length'
          | 'width'
          | 'height'
          | 'hs_code'
          | 'item_price'
          | 'note1'
          | 'note2'
        >
      >
    }) => {
      const { error } = await supabase.from('product_definitions').update(patch).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_definitions'] })
    },
  })
}

export function useDeleteProductDefinition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('product_definitions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product_definitions'] })
    },
  })
}
