'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Plus, Search, Lightbulb, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Idea } from '@/types'

// Mock data
const mockIdeas: Idea[] = [
  {
    id: 1,
    title: 'AI-Powered Search Feature',
    description:
      'Implement semantic search using embeddings to improve search relevance across the platform',
    tags: ['AI', 'Search', 'Backend'],
    status: 'Active',
    created_at: '2024-03-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Real-time Collaboration Tools',
    description:
      'Add WebSocket-based real-time editing and commenting features for team collaboration',
    tags: ['WebSockets', 'Collaboration', 'Frontend'],
    status: 'Active',
    created_at: '2024-03-18T14:20:00Z',
  },
  {
    id: 3,
    title: 'Performance Optimization Sprint',
    description:
      'Optimize database queries and implement caching layer to improve response times',
    tags: ['Performance', 'Database', 'Caching'],
    status: 'In Progress',
    created_at: '2024-02-10T09:15:00Z',
  },
  {
    id: 4,
    title: 'Mobile App Development',
    description: 'Research and prototype React Native mobile application',
    tags: ['Mobile', 'React Native', 'Research'],
    status: 'Paused',
    created_at: '2024-01-20T16:45:00Z',
  },
  {
    id: 5,
    title: 'GraphQL API Migration',
    description: 'Evaluate and plan migration from REST to GraphQL for better flexibility',
    tags: ['GraphQL', 'API', 'Architecture'],
    status: 'Completed',
    created_at: '2024-01-05T11:20:00Z',
  },
]

const statusVariants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  Active: 'success',
  'In Progress': 'warning',
  Paused: 'danger',
  Completed: 'default',
}

export default function IdeasPage() {
  const [ideas] = useState<Idea[]>(mockIdeas)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'All' || idea.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: ideas.length,
    active: ideas.filter((i) => i.status === 'Active').length,
    inProgress: ideas.filter((i) => i.status === 'In Progress').length,
    completed: ideas.filter((i) => i.status === 'Completed').length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ideas & Research</h1>
          <p className="mt-2 text-gray-600">
            Track your project ideas and research notes
          </p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" />
          New Idea
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Total Ideas</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.inProgress}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ideas, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIdeas.map((idea) => (
          <Link key={idea.id} href={`/ideas/${idea.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">{idea.title}</CardTitle>
                      <Badge variant={statusVariants[idea.status]}>
                        {idea.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {idea.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {idea.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-500">
                  Created {formatDate(idea.created_at)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No ideas found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Start tracking your brilliant ideas'}
            </p>
            {!searchQuery && filterStatus === 'All' && (
              <Button variant="primary" className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Idea
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
