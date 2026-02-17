'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } })
        return categories
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        return []
    }
}

export async function addCategory(name: string, icon: string, color?: string) {
    try {
        await prisma.category.create({
            data: { name, icon, ...(color && { color }) }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to add category:', error)
        return { success: false, error: 'Error al agregar categoría' }
    }
}

export async function updateCategory(id: string, name: string, icon: string, color?: string) {
    try {
        await prisma.category.update({
            where: { id },
            data: { name, icon, ...(color && { color }) }
        })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to update category:', error)
        return { success: false, error: 'Error al actualizar categoría' }
    }
}

export async function deleteCategory(id: string) {
    try {
        const count = await prisma.expense.count({ where: { categoryId: id } })
        if (count > 0) {
            return { success: false, error: `No se puede eliminar: tiene ${count} gasto(s) asociado(s)` }
        }
        await prisma.category.delete({ where: { id } })
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete category:', error)
        return { success: false, error: 'Error al eliminar categoría' }
    }
}
