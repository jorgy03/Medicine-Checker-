import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  dailyMedUrl,
  getDrugCodes,
  getDrugProperties,
  getNdcs,
  getRelatedConcepts,
  ttyLabel,
  type DrugCodes,
  type DrugProperties,
  type RelatedGroups,
} from '../lib/rxnorm'

function DrugDetail() {
  const { rxcui } = useParams<{ rxcui: string }>()
  const [properties, setProperties] = useState<DrugProperties | null>(null)
  const [codes, setCodes] = useState<DrugCodes | null>(null)
  const [related, setRelated] = useState<RelatedGroups>({})
  const [ndcs, setNdcs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!rxcui) return

    setLoading(true)
    setError(null)

    Promise.all([
      getDrugProperties(rxcui),
      getDrugCodes(rxcui),
      getRelatedConcepts(rxcui),
      getNdcs(rxcui),
    ])
      .then(([props, drugCodes, relatedConcepts, ndcList]) => {
        setProperties(props)
        setCodes(drugCodes)
        setRelated(relatedConcepts)
        setNdcs(ndcList)
      })
      .catch(() => setError('Could not load drug details.'))
      .finally(() => setLoading(false))
  }, [rxcui])

  if (loading) return <p className="text-sm text-slate-500">Loading...</p>
  if (error) return <p className="text-sm text-red-600">{error}</p>
  if (!properties) return null

  return (
    <section className="flex w-full flex-col gap-8">
      <div>
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-900">
          ← Back to search
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {properties.name}
        </h1>
        <p className="text-slate-600">
          {ttyLabel(properties.tty)} · RxCUI {properties.rxcui}
          {codes?.prescribable && ' · Prescribable'}
        </p>
      </div>

      {related.BN && (
        <DetailSection title="Brand Names">
          <ChipList items={related.BN.map((c) => c.name)} />
        </DetailSection>
      )}

      {related.IN && (
        <DetailSection title="Active Ingredient(s)">
          <ChipList items={related.IN.map((c) => c.name)} />
        </DetailSection>
      )}

      {related.SCD && (
        <DetailSection title="Generic Forms & Strengths">
          <RelatedList items={related.SCD} />
        </DetailSection>
      )}

      {related.SBD && (
        <DetailSection title="Branded Forms & Strengths">
          <RelatedList items={related.SBD} />
        </DetailSection>
      )}

      {ndcs.length > 0 && (
        <DetailSection title="National Drug Codes (NDC)">
          <ChipList items={ndcs} mono />
        </DetailSection>
      )}

      {codes && (codes.atc || codes.snomedCt || codes.drugBank) && (
        <DetailSection title="Reference Codes">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {codes.atc && (
              <>
                <dt className="font-medium text-slate-500">ATC</dt>
                <dd className="text-slate-800">{codes.atc.join(', ')}</dd>
              </>
            )}
            {codes.snomedCt && (
              <>
                <dt className="font-medium text-slate-500">SNOMED CT</dt>
                <dd className="text-slate-800">{codes.snomedCt.join(', ')}</dd>
              </>
            )}
            {codes.drugBank && (
              <>
                <dt className="font-medium text-slate-500">DrugBank</dt>
                <dd className="text-slate-800">{codes.drugBank.join(', ')}</dd>
              </>
            )}
          </dl>
        </DetailSection>
      )}

      {codes?.splSetIds && codes.splSetIds.length > 0 && (
        <DetailSection title="Full FDA Label">
          <a
            href={dailyMedUrl(codes.splSetIds[0])}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-600 underline hover:text-slate-900"
          >
            View on DailyMed ↗
          </a>
        </DetailSection>
      )}
    </section>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  )
}

function ChipList({ items, mono }: { items: string[]; mono?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800 ${
            mono ? 'font-mono' : ''
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function RelatedList({ items }: { items: { rxcui: string; name: string }[] }) {
  return (
    <ul className="flex flex-col divide-y divide-slate-200 rounded-md border border-slate-200">
      {items.map((item) => (
        <li key={item.rxcui}>
          <Link
            to={`/drug/${item.rxcui}`}
            className="block px-4 py-2 text-sm text-slate-800 transition-colors hover:bg-slate-50"
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default DrugDetail
