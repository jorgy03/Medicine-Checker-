const BASE_URL = 'https://rxnav.nlm.nih.gov/REST'

export interface SearchResult {
  rxcui: string
  name: string
}

export interface DrugProperties {
  rxcui: string
  name: string
  tty: string
}

export interface DrugCodes {
  atc?: string[]
  snomedCt?: string[]
  drugBank?: string[]
  splSetIds?: string[]
  prescribable: boolean
}

export interface RelatedConcept {
  rxcui: string
  name: string
}

export type RelatedGroups = Partial<Record<'BN' | 'IN' | 'SCD' | 'SBD', RelatedConcept[]>>

const TTY_LABELS: Record<string, string> = {
  IN: 'Ingredient',
  BN: 'Brand Name',
  SCD: 'Generic Drug',
  SBD: 'Branded Drug',
  PIN: 'Precise Ingredient',
}

export function ttyLabel(tty: string): string {
  return TTY_LABELS[tty] ?? tty
}

interface ApproximateCandidate {
  rxcui: string
  score: string
  name?: string | null
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) {
    throw new Error(`RxNorm request failed (${res.status}): ${path}`)
  }
  return res.json() as Promise<T>
}

export async function searchDrugs(term: string): Promise<SearchResult[]> {
  if (!term.trim()) return []

  const data = await fetchJson<{
    approximateGroup?: { candidate?: ApproximateCandidate[] }
  }>(`/approximateTerm.json?term=${encodeURIComponent(term)}&maxEntries=20`)

  const candidates = data.approximateGroup?.candidate ?? []
  const byRxcui = new Map<string, ApproximateCandidate>()

  for (const candidate of candidates) {
    const existing = byRxcui.get(candidate.rxcui)
    if (!existing || (!existing.name && candidate.name)) {
      byRxcui.set(candidate.rxcui, candidate)
    }
  }

  return Array.from(byRxcui.values())
    .filter((c): c is ApproximateCandidate & { name: string } => Boolean(c.name))
    .sort((a, b) => Number(b.score) - Number(a.score))
    .map((c) => ({ rxcui: c.rxcui, name: c.name }))
}

export async function getDrugProperties(rxcui: string): Promise<DrugProperties> {
  const data = await fetchJson<{
    properties?: { rxcui: string; name: string; tty: string }
  }>(`/rxcui/${rxcui}/properties.json`)

  if (!data.properties) {
    throw new Error(`No drug found for RxCUI ${rxcui}`)
  }
  return data.properties
}

export async function getDrugCodes(rxcui: string): Promise<DrugCodes> {
  const data = await fetchJson<{
    propConceptGroup?: {
      propConcept?: { propCategory: string; propName: string; propValue: string }[]
    }
  }>(`/rxcui/${rxcui}/allProperties.json?prop=all`)

  const props = data.propConceptGroup?.propConcept ?? []
  const codes: DrugCodes = { prescribable: false }

  for (const p of props) {
    if (p.propName === 'PRESCRIBABLE' && p.propValue === 'Y') codes.prescribable = true
    if (p.propName === 'ATC') (codes.atc ??= []).push(p.propValue)
    if (p.propName === 'SNOMEDCT') (codes.snomedCt ??= []).push(p.propValue)
    if (p.propName === 'DRUGBANK') (codes.drugBank ??= []).push(p.propValue)
    if (p.propName === 'SPL_SET_ID') (codes.splSetIds ??= []).push(p.propValue)
  }

  return codes
}

export async function getRelatedConcepts(rxcui: string): Promise<RelatedGroups> {
  const data = await fetchJson<{
    relatedGroup?: {
      conceptGroup?: { tty: string; conceptProperties?: RelatedConcept[] }[]
    }
  }>(`/rxcui/${rxcui}/related.json?tty=BN+IN+SCD+SBD`)

  const groups: RelatedGroups = {}
  for (const group of data.relatedGroup?.conceptGroup ?? []) {
    const tty = group.tty as keyof RelatedGroups
    if (group.conceptProperties?.length) {
      groups[tty] = group.conceptProperties.map((c) => ({ rxcui: c.rxcui, name: c.name }))
    }
  }
  return groups
}

export async function getNdcs(rxcui: string): Promise<string[]> {
  const data = await fetchJson<{
    ndcGroup?: { ndcList?: { ndc?: string[] } }
  }>(`/rxcui/${rxcui}/ndcs.json`)

  return data.ndcGroup?.ndcList?.ndc ?? []
}

export function dailyMedUrl(splSetId: string): string {
  return `https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=${splSetId}`
}
