import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { listFiles } from '@/lib/storage'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // List files from bucket
    const files = await listFiles()

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error('List files error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch files. Please try again.' },
      { status: 500 }
    )
  }
}
