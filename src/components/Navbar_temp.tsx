import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { getCurrentDbUser } from '@/lib/actions/user'

export default async function Navbar() {
  const user = await getCurrentDbUser()

  return (
    <nav className="bg-slate-800 border-b border-slate-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold">
          Doubt<span className="text-indigo-400">Bridge</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/doubts" className="hover:text-indigo-400">Doubts</Link>
          {user?.role === 'JUNIOR' && (
            <Link href="/ask" className="hover:text-indigo-400">Ask Doubt</Link>
          )}
          <Link href="/leaderboard" className="hover:text-indigo-400">Leaderboard</Link>
          <Link href="/profile" className="hover:text-indigo-400">Profile</Link>
          {user?.role === 'SENIOR' && (
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-sm">
              {user.points} pts
            </span>
          )}
          <UserButton />
        </div>
      </div>
    </nav>
  )
}