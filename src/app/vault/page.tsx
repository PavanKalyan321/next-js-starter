'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FileUpload } from '@/components/FileUpload'
import {
  Upload,
  Search,
  Download,
  FileArchive,
  Filter,
  X,
  RefreshCw,
} from 'lucide-react'
import { formatDate, formatBytes } from '@/lib/utils'
import { CodeFile } from '@/types'

export default function VaultPage() {
  const [files, setFiles] = useState<CodeFile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showUploadPanel, setShowUploadPanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch files from the API
  const fetchFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/files')

      if (!response.ok) {
        throw new Error('Failed to fetch files')
      }

      const data = await response.json()

      // Transform storage files to CodeFile format
      const transformedFiles: CodeFile[] = data.files.map((file: any, index: number) => ({
        id: index + 1,
        filename: file.filename,
        project_id: 0,
        project_name: undefined,
        size: file.size,
        uploaded_at: file.lastModified,
        file_path: file.url,
      }))

      setFiles(transformedFiles)
    } catch (err) {
      console.error('Error fetching files:', err)
      setError('Failed to load files. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load files on component mount
  useEffect(() => {
    fetchFiles()
  }, [])

  const handleUpload = async (uploadFiles: File[]) => {
    // Upload files to server
    const formData = new FormData()
    uploadFiles.forEach(file => {
      formData.append('files', file)
    })

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const result = await response.json()

    // Refresh the file list to get updated data from bucket
    await fetchFiles()
    setShowUploadPanel(false)
  }

  const filteredFiles = files.filter((file) => {
    return file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Code Vault</h1>
          <p className="mt-2 text-gray-600">
            Manage and download your code archives
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={fetchFiles}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            className="gap-2"
            onClick={() => setShowUploadPanel(true)}
          >
            <Upload className="w-4 h-4" />
            Upload ZIP
          </Button>
        </div>
      </div>

      {/* Upload Panel */}
      {showUploadPanel && (
        <Card className="border-2 border-primary-500">
          <CardHeader className="bg-primary-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload Code Archive
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadPanel(false)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FileUpload onUpload={handleUpload} multiple />
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileArchive className="w-5 h-5" />
            Files ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Loading files...
              </h3>
              <p className="text-gray-600">
                Fetching files from storage
              </p>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Filename
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                      Uploaded
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileArchive className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-gray-900">
                            {file.filename}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatBytes(file.size)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(file.uploaded_at)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={file.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileArchive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No files found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Upload your first code archive to get started'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
