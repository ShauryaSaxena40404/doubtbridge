import { getCurrentDbUser } from '@/lib/actions/user'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar_temp'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const user = await getCurrentDbUser()
  
  if (!user) redirect('/onboarding')
  if (!user.role) redirect('/onboarding')

  const totalDoubts = await prisma.doubt.count()
  const openDoubts = await prisma.doubt.count({ where: { status: 'OPEN' } })

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">Hi, {user.name}! 👋</h1>
        <p className="text-slate-400 mb-8">
          {user.role === 'JUNIOR' ? 'Got a doubt? Ask seniors!' : 'Help juniors and earn points!'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 p-6 rounded-xl">
            <p className="text-slate-400">Total Doubts</p>
            <p className="text-3xl font-bold">{totalDoubts}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl">
            <p className="text-slate-400">Open Doubts</p>
            <p className="text-3xl font-bold text-yellow-400">{openDoubts}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl">
            <p className="text-slate-400">Your Points</p>
            <p className="text-3xl font-bold text-indigo-400">{user.points}</p>
          </div>
        </div>

        <div className="flex gap-4">
          {user.role === 'JUNIOR' && (
            <Link href="/ask" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700">
              + Ask a Doubt
            </Link>
          )}
          <Link href="/doubts" className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600">
            View All Doubts
          </Link>
        </div>
      </main>
    </>
  )
}