'use server'

import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { UserRole } from '@prisma/client'

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth()
  const user = await currentUser()
  
  if (!userId || !user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const role = formData.get('role') as UserRole
  const college = formData.get('college') as string
  const department = formData.get('department') as string
  const year = parseInt(formData.get('year') as string)

  await prisma.user.upsert({
    where: { clerkId: userId },
    update: { name, role, college, department, year },
    create: {
      clerkId: userId,
      email: user.emailAddresses[0].emailAddress,
      name,
      role,
      college,
      department,
      year,
    },
  })

  redirect('/dashboard')
}

export async function getCurrentDbUser() {
  const { userId } = await auth()
  if (!userId) return null
  
  return await prisma.user.findUnique({
    where: { clerkId: userId },
  })
}