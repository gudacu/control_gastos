'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getFixedExpenses() {
    try {
        const expenses = await prisma.expense.findMany({
            where: { type: 'FIXED' },
            orderBy: { date: 'desc' },
            include: { category: true, paidBy: true }
        })
        return expenses
    } catch (error) {
        console.error('Failed to fetch fixed expenses:', error)
        return []
    }
}

export async function addFixedExpense(data: { description: string, amount: number, categoryId: string, paidById: string }) {
    try {
        await prisma.expense.create({
            data: {
                ...data,
                date: new Date(), // For fixed expenses, date might just be creation date or recurring date
                type: 'FIXED'
            }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to add fixed expense:', error)
        return { success: false, error: 'Failed to add' }
    }
}

export async function updateFixedExpense(id: string, data: { description: string, amount: number, categoryId?: string }) {
    try {
        await prisma.expense.update({
            where: { id },
            data
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to update fixed expense:', error)
        return { success: false, error: 'Failed to update' }
    }
}

export async function deleteExpense(id: string) {
    try {
        await prisma.expense.delete({ where: { id } })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete expense:', error)
        return { success: false, error: 'Failed to delete' }
    }
}

export async function getVariableExpenses(month?: number, year?: number) {
    try {
        const now = new Date()
        const currentMonth = month ?? now.getMonth()
        const currentYear = year ?? now.getFullYear()

        const startDate = new Date(currentYear, currentMonth, 1)
        const endDate = new Date(currentYear, currentMonth + 1, 0)

        const expenses = await prisma.expense.findMany({
            where: {
                type: { in: ['VARIABLE', 'INCOME', 'ROLLOVER'] },
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { date: 'desc' },
            include: { category: true, paidBy: true, paymentMethod: true }
        })
        return expenses
    } catch (error) {
        console.error('Failed to fetch variable expenses:', error)
        return []
    }
}

export async function rolloverBalance(amount: number, fromMonth: number, fromYear: number) {
    try {
        // 1. Create Rollover Out in current month
        await prisma.expense.create({
            data: {
                description: "Rollover a mes siguiente",
                amount: amount,
                date: new Date(fromYear, fromMonth, 28), // End of month
                type: 'ROLLOVER',
                categoryId: (await prisma.category.findFirst())?.id || "",
                paidById: (await prisma.user.findFirst())?.id || ""
            }
        })

        // 2. Create Income (Rollover In) in next month
        const nextMonthDate = new Date(fromYear, fromMonth + 1, 1)
        await prisma.expense.create({
            data: {
                description: "Saldo anterior",
                amount: amount,
                date: nextMonthDate,
                type: 'INCOME',
                categoryId: (await prisma.category.findFirst())?.id || "",
                paidById: (await prisma.user.findFirst())?.id || ""
            }
        })

        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to rollover balance:', error)
        return { success: false, error: 'Failed to rollover' }
    }
}
