'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileArchive, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from './ui/Button'
import { formatBytes } from '@/lib/utils'

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
  multiple?: boolean
  projectId?: number
}

export function FileUpload({
  onUpload,
  accept = { 'application/zip': ['.zip'] },
  maxSize = 100 * 1024 * 1024, // 100MB
  multiple = false,
  projectId,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError('')
      setSuccess(false)

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File is too large. Maximum size is ${formatBytes(maxSize)}`)
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Only ZIP files are allowed.')
        } else {
          setError('File upload failed. Please try again.')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        setUploadedFiles(acceptedFiles)
      }
    },
    [maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  })

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return

    setUploading(true)
    setError('')

    try {
      await onUpload(uploadedFiles)
      setSuccess(true)
      setUploadedFiles([])

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(files => files.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'}
          ${uploadedFiles.length > 0 ? 'border-green-500 bg-green-50' : ''}
        `}
      >
        <input {...getInputProps()} />

        <Upload className={`w-12 h-12 mx-auto mb-3 ${
          isDragActive ? 'text-primary-600' :
          uploadedFiles.length > 0 ? 'text-green-600' :
          'text-gray-400'
        }`} />

        {isDragActive ? (
          <p className="text-primary-600 font-medium">Drop the files here...</p>
        ) : uploadedFiles.length > 0 ? (
          <div>
            <p className="text-green-600 font-medium mb-1">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-sm text-gray-500">
              Drop more files or click to change selection
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-1">
              <span className="text-primary-600 font-medium">Click to upload</span> or
              drag and drop
            </p>
            <p className="text-sm text-gray-500">
              ZIP files only (max {formatBytes(maxSize)})
            </p>
          </div>
        )}
      </div>

      {/* Selected Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1">
                <FileArchive className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-sm text-gray-500">{formatBytes(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                disabled={uploading}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">Files uploaded successfully!</p>
        </div>
      )}

      {/* Upload Button */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 flex gap-3">
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setUploadedFiles([])
              setError('')
            }}
            disabled={uploading}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
