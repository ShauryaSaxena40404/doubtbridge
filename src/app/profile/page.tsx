import { getCurrentDbUser } from '@/lib/actions/user'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar_temp'

export default async function ProfilePage() {
  const user = await getCurrentDbUser()
  if (!user) redirect('/onboarding')

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto p-8">
        <div className="bg-slate-800 p-8 rounded-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Info label="Role" value={user.role || 'Not set'} />
            <Info label="College" value={user.college || '—'} />
            <Info label="Department" value={user.department || '—'} />
            <Info label="Year" value={user.year ? `Year ${user.year}` : '—'} />
            <Info label="Points" value={`${user.points} pts`} />
            <Info label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
          </div>
        </div>
      </main>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700 p-3 rounded-lg">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}