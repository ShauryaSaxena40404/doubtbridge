import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar_temp'

export default async function LeaderboardPage() {
  const seniors = await prisma.user.findMany({
    where: { role: 'SENIOR' },
    orderBy: { points: 'desc' },
    take: 20,
  })

  const medals = ['🥇', '🥈', '🥉']

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-slate-400 mb-6">Top seniors helping juniors</p>

        <div className="bg-slate-800 rounded-xl overflow-hidden">
          {seniors.length === 0 ? (
            <p className="p-6 text-slate-400">No seniors yet!</p>
          ) : (
            seniors.map((senior, index) => (
              <div
                key={senior.id}
                className={`flex items-center justify-between p-4 border-b border-slate-700 ${
                  index < 3 ? 'bg-indigo-900/20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold w-10">
                    {medals[index] || `#${index + 1}`}
                  </span>
                  <div>
                    <p className="font-semibold">{senior.name}</p>
                    <p className="text-sm text-slate-400">
                      {senior.department} • Year {senior.year}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold text-indigo-400">
                  {senior.points} pts
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  )
}