import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../supabaseClient'

const BUCKET = 'order-attachments'

export function useUploadOrderFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ orderId, file }: { orderId: string; file: File }) => {
      const storagePath = `${orderId}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, file)
      if (uploadError) throw uploadError

      const { error: insertError } = await supabase.from('order_files').insert({
        order_id: orderId,
        file_name: file.name,
        storage_path: storagePath,
      })
      if (insertError) throw insertError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDeleteOrderFile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, storagePath }: { id: string; storagePath: string }) => {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove([storagePath])
      if (storageError) throw storageError

      const { error: deleteError } = await supabase.from('order_files').delete().eq('id', id)
      if (deleteError) throw deleteError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export async function getOrderFileUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 60)
  if (error) throw error
  return data.signedUrl
}
