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
      code: string
      product_name: string
      cost: number
      shipping: number
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
      patch: Partial<Pick<ProductDefinition, 'code' | 'product_name' | 'cost' | 'shipping'>>
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
