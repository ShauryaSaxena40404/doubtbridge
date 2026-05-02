import { prisma } from '@/lib/prisma'
import { getCurrentDbUser } from '@/lib/actions/user'
import { createAnswer, acceptAnswer } from '@/lib/actions/doubt'
import Navbar from '@/components/Navbar_temp'
import { notFound } from 'next/navigation'

export default async function DoubtPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentDbUser()
  
  const doubt = await prisma.doubt.findUnique({
    where: { id },
    include: {
      junior: true,
      answers: {
        include: { senior: true },
        orderBy: [{ isAccepted: 'desc' }, { createdAt: 'asc' }],
      },
    },
  })

  if (!doubt) notFound()

  const isOwner = user?.id === doubt.juniorId
  const isSenior = user?.role === 'SENIOR'

  async function answerAction(formData: FormData) {
    'use server'
    const content = formData.get('content') as string
    await createAnswer(id, content)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-8">
        <div className="bg-slate-800 p-6 rounded-xl mb-6">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-3xl font-bold">{doubt.title}</h1>
            <span className={`text-xs px-3 py-1 rounded-full ${
              doubt.status === 'OPEN' ? 'bg-yellow-600' : 'bg-green-600'
            }`}>
              {doubt.status}
            </span>
          </div>
          <div className="flex gap-3 text-sm text-slate-400 mb-4">
            <span className="bg-slate-700 px-2 py-0.5 rounded">{doubt.subject}</span>
            <span>Asked by {doubt.junior.name}</span>
            <span>• {doubt.junior.department}, Year {doubt.junior.year}</span>
          </div>
          <p className="text-slate-200 whitespace-pre-wrap">{doubt.description}</p>
        </div>

        <h2 className="text-2xl font-bold mb-4">
          {doubt.answers.length} Answer{doubt.answers.length !== 1 ? 's' : ''}
        </h2>

        <div className="space-y-4 mb-6">
          {doubt.answers.map((answer: any) => (
            <div
              key={answer.id}
              className={`p-5 rounded-xl ${
                answer.isAccepted 
                  ? 'bg-green-900/30 border-2 border-green-600' 
                  : 'bg-slate-800'
              }`}
            >
              {answer.isAccepted && (
                <div className="text-green-400 text-sm font-bold mb-2">✓ Accepted Answer</div>
              )}
              <p className="text-slate-200 whitespace-pre-wrap mb-3">{answer.content}</p>
              <div className="flex justify-between items-center text-sm text-slate-400">
                <span>By {answer.senior.name} ({answer.senior.department})</span>
                {isOwner && doubt.status === 'OPEN' && !answer.isAccepted && (
                  <form action={async () => {
                    'use server'
                    await acceptAnswer(answer.id, id)
                  }}>
                    <button className="px-4 py-1 bg-green-600 rounded-lg hover:bg-green-700 text-white">
                      Accept Answer (+20 pts)
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>

        {isSenior && doubt.status === 'OPEN' && (
          <form action={answerAction} className="bg-slate-800 p-5 rounded-xl">
            <h3 className="font-bold mb-3">Write Your Answer</h3>
            <textarea
              name="content"
              required
              rows={5}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 mb-3"
              placeholder="Share your knowledge..."
            />
            <button type="submit" className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Post Answer
            </button>
          </form>
        )}

        {!isSenior && !isOwner && (
          <p className="text-slate-400 text-center">Only seniors can answer doubts</p>
        )}
      </main>
    </>
  )
}