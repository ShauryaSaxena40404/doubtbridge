import { completeOnboarding, getCurrentDbUser } from '@/lib/actions/user'
import { redirect } from 'next/navigation'

export default async function OnboardingPage() {
  const dbUser = await getCurrentDbUser()
  
  // If already onboarded, skip
  if (dbUser?.role) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2">Welcome! 👋</h1>
        <p className="text-slate-400 mb-6">Let's set up your profile</p>
        
        <form action={completeOnboarding} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              name="name"
              required
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">I am a</label>
            <select name="role" required className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600">
              <option value="">Select role</option>
              <option value="JUNIOR">Junior (I need help)</option>
              <option value="SENIOR">Senior (I want to help)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">College</label>
            <input
              name="college"
              required
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
              placeholder="ABC College"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Department</label>
            <input
              name="department"
              required
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
              placeholder="Computer Science"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Year</label>
            <select name="year" required className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600">
              <option value="">Select year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <button type="submit" className="w-full p-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 font-semibold">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  )
}