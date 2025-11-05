'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, Search, Calendar, FolderOpen } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Project } from '@/types'

// Mock data - replace with API call
const mockProjects: Project[] = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration',
    created_on: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Authentication Service',
    description: 'OAuth2 and JWT-based authentication microservice',
    created_on: '2024-02-20T14:20:00Z',
  },
  {
    id: 3,
    name: 'Data Analytics Dashboard',
    description: 'Real-time analytics and visualization platform',
    created_on: '2024-03-10T09:15:00Z',
  },
  {
    id: 4,
    name: 'Mobile App Backend',
    description: 'REST API backend for iOS and Android applications',
    created_on: '2024-03-25T16:45:00Z',
  },
]

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [projects] = useState<Project[]>(mockProjects)

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize all your development projects
          </p>
        </div>
        <Button variant="primary" className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {formatDate(project.created_on)}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by creating your first project'}
            </p>
            {!searchQuery && (
              <Button variant="primary" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
