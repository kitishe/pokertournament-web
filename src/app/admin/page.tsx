'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getGroupByCode } from '@/lib/services'

export default function AdminPage() {
  const [groupId, setGroupId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupId.trim()) {
      setError('Please enter a group ID')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const group = await getGroupByCode(groupId.trim())
      router.push(`/admin/${group.id}`)
    } catch (err) {
      console.error('Error finding group:', err)
      setError('Group not found. Please check the group ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Enter group ID to manage tournaments
          </p>
        </div>
        
        <div className="dashboard-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-2">
                Group ID
              </label>
              <input
                id="groupId"
                type="text"
                placeholder="Enter group ID"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value.toUpperCase())}
                disabled={loading}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 uppercase tracking-wider"
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full dashboard-btn-primary"
            >
              {loading ? 'Loading...' : 'Manage Tournaments'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}