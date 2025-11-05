import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { uploadFile } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Validate file types (only ZIP files)
    const invalidFiles = files.filter(file => !file.name.endsWith('.zip'))
    if (invalidFiles.length > 0) {
      return NextResponse.json(
        { error: 'Only ZIP files are allowed' },
        { status: 400 }
      )
    }

    // Validate file sizes (max 100MB per file)
    const MAX_SIZE = 100 * 1024 * 1024 // 100MB
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE)
    if (oversizedFiles.length > 0) {
      return NextResponse.json(
        { error: 'Files must be less than 100MB' },
        { status: 400 }
      )
    }

    // Upload files to cloud storage
    const uploadPromises = files.map(async (file) => {
      const result = await uploadFile(file, file.name, file.type)
      return {
        filename: file.name,
        url: result.url,
        key: result.key,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      }
    })

    const uploadedFiles = await Promise.all(uploadPromises)

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
