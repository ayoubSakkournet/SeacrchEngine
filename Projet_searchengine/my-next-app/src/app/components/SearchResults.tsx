'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Patent {
  id: string
  title: string
  abstract: string
  inventors: string[]
}

interface SearchResponse {
  success?: boolean
  data?: Patent[]
  count?: number
  error?: string
  details?: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<Patent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      setLoading(true)
      setError(null)
      
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({
              error: `HTTP error! status: ${res.status}`
            }))
            throw new Error(errorData.error || 'Failed to fetch patents')
          }
          return res.json()
        })
        .then((data: SearchResponse) => {
          if (data.error) {
            throw new Error(data.error)
          }
          setResults(data.data || [])
          setLoading(false)
        })
        .catch((err) => {
          console.error('Error fetching patents:', err)
          setError(err.message || 'An unexpected error occurred while fetching patents')
          setLoading(false)
        })
    }
  }, [query])

  if (!query) return null

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search Results for "{query}"</h2>
      {loading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {!loading && !error && results.length === 0 && (
        <p className="text-gray-600">No patents found for your search query.</p>
      )}
      {!loading && !error && results.length > 0 && (
        <ul className="space-y-4">
          {results.map((patent) => (
            <li key={patent.id} className="border p-4 rounded shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold">{patent.title}</h3>
              <p className="text-sm text-gray-600">Patent ID: {patent.id}</p>
              {patent.inventors.length > 0 && (
                <p className="text-sm text-gray-600">Inventors: {patent.inventors.join(', ')}</p>
              )}
              {patent.abstract && <p className="mt-2">{patent.abstract}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

