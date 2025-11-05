'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  FolderKanban,
  FileArchive,
  Lightbulb,
  Bot,
  Upload,
  Plus,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

// Mock data - replace with actual API calls
const stats = {
  total_projects: 12,
  total_files: 48,
  active_ideas: 7,
  running_bots: 3,
}

const recentActivity = [
  {
    id: 1,
    type: 'file',
    action: 'Uploaded authentication-service.zip',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 2,
    type: 'project',
    action: 'Created new project: E-Commerce Platform',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 3,
    type: 'idea',
    action: 'Updated idea: AI-Powered Search Feature',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 4,
    type: 'bot',
    action: 'Started Crypto Trading Bot',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Code ZIP
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add New Project
            </Button>
            <Button variant="outline" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Add New Idea
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={stats.total_projects}
          icon={FolderKanban}
          color="bg-blue-500"
          trend="+2 this month"
        />
        <StatCard
          title="Code Vault Files"
          value={stats.total_files}
          icon={FileArchive}
          color="bg-purple-500"
          trend="+8 this week"
        />
        <StatCard
          title="Active Ideas"
          value={stats.active_ideas}
          icon={Lightbulb}
          color="bg-yellow-500"
          trend="3 in progress"
        />
        <StatCard
          title="Running Bots"
          value={stats.running_bots}
          icon={Bot}
          color="bg-green-500"
          trend="All operational"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  icon: any
  color: string
  trend: string
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getActivityIcon(type: string) {
  const icons: Record<string, any> = {
    file: FileArchive,
    project: FolderKanban,
    idea: Lightbulb,
    bot: Bot,
  }
  const Icon = icons[type] || FileArchive
  return <Icon className="w-5 h-5 text-white" />
}

function getActivityColor(type: string) {
  const colors: Record<string, string> = {
    file: 'bg-purple-500',
    project: 'bg-blue-500',
    idea: 'bg-yellow-500',
    bot: 'bg-green-500',
  }
  return colors[type] || 'bg-gray-500'
}
