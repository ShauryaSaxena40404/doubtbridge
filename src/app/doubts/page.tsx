import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar_temp'
import Link from 'next/link'

export default async function DoubtsPage() {
  const doubts = await prisma.doubt.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      junior: true,
      _count: { select: { answers: true } },
    },
  })

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">All Doubts</h1>

        {doubts.length === 0 ? (
          <p className="text-slate-400">No doubts yet. Be the first to ask!</p>
        ) : (
          <div className="space-y-3">
            {doubts.map((doubt:any) => (
              <Link
                key={doubt.id}
                href={`/doubts/${doubt.id}`}
                className="block bg-slate-800 p-5 rounded-xl hover:bg-slate-700 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{doubt.title}</h2>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    doubt.status === 'OPEN' 
                      ? 'bg-yellow-600' 
                      : 'bg-green-600'
                  }`}>
                    {doubt.status}
                  </span>
                </div>
                <div className="flex gap-3 text-sm text-slate-400">
                  <span className="bg-slate-700 px-2 py-0.5 rounded">{doubt.subject}</span>
                  <span>by {doubt.junior.name}</span>
                  <span>• {doubt._count.answers} answers</span>
                  <span>• {new Date(doubt.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}