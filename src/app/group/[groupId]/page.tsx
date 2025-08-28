'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getTournamentsByGroupId, getGroupById } from '@/lib/services'
import { formatMoney } from '@/lib/currency'
import { Tournament, Group } from '@/lib/services'

export default function GroupPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  
  const [tournaments, setTournaments] = useState<(Tournament & { name?: string })[]>([])
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [tournamentsData, groupData] = await Promise.all([
          getTournamentsByGroupId(groupId),
          getGroupById(groupId)
        ])
        setTournaments(tournamentsData)
        setGroup(groupData)
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Failed to load tournaments. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (groupId) {
      loadData()
    }
  }, [groupId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading tournaments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error}</p>
              <Button onClick={() => router.push('/')}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tournament History</h1>
              {group && (
                <p className="text-gray-600 mt-1">{group.name}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href={`/analytics/${groupId}`}>
                <button className="dashboard-btn">
                  Analytics
                </button>
              </Link>
              <button onClick={() => router.push('/')} className="dashboard-btn">
                Change Group
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="dashboard-header">Tournaments</h2>
              <p className="dashboard-subtext">
                Click on any tournament to view detailed results
              </p>
            </div>
          </div>
          
          {tournaments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-gray-600">
                No tournaments found for this group.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buy-in
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bounty
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Prize Pool
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tournaments.map((tournament) => (
                    <tr 
                      key={tournament.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/tournament/${tournament.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(tournament.created_at), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(tournament.created_at), 'EEEE')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tournament.name || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-900">
                        {formatMoney(tournament.buy_in, (tournament as any).currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {tournament.bounty ? formatMoney(tournament.bounty, (tournament as any).currency) : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-orange-600">
                        {formatMoney(tournament.prize_pool, (tournament as any).currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}