'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Bot,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  Activity,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Bot as BotType } from '@/types'

// Mock data
const mockBots: BotType[] = [
  {
    id: 1,
    name: 'Aviator Prediction Bot',
    description: 'Automated betting predictor for Aviator game with ML model',
    status: 'Running',
    last_updated: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    logs_url: '/bots/1/logs',
  },
  {
    id: 2,
    name: 'Crypto Trading Bot',
    description: 'Algorithmic trading bot for cryptocurrency markets',
    status: 'Running',
    last_updated: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    logs_url: '/bots/2/logs',
  },
  {
    id: 3,
    name: 'Dafabet Odds Bot',
    description: 'Real-time odds scraper and analyzer for sports betting',
    status: 'Running',
    last_updated: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    logs_url: '/bots/3/logs',
  },
  {
    id: 4,
    name: 'Discord Notification Bot',
    description: 'Automated alerts and notifications for Discord server',
    status: 'Stopped',
    last_updated: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    logs_url: '/bots/4/logs',
  },
  {
    id: 5,
    name: 'Web Scraper Bot',
    description: 'Generic web scraping service for data collection',
    status: 'Stopped',
    last_updated: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    logs_url: '/bots/5/logs',
  },
]

export default function BotsPage() {
  const [bots, setBots] = useState<BotType[]>(mockBots)

  const runningBots = bots.filter((b) => b.status === 'Running').length
  const stoppedBots = bots.filter((b) => b.status === 'Stopped').length

  const handleToggleBot = (botId: number) => {
    setBots(
      bots.map((bot) =>
        bot.id === botId
          ? {
              ...bot,
              status: bot.status === 'Running' ? 'Stopped' : 'Running',
              last_updated: new Date().toISOString(),
            }
          : bot
      )
    )
  }

  const handleRestartBot = (botId: number) => {
    setBots(
      bots.map((bot) =>
        bot.id === botId
          ? {
              ...bot,
              status: 'Running',
              last_updated: new Date().toISOString(),
            }
          : bot
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bots & Automations</h1>
        <p className="mt-2 text-gray-600">
          Monitor and control your automated services and bots
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bots</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{bots.length}</p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Running</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{runningBots}</p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stopped</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stoppedBots}</p>
              </div>
              <div className="p-3 bg-red-500 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bots List */}
      <div className="space-y-4">
        {bots.map((bot) => (
          <Card key={bot.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-lg ${
                    bot.status === 'Running' ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <Bot
                    className={`w-6 h-6 ${
                      bot.status === 'Running' ? 'text-green-600' : 'text-gray-600'
                    }`}
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bot.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {bot.description}
                      </p>
                    </div>
                    <Badge
                      variant={bot.status === 'Running' ? 'success' : 'danger'}
                    >
                      {bot.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Last updated {formatDateTime(bot.last_updated)}
                    </div>
                    {bot.logs_url && (
                      <a
                        href={bot.logs_url}
                        className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Logs
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    {bot.status === 'Running' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleToggleBot(bot.id)}
                        >
                          <Square className="w-4 h-4" />
                          Stop
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleRestartBot(bot.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Restart
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleToggleBot(bot.id)}
                      >
                        <Play className="w-4 h-4" />
                        Start
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Bot Management</h4>
              <p className="text-sm text-blue-700">
                Start and stop bots from this dashboard. For configuration changes or to
                deploy new bots, use the deployment scripts in your backend repository.
                Monitor logs to ensure bots are functioning correctly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
