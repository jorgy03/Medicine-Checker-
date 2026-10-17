import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchDrugs, type SearchResult } from '../lib/rxnorm'

function Home() {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!term.trim()) {
      setResults([])
      setError(null)
      return
    }

    const timeout = setTimeout(() => {
      setLoading(true)
      setError(null)
      searchDrugs(term)
        .then(setResults)
        .catch(() => setError('Search failed. Please try again.'))
        .finally(() => setLoading(false))
    }, 300)

    return () => clearTimeout(timeout)
  }, [term])

  return (
    <section className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Pill Checker
        </h1>
        <p className="text-slate-600">
          Search a medication name to confirm what it is — brand/generic
          names, strengths, forms, and NDC codes, sourced from NLM RxNorm.
        </p>
      </div>

      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="e.g. lisinopril, Advil, metformin..."
        className="w-full rounded-md border border-slate-300 px-4 py-2 text-base outline-none focus:border-slate-500"
        autoFocus
      />

      {loading && <p className="text-sm text-slate-500">Searching...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && term.trim() && !error && results.length === 0 && (
        <p className="text-sm text-slate-500">No matches found.</p>
      )}

      <ul className="flex flex-col divide-y divide-slate-200 rounded-md border border-slate-200">
        {results.map((result) => (
          <li key={result.rxcui}>
            <Link
              to={`/drug/${result.rxcui}`}
              className="block px-4 py-3 text-slate-800 transition-colors hover:bg-slate-50"
            >
              {result.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Home
