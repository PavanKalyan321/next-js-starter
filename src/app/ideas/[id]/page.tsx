'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import {
  ArrowLeft,
  Edit,
  Save,
  Tag,
  Calendar,
  FileText,
  Trash2,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Idea } from '@/types'

// Mock data
const mockIdea: Idea = {
  id: 1,
  title: 'AI-Powered Search Feature',
  description:
    'Implement semantic search using embeddings to improve search relevance across the platform. This will allow users to find content based on meaning rather than just keywords.',
  tags: ['AI', 'Search', 'Backend'],
  status: 'Active',
  created_at: '2024-03-15T10:30:00Z',
  updated_at: '2024-03-20T14:25:00Z',
}

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  Active: 'success',
  'In Progress': 'warning',
  Paused: 'danger',
  Completed: 'default',
}

export default function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [idea, setIdea] = useState<Idea>(mockIdea)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(idea.title)
  const [editedDescription, setEditedDescription] = useState(idea.description)
  const [editedStatus, setEditedStatus] = useState(idea.status)
  const [newTag, setNewTag] = useState('')

  const handleSave = () => {
    setIdea({
      ...idea,
      title: editedTitle,
      description: editedDescription,
      status: editedStatus as Idea['status'],
      updated_at: new Date().toISOString(),
    })
    setIsEditing(false)
  }

  const handleAddTag = () => {
    if (newTag && !idea.tags.includes(newTag)) {
      setIdea({ ...idea, tags: [...idea.tags, newTag] })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setIdea({ ...idea, tags: idea.tags.filter((tag) => tag !== tagToRemove) })
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/ideas">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Ideas
        </Button>
      </Link>

      {/* Idea Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-2xl font-bold mb-4"
                />
              ) : (
                <CardTitle className="text-2xl mb-2">{idea.title}</CardTitle>
              )}

              <div className="flex items-center gap-3 mt-3">
                {isEditing ? (
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <Badge variant={statusVariants[idea.status]}>{idea.status}</Badge>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {formatDateTime(idea.created_at)}
                </div>
                {idea.updated_at && (
                  <div className="flex items-center gap-1">
                    Updated {formatDateTime(idea.updated_at)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="primary" className="gap-2" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{idea.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button variant="outline" onClick={handleAddTag}>
                Add
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add implementation notes, research findings, or next steps..."
            defaultValue="Research Options:
1. OpenAI Embeddings API
2. Sentence Transformers (open source)
3. Cohere Embed

Next Steps:
- Benchmark different embedding models
- Design vector database schema
- Create POC with sample dataset"
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
