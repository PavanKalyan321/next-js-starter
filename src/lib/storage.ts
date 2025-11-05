import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

// Initialize S3 client for Digital Ocean Spaces (or any S3-compatible storage)
const s3Client = new S3Client({
  endpoint: process.env.STORAGE_ENDPOINT || 'https://nyc3.digitaloceanspaces.com',
  region: process.env.STORAGE_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY || '',
    secretAccessKey: process.env.STORAGE_SECRET_KEY || '',
  },
  forcePathStyle: false, // Required for Digital Ocean Spaces
})

const BUCKET_NAME = process.env.STORAGE_BUCKET || 'devportal-files'

export interface UploadResult {
  key: string
  url: string
  size: number
}

/**
 * Upload a file to cloud storage
 */
export async function uploadFile(
  file: File | Buffer,
  filename: string,
  contentType?: string
): Promise<UploadResult> {
  const key = `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`

  const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
      ACL: 'public-read', // Make files publicly accessible
    },
  })

  await upload.done()

  const url = `${process.env.STORAGE_ENDPOINT?.replace('https://', `https://${BUCKET_NAME}.`)}/${key}`

  return {
    key,
    url,
    size: buffer.length,
  }
}

/**
 * Delete a file from cloud storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

/**
 * Generate a signed URL for temporary access (optional)
 */
export function getPublicUrl(key: string): string {
  return `${process.env.STORAGE_ENDPOINT?.replace('https://', `https://${BUCKET_NAME}.`)}/${key}`
}

export interface StorageFile {
  key: string
  filename: string
  size: number
  lastModified: string
  url: string
}

/**
 * List all files in the bucket
 */
export async function listFiles(): Promise<StorageFile[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'uploads/', // Only list files in the uploads folder
    })

    const response = await s3Client.send(command)

    if (!response.Contents) {
      return []
    }

    return response.Contents.map((item) => ({
      key: item.Key || '',
      filename: item.Key?.split('/').pop() || '',
      size: item.Size || 0,
      lastModified: item.LastModified?.toISOString() || new Date().toISOString(),
      url: getPublicUrl(item.Key || ''),
    }))
  } catch (error) {
    console.error('Error listing files:', error)
    throw new Error('Failed to list files from storage')
  }
}
