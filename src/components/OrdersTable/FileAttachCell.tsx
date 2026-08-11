import { useRef, useState } from 'react'
import type { OrderFile } from '../../types'
import { useDeleteOrderFile, useUploadOrderFile, getOrderFileUrl } from '../../hooks/useOrderFiles'

export function FileAttachCell({ orderId, files }: { orderId: string; files: OrderFile[] }) {
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const upload = useUploadOrderFile()
  const remove = useDeleteOrderFile()

  async function handleOpen(file: OrderFile) {
    const url = await getOrderFileUrl(file.storage_path)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full h-full min-h-[28px] px-1 py-1 text-sm text-left hover:text-blue-400"
      >
        {files.length === 0 ? (
          <span className="text-white/25 text-xs">— trống —</span>
        ) : (
          <span className="whitespace-nowrap">📎 {files.length}</span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-white/10 bg-neutral-900 p-5 shadow-2xl"
          >
            <h3 className="text-white font-medium mb-3">File đính kèm</h3>

            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {files.length === 0 && <p className="text-sm text-white/40">Chưa có file nào.</p>}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between gap-2 rounded border border-white/10 px-2.5 py-1.5"
                >
                  <button
                    onClick={() => handleOpen(file)}
                    className="text-sm text-blue-400 hover:text-blue-300 truncate text-left"
                    title={file.file_name}
                  >
                    {file.file_name}
                  </button>
                  <button
                    onClick={() => remove.mutate({ id: file.id, storagePath: file.storage_path })}
                    className="text-white/40 hover:text-red-400 text-sm shrink-0"
                    title="Xóa file"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) upload.mutate({ orderId, file })
                e.target.value = ''
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={upload.isPending}
              className="mt-3 w-full rounded-md border border-dashed border-white/20 py-2 text-sm text-white/60 hover:border-blue-500 hover:text-blue-400 disabled:opacity-50"
            >
              {upload.isPending ? 'Đang tải lên...' : '+ Tải file lên'}
            </button>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
