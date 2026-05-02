import { getCurrentDbUser } from '@/lib/actions/user'
import { createDoubt } from '@/lib/actions/doubt'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar_temp'

export default async function AskPage() {
  const user = await getCurrentDbUser()
  if (!user) redirect('/onboarding')
  if (user.role !== 'JUNIOR') redirect('/dashboard')

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Ask a Doubt</h1>
        
        <form action={createDoubt} className="space-y-4 bg-slate-800 p-6 rounded-xl">
          <div>
            <label className="block mb-1 text-sm">Title</label>
            <input
              name="title"
              required
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
              placeholder="e.g., How does recursion work?"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Subject</label>
            <select name="subject" required className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600">
              <option value="">Select subject</option>
              <option value="Programming">Programming</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Database">Database</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Description</label>
            <textarea
              name="description"
              required
              rows={6}
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
              placeholder="Explain your doubt in detail..."
            />
          </div>

          <button type="submit" className="w-full p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 font-semibold">
            Post Doubt
          </button>
        </form>
      </main>
    </>
  )
}