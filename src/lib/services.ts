import { supabase } from './supabase'
import { Tables } from './database.types'

export type Group = Tables<'groups'>
export type Tournament = Tables<'tournaments'>
export type Participant = Tables<'participants'>

export async function getGroupByCode(code: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('code', code)
    .single()
  
  if (error) throw error
  return data
}

export async function getGroupById(id: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getTournamentsByGroupId(groupId: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getTournamentById(tournamentId: string) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()
  
  if (error) throw error
  return data
}

export async function getParticipantsByTournamentId(tournamentId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('place', { ascending: true, nullsFirst: false })
  
  if (error) throw error
  return data
}

export async function getAllParticipantsByGroupId(groupId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select(`
      *,
      tournaments!inner (
        name,
        group_id,
        created_at,
        buy_in,
        prize_pool
      )
    `)
    .eq('tournaments.group_id', groupId)
  
  if (error) throw error
  return data
}

export async function getAnalyticsData(groupId: string) {
  const { data: participants, error } = await supabase
    .from('participants')
    .select(`
      *,
      tournaments!inner (
        id,
        name,
        group_id,
        created_at,
        buy_in,
        prize_pool
      )
    `)
    .eq('tournaments.group_id', groupId)
  
  if (error) throw error
  return participants
}

export async function deleteTournament(tournamentId: string) {
  // First check if tournament exists
  const { data: tournament, error: fetchError } = await supabase
    .from('tournaments')
    .select('id')
    .eq('id', tournamentId)
    .single()
  
  if (fetchError) {
    console.error('Tournament not found:', fetchError)
    throw new Error('Tournament not found')
  }

  // Delete the tournament (assuming CASCADE delete handles participants)
  const { data: deletedTournament, error: tournamentError } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', tournamentId)
    .select()
  
  if (tournamentError) {
    console.error('Error deleting tournament:', tournamentError)
    throw tournamentError
  }

  console.log('Deleted tournament:', deletedTournament?.length || 0)
  
  if (deletedTournament?.length === 0) {
    throw new Error('Tournament deletion failed - no rows affected. Check RLS policies.')
  }
}

export async function getPlayersByGroupId(groupId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select(`
      name,
      tournaments!inner (
        group_id
      )
    `)
    .eq('tournaments.group_id', groupId)
  
  if (error) throw error
  
  // Get unique player names
  const uniquePlayers = Array.from(
    new Set(data.map(p => p.name))
  ).map(name => ({ name }))
  
  return uniquePlayers
}

export async function deletePlayerFromGroup(playerName: string, groupId: string) {
  // First get all tournament IDs for this group
  const tournaments = await getTournamentsByGroupId(groupId)
  const tournamentIds = tournaments.map(t => t.id)
  
  if (tournamentIds.length === 0) {
    throw new Error('No tournaments found for this group')
  }
  
  // Delete all participant records for this player in tournaments of this group
  const { data: deletedParticipants, error: participantsError } = await supabase
    .from('participants')
    .delete()
    .in('tournament_id', tournamentIds)
    .eq('name', playerName)
    .select()
  
  if (participantsError) {
    console.error('Error deleting player participants:', participantsError)
    throw participantsError
  }

  console.log('Deleted player participants:', deletedParticipants?.length || 0)
  
  if (deletedParticipants?.length === 0) {
    throw new Error('Player deletion failed - no participant records found.')
  }
}