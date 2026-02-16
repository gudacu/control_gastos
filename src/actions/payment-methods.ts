'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getPaymentMethods() {
    try {
        const methods = await prisma.paymentMethod.findMany({ orderBy: { name: 'asc' } })
        return methods
    } catch (error) {
        console.error('Failed to fetch payment methods:', error)
        return []
    }
}

export async function addPaymentMethod(name: string) {
    try {
        await prisma.paymentMethod.create({
            data: { name }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to add payment method:', error)
        return { success: false, error: 'Error al agregar método de pago' }
    }
}

export async function updatePaymentMethod(id: string, name: string) {
    try {
        await prisma.paymentMethod.update({
            where: { id },
            data: { name }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to update payment method:', error)
        return { success: false, error: 'Error al actualizar método de pago' }
    }
}

export async function deletePaymentMethod(id: string) {
    try {
        const count = await prisma.expense.count({ where: { paymentMethodId: id } })
        if (count > 0) {
            return { success: false, error: `No se puede eliminar: tiene ${count} gasto(s) asociado(s)` }
        }
        await prisma.paymentMethod.delete({ where: { id } })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete payment method:', error)
        return { success: false, error: 'Error al eliminar método de pago' }
    }
}
