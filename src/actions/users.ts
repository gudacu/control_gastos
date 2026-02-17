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

export async function updateUser(userId: string, name: string, color: string) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { name, color },
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to update user:', error)
        return { success: false, error: 'Failed to update user' }
    }
}

export async function addUser(name: string, amount: number, color?: string) {
    try {
        await prisma.user.create({
            data: { name, amount, ...(color && { color }) }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to add user:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return { success: false, error: `Failed to add user: ${errorMessage}` }
    }
}
