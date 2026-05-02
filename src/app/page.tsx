import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-bold mb-4">
        Doubt<span className="text-indigo-400">Bridge</span>
      </h1>
      <p className="text-xl text-slate-400 mb-8">
        Connecting juniors with seniors to reduce academic stress
      </p>
      <div className="flex gap-4">
        <Link href="/sign-in" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">
          Sign In
        </Link>
        <Link href="/sign-up" className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600">
          Sign Up
        </Link>
      </div>
    </main>
  )
}