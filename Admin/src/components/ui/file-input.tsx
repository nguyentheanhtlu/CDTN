import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  value?: string
  onChange?: (file: File | null) => void
  onClear?: () => void
  className?: string
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [preview, setPreview] = React.useState<string | null>(value || null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
        onChange?.(file)
      }
    }

    const handleClear = () => {
      setPreview(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      onClear?.()
      onChange?.(null)
    }

    return (
      <div className={cn("flex flex-col gap-4", className)}>
        <div
          className={cn(
            "relative flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800",
            !preview && "p-4"
          )}
          onClick={() => inputRef.current?.click()}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded-lg object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-gray-900/50 p-1 hover:bg-gray-900/75"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Click to upload image</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          {...props}
        />
      </div>
    )
  }
)
FileInput.displayName = "FileInput"

export { FileInput } 