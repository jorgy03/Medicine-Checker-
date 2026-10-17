import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <span className="mr-4 text-lg font-semibold text-slate-900">
            💊 Pill Checker
          </span>
          <NavLink to="/" className={navLinkClass} end>
            Search
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>
      </header>

      <div className="bg-amber-50 px-4 py-2 text-center text-xs text-amber-800">
        For reference only — not a substitute for advice from a pharmacist or
        doctor.
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-4 text-sm text-slate-500">
          Drug data from{' '}
          <a
            href="https://rxnav.nlm.nih.gov/"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-slate-900"
          >
            NLM RxNorm
          </a>
          . Built with React, Vite, TypeScript &amp; Tailwind CSS.
        </div>
      </footer>
    </div>
  )
}

export default Layout
