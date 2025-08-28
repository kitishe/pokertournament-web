'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getTournamentById, getParticipantsByTournamentId } from '@/lib/services'
import { Tournament, Participant } from '@/lib/services'
import { formatMoney } from '@/lib/currency'

export default function TournamentPage() {
  const params = useParams()
  const router = useRouter()
  const tournamentId = params.tournamentId as string
  
  const [tournament, setTournament] = useState<(Tournament & { name?: string }) | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [tournamentData, participantsData] = await Promise.all([
          getTournamentById(tournamentId),
          getParticipantsByTournamentId(tournamentId)
        ])
        setTournament(tournamentData)
        setParticipants(participantsData)
      } catch (err) {
        console.error('Error loading tournament:', err)
        setError('Failed to load tournament details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (tournamentId) {
      loadData()
    }
  }, [tournamentId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading tournament details...</div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-destructive">{error || 'Tournament not found'}</p>
              <Button onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const winners = participants.filter(p => p.place && p.won_amount > 0)
  const totalParticipants = participants.length
  const uniquePlayers = new Set(participants.map(p => p.name)).size
  const totalBuyIns = participants.reduce((sum, p) => sum + p.buy_ins, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Tournament Details</h1>
              {tournament.name && (
                <p className="text-gray-900 mt-1 font-medium">{tournament.name}</p>
              )}
              <p className="text-gray-600 mt-1">
                {format(new Date(tournament.created_at), 'EEEE, MMMM dd, yyyy')}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/analytics/${tournament.group_id}`}>
                <button className="dashboard-btn">
                  Analytics
                </button>
              </Link>
              <button onClick={() => router.back()} className="dashboard-btn">
                ← Back to Tournaments
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="dashboard-card">
            <div className="dashboard-header">Total Participants</div>
            <div className="dashboard-metric">{totalParticipants}</div>
            <div className="dashboard-subtext">players registered</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-header">Buy-ins</div>
            <div className="dashboard-metric">{totalBuyIns}</div>
            <div className="dashboard-subtext">{uniquePlayers} unique players</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-header">Prize Pool</div>
            <div className="dashboard-metric text-orange-600">{formatMoney(tournament.prize_pool, (tournament as any).currency)}</div>
            <div className="dashboard-subtext">Buy-in: {formatMoney(tournament.buy_in, (tournament as any).currency)}</div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-header">Bounty Pool</div>
            <div className="dashboard-metric">
              {tournament.bounty_pool ? formatMoney(tournament.bounty_pool, (tournament as any).currency) : 'N/A'}
            </div>
            <div className="dashboard-subtext">
              {tournament.bounty ? `${formatMoney(tournament.bounty, (tournament as any).currency)} each` : 'No bounties'}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-header">Winners & Payouts</div>
          <div className="dashboard-subtext mb-6">
            Players who finished in the money
          </div>
          
          {winners.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No winners recorded for this tournament.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Place
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buy-ins
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Winnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {winners.map((participant) => (
                    <tr key={participant.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.place}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {participant.buy_ins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-orange-600">
                        {formatMoney(participant.won_amount, (tournament as any).currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {participants.filter(p => !p.place || p.won_amount === 0).length > 0 && (
          <div className="dashboard-card">
            <div className="dashboard-header">All Participants</div>
            <div className="dashboard-subtext mb-6">
              Complete list of tournament participants
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Buy-ins
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Place
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Winnings
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {participants.map((participant) => (
                    <tr key={participant.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {participant.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {participant.buy_ins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {participant.place || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {formatMoney(participant.won_amount, (tournament as any).currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}