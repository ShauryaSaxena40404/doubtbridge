'use server'

import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createDoubt(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser || dbUser.role !== 'JUNIOR') throw new Error('Only juniors can ask')

  const title = formData.get('title') as string
  const subject = formData.get('subject') as string
  const description = formData.get('description') as string

  await prisma.doubt.create({
    data: { title, subject, description, juniorId: dbUser.id },
  })

  revalidatePath('/doubts')
  redirect('/doubts')
}

export async function createAnswer(doubtId: string, content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser || dbUser.role !== 'SENIOR') throw new Error('Only seniors can answer')

  await prisma.answer.create({
    data: { content, doubtId, seniorId: dbUser.id },
  })

  revalidatePath(`/doubts/${doubtId}`)
}

export async function acceptAnswer(answerId: string, doubtId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('No user')

  const doubt = await prisma.doubt.findUnique({ where: { id: doubtId } })
  if (!doubt || doubt.juniorId !== dbUser.id) throw new Error('Not your doubt')
  if (doubt.status === 'SOLVED') throw new Error('Already solved')

  const answer = await prisma.answer.findUnique({ where: { id: answerId } })
  if (!answer) throw new Error('Answer not found')

  // TRANSACTION: All these happen together or none happen
  await prisma.$transaction([
    prisma.answer.update({
      where: { id: answerId },
      data: { isAccepted: true },
    }),
    prisma.doubt.update({
      where: { id: doubtId },
      data: { status: 'SOLVED' },
    }),
    prisma.user.update({
      where: { id: answer.seniorId },
      data: { points: { increment: 20 } },
    }),
    prisma.pointTransaction.create({
      data: {
        userId: answer.seniorId,
        points: 20,
        reason: `Accepted answer for doubt: ${doubt.title}`,
      },
    }),
  ])

  revalidatePath(`/doubts/${doubtId}`)
  revalidatePath('/leaderboard')
}