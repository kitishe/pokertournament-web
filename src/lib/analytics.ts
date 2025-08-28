export interface PlayerStats {
  name: string
  tournaments: number
  totalSpent: number
  totalWon: number
  paidPlaces: { [place: number]: number }
  netProfit: number
}

export interface TournamentStats {
  id: string
  date: string
  participants: number
  prizePool: number
  name?: string
  currency?: string
}

export function calculatePlayerStats(participants: any[]): PlayerStats[] {
  const playerMap = new Map<string, PlayerStats>()

  participants.forEach((participant: any) => {
    const name = participant.name
    const tournament = participant.tournaments
    
    if (!playerMap.has(name)) {
      playerMap.set(name, {
        name,
        tournaments: 0,
        totalSpent: 0,
        totalWon: 0,
        paidPlaces: {},
        netProfit: 0
      })
    }

    const stats = playerMap.get(name)!
    stats.tournaments += 1
    stats.totalSpent += participant.buy_ins * tournament.buy_in
    stats.totalWon += participant.won_amount

    if (participant.place && participant.won_amount > 0) {
      stats.paidPlaces[participant.place] = (stats.paidPlaces[participant.place] || 0) + 1
    }
  })

  playerMap.forEach((stats) => {
    stats.netProfit = stats.totalWon - stats.totalSpent
  })

  return Array.from(playerMap.values())
}

export function getMostPaidPlaces(playerStats: PlayerStats[]): PlayerStats[] {
  return playerStats
    .filter(p => Object.keys(p.paidPlaces).length > 0)
    .sort((a, b) => {
      const aTotalPaid = Object.values(a.paidPlaces).reduce((sum, count) => sum + count, 0)
      const bTotalPaid = Object.values(b.paidPlaces).reduce((sum, count) => sum + count, 0)
      return bTotalPaid - aTotalPaid
    })
    .slice(0, 10)
}

export function getMostActivePlayer(playerStats: PlayerStats[]): PlayerStats[] {
  return playerStats
    .sort((a, b) => b.tournaments - a.tournaments)
    .slice(0, 10)
}

export function getLudiki(playerStats: PlayerStats[]): PlayerStats[] {
  return playerStats
    .filter(p => p.netProfit < 0)
    .sort((a, b) => a.netProfit - b.netProfit)
    .slice(0, 10)
}

export function getTournamentStats(participants: any[]): TournamentStats[] {
  const tournamentMap = new Map<string, TournamentStats>()

  participants.forEach((participant: any) => {
    const tournament = participant.tournaments
    const id = tournament.id

    if (!tournamentMap.has(id)) {
      tournamentMap.set(id, {
        id,
        date: tournament.created_at,
        participants: 0,
        prizePool: tournament.prize_pool,
        name: tournament.name,
        currency: tournament.currency
      })
    }

    const stats = tournamentMap.get(id)!
    stats.participants += 1
  })

  return Array.from(tournamentMap.values())
}

export function getMostVisitedTournaments(tournamentStats: TournamentStats[]): TournamentStats[] {
  return tournamentStats
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 10)
}

export function getBiggestPrizePools(tournamentStats: TournamentStats[]): TournamentStats[] {
  return tournamentStats
    .sort((a, b) => b.prizePool - a.prizePool)
    .slice(0, 10)
}