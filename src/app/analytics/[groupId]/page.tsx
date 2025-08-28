'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getAnalyticsData } from '@/lib/services'
import {
  calculatePlayerStats,
  getMostPaidPlaces,
  getMostActivePlayer,
  getLudiki,
  getTournamentStats,
  getMostVisitedTournaments,
  getBiggestPrizePools,
  PlayerStats,
  TournamentStats
} from '@/lib/analytics'

export default function AnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([])
  const [tournamentStats, setTournamentStats] = useState<TournamentStats[]>([])

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        const data = await getAnalyticsData(groupId)
        
        const calculatedPlayerStats = calculatePlayerStats(data)
        const calculatedTournamentStats = getTournamentStats(data)
        
        setPlayerStats(calculatedPlayerStats)
        setTournamentStats(calculatedTournamentStats)
      } catch (err) {
        console.error('Error loading analytics:', err)
        setError('Failed to load analytics. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (groupId) {
      loadAnalytics()
    }
  }, [groupId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading analytics...</div>
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
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const mostPaidPlaces = getMostPaidPlaces(playerStats)
  const mostActivePlayer = getMostActivePlayer(playerStats)
  const ludiki = getLudiki(playerStats)
  const mostVisitedTournaments = getMostVisitedTournaments(tournamentStats)
  const biggestPrizePools = getBiggestPrizePools(tournamentStats)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive group performance insights</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push(`/group/${groupId}`)} className="dashboard-btn">
                ← Back to Tournaments
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dashboard-card">
            <div className="dashboard-header">Most Paid Places</div>
            <div className="dashboard-subtext mb-6">Players with most finishes in the money</div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      1st
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      2nd
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      3rd
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mostPaidPlaces.map((player) => {
                    const totalPaid = Object.values(player.paidPlaces).reduce((sum, count) => sum + count, 0)
                    return (
                      <tr key={player.name}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                          {player.paidPlaces[1] || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                          {player.paidPlaces[2] || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-900">
                          {player.paidPlaces[3] || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-orange-600">
                          {totalPaid}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-header">Most Active Players</div>
            <div className="dashboard-subtext mb-6">Players by tournament participation</div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tournaments
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mostActivePlayer.map((player) => (
                    <tr key={player.name}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {player.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-semibold text-orange-600">
                        {player.tournaments}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                        ${player.totalSpent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-header">Мажоры</div>
            <div className="dashboard-subtext mb-6">Most profitable players</div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Won
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Profit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {playerStats
                    .filter(p => p.netProfit > 0)
                    .sort((a, b) => b.netProfit - a.netProfit)
                    .slice(0, 10)
                    .map((player) => (
                      <tr key={player.name}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                          ${player.totalSpent}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900">
                          ${player.totalWon}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                          +${player.netProfit}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💸</span>
                <div>
                  <CardTitle className="text-xl">Лудики</CardTitle>
                  <CardDescription className="text-base">Players who spent more but won less</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Won</TableHead>
                    <TableHead>Net Loss</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ludiki.map((player) => (
                    <TableRow key={player.name}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>${player.totalSpent}</TableCell>
                      <TableCell>${player.totalWon}</TableCell>
                      <TableCell className="text-destructive">
                        ${Math.abs(player.netProfit)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>


        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎪</span>
                <div>
                  <CardTitle className="text-xl">Most Visited Tournaments</CardTitle>
                  <CardDescription className="text-base">Tournaments with highest participation</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Prize Pool</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostVisitedTournaments.map((tournament) => (
                    <TableRow 
                      key={tournament.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/tournament/${tournament.id}`)}
                    >
                      <TableCell>
                        {format(new Date(tournament.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{tournament.participants}</TableCell>
                      <TableCell>${tournament.prizePool}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <CardTitle className="text-xl">Biggest Prize Pools</CardTitle>
                  <CardDescription className="text-base">Tournaments with the largest prize pools</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Prize Pool</TableHead>
                    <TableHead>Participants</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {biggestPrizePools.map((tournament) => (
                    <TableRow 
                      key={tournament.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/tournament/${tournament.id}`)}
                    >
                      <TableCell>
                        {format(new Date(tournament.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        ${tournament.prizePool}
                      </TableCell>
                      <TableCell>{tournament.participants}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}