import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="flex w-full flex-col items-center gap-4 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        404 — Page not found
      </h1>
      <Link to="/" className="text-slate-600 underline hover:text-slate-900">
        Go back home
      </Link>
    </section>
  )
}

export default NotFound
