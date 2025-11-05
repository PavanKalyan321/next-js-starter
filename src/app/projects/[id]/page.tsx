'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FileUpload } from '@/components/FileUpload'
import {
  ArrowLeft,
  Upload,
  FileArchive,
  Calendar,
  Edit,
  Download,
} from 'lucide-react'
import { formatDate, formatBytes } from '@/lib/utils'
import { Project, CodeFile } from '@/types'
import { api } from '@/lib/api'

// Mock data
const mockProject: Project = {
  id: 1,
  name: 'E-Commerce Platform',
  description: 'Full-stack e-commerce solution with payment integration',
  created_on: '2024-01-15T10:30:00Z',
}

const mockFiles: CodeFile[] = [
  {
    id: 1,
    filename: 'authentication-service.zip',
    project_id: 1,
    size: 2458624,
    uploaded_at: '2024-03-20T14:30:00Z',
    file_path: '/uploads/auth-service.zip',
  },
  {
    id: 2,
    filename: 'payment-integration.zip',
    project_id: 1,
    size: 1854320,
    uploaded_at: '2024-03-22T09:15:00Z',
    file_path: '/uploads/payment.zip',
  },
]

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [project] = useState<Project>(mockProject)
  const [files, setFiles] = useState<CodeFile[]>(mockFiles)
  const [showUploadPanel, setShowUploadPanel] = useState(false)

  const handleUpload = async (uploadFiles: File[]) => {
    // In production, this would upload to your API
    // await api.uploadFile(uploadFiles[0], parseInt(id))
    console.log('Uploading files:', uploadFiles)

    // Simulate upload success
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add fake files to the list
    const newFiles = uploadFiles.map((file, idx) => ({
      id: files.length + idx + 1,
      filename: file.name,
      project_id: parseInt(id),
      size: file.size,
      uploaded_at: new Date().toISOString(),
      file_path: `/uploads/${file.name}`,
    }))

    setFiles([...files, ...newFiles])
    setShowUploadPanel(false)
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/projects">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>
      </Link>

      {/* Project Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{project.name}</CardTitle>
              <p className="text-gray-600">{project.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(project.created_on)}
                </div>
                <Badge variant="info">{files.length} files</Badge>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Panel */}
      {showUploadPanel && (
        <Card className="border-2 border-primary-500">
          <CardHeader className="bg-primary-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload Files to {project.name}
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
            <FileUpload onUpload={handleUpload} projectId={parseInt(id)} />
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {!showUploadPanel && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                className="gap-2"
                onClick={() => setShowUploadPanel(true)}
              >
                <Upload className="w-4 h-4" />
                Upload Code ZIP
              </Button>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Project Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Associated Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileArchive className="w-5 h-5" />
            Associated Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileArchive className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {formatBytes(file.size)} • Uploaded {formatDate(file.uploaded_at)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileArchive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No files uploaded yet</p>
              <Button variant="primary" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload First File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Project Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add notes about this project..."
            defaultValue="This project includes authentication, payment processing, and inventory management features."
          />
          <div className="mt-3">
            <Button variant="primary" size="sm">
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
