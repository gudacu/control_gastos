'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function addVariableExpense(data: {
    description: string,
    amount: number,
    date: Date,
    categoryId: string,
    paidById: string,
    paymentMethodId?: string
}) {
    try {
        await prisma.expense.create({
            data: {
                ...data,
                type: 'VARIABLE'
            }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to add variable expense:', error)
        return { success: false, error: 'Failed to add' }
    }
}

export async function updateVariableExpense(id: string, data: {
    description?: string,
    amount?: number,
    date?: Date,
    categoryId?: string,
    paidById?: string,
    paymentMethodId?: string
}) {
    try {
        await prisma.expense.update({
            where: { id },
            data
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to update variable expense:', error)
        return { success: false, error: 'Failed to update' }
    }
}

