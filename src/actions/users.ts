'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateContribution(userId: string, amount: number) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { amount },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to update contribution:', error)
        return { success: false, error: 'Failed to update contribution' }
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' }
        })
        return users
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return []
    }
}
