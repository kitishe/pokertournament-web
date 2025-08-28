'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { getGroupById, getTournamentsByGroupId, deleteTournament, getPlayersByGroupId, deletePlayerFromGroup } from '@/lib/services'
import { formatMoney } from '@/lib/currency'
import type { Group, Tournament } from '@/lib/services'

export default function AdminGroupPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.groupId as string
  
  const [group, setGroup] = useState<Group | null>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [players, setPlayers] = useState<{name: string}[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [confirmDeletePlayer, setConfirmDeletePlayer] = useState<string | null>(null)
  const [deletingPlayer, setDeletingPlayer] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [groupId])

  const loadData = async () => {
    try {
      const [groupData, tournamentsData, playersData] = await Promise.all([
        getGroupById(groupId),
        getTournamentsByGroupId(groupId),
        getPlayersByGroupId(groupId)
      ])
      setGroup(groupData)
      setTournaments(tournamentsData)
      setPlayers(playersData)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (tournamentId: string) => {
    setConfirmDelete(tournamentId)
  }

  const handleConfirmDelete = async (tournamentId: string) => {
    setDeleting(tournamentId)
    try {
      await deleteTournament(tournamentId)
      setTournaments(tournaments.filter(t => t.id !== tournamentId))
      setConfirmDelete(null)
    } catch (err) {
      console.error('Error deleting tournament:', err)
      setError('Failed to delete tournament')
    } finally {
      setDeleting(null)
    }
  }

  const handleCancelDelete = () => {
    setConfirmDelete(null)
  }

  const handlePlayerDeleteClick = (playerName: string) => {
    setConfirmDeletePlayer(playerName)
  }

  const handleConfirmPlayerDelete = async (playerName: string) => {
    setDeletingPlayer(playerName)
    try {
      await deletePlayerFromGroup(playerName, groupId)
      setPlayers(players.filter(p => p.name !== playerName))
      setConfirmDeletePlayer(null)
    } catch (err) {
      console.error('Error deleting player:', err)
      setError('Failed to delete player')
    } finally {
      setDeletingPlayer(null)
    }
  }

  const handleCancelPlayerDelete = () => {
    setConfirmDeletePlayer(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            ← Back to Group Selection
          </button>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Admin Panel - {group?.name}
          </h1>
          <p className="text-gray-600">
            Manage tournaments and players for group {group?.code}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tournaments Section */}
          <div>
            {tournaments.length === 0 ? (
              <div className="dashboard-card text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tournaments</h2>
                <p className="text-gray-600">No tournaments found for this group.</p>
              </div>
            ) : (
              <div className="dashboard-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tournaments</h2>
                <div className="space-y-4">
                  {tournaments.map((tournament) => (
                    <div key={tournament.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {(tournament as any).name ? (tournament as any).name : 'Tournament'} - {format(new Date(tournament.created_at), 'MMM d, yyyy')}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1 space-y-1">
                            <p>Buy-in: {formatMoney(tournament.buy_in as any, (tournament as any).currency)}</p>
                            <p>Prize Pool: {formatMoney(tournament.prize_pool as any, (tournament as any).currency)}</p>
                            <p>Rake: {formatMoney(tournament.rake as any, (tournament as any).currency)}</p>
                            {(tournament as any).bounty && <p>Bounty: {formatMoney((tournament as any).bounty, (tournament as any).currency)}</p>}
                          </div>
                        </div>
                        <div>
                          {confirmDelete === tournament.id ? (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleConfirmDelete(tournament.id)}
                                disabled={deleting === tournament.id}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleting === tournament.id ? 'Deleting...' : 'Confirm'}
                              </button>
                              <button
                                onClick={handleCancelDelete}
                                disabled={deleting === tournament.id}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteClick(tournament.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Players Section */}
          <div>
            {players.length === 0 ? (
              <div className="dashboard-card text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Players</h2>
                <p className="text-gray-600">No players found for this group.</p>
              </div>
            ) : (
              <div className="dashboard-card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Players</h2>
                <div className="space-y-3">
                  {players.map((player) => (
                    <div key={player.name} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {player.name}
                          </h3>
                        </div>
                        <div>
                          {confirmDeletePlayer === player.name ? (
                            <div className="space-x-2">
                              <button
                                onClick={() => handleConfirmPlayerDelete(player.name)}
                                disabled={deletingPlayer === player.name}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                {deletingPlayer === player.name ? 'Deleting...' : 'Confirm'}
                              </button>
                              <button
                                onClick={handleCancelPlayerDelete}
                                disabled={deletingPlayer === player.name}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handlePlayerDeleteClick(player.name)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}