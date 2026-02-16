'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addFixedExpense, deleteExpense, updateFixedExpense } from "@/actions/expenses"
import { Trash2, Pencil, Check, X, Plus } from "lucide-react"

type FixedExpense = {
    id: string
    description: string
    amount: number
    category?: { name: string, icon: string }
}

export function FixedExpensesList({ expenses, categories, users }: { expenses: FixedExpense[], categories: any[], users: any[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [newDescription, setNewDescription] = useState("")
    const [newAmount, setNewAmount] = useState("")

    // For simplicity, defaulting to first user and first category for quick add
    // In a real app, these would be selectors
    const defaultCategoryId = categories[0]?.id
    const defaultUserId = users[0]?.id

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editDescription, setEditDescription] = useState("")
    const [editAmount, setEditAmount] = useState("")

    const handleAdd = async () => {
        if (!newDescription || !newAmount) return
        await addFixedExpense({
            description: newDescription,
            amount: parseFloat(newAmount),
            categoryId: defaultCategoryId,
            paidById: defaultUserId
        })
        setIsAdding(false)
        setNewDescription("")
        setNewAmount("")
    }

    const startEdit = (expense: FixedExpense) => {
        setEditingId(expense.id)
        setEditDescription(expense.description)
        setEditAmount(expense.amount.toString())
    }

    const saveEdit = async () => {
        if (!editingId) return
        await updateFixedExpense(editingId, {
            description: editDescription,
            amount: parseFloat(editAmount)
        })
        setEditingId(null)
    }

    const handleDelete = async (id: string) => {
        if (confirm('¿Borrar gasto fijo?')) {
            await deleteExpense(id)
        }
    }

    return (
        <Card className="w-full shadow-md">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium text-gray-700">Gastos Fijos</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)}>
                    <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
            </CardHeader>
            <CardContent>
                {isAdding && (
                    <div className="flex gap-2 mb-4 items-end animate-in fade-in slide-in-from-top-2">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Descripción</label>
                            <Input
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Ej: Internet"
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-xs text-gray-500">Monto</label>
                            <Input
                                type="number"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                placeholder="$"
                            />
                        </div>
                        <Button size="icon" onClick={handleAdd}>
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            {editingId === expense.id ? (
                                <>
                                    <div className="flex-1 mr-2">
                                        <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="h-8" />
                                    </div>
                                    <div className="w-24 mr-2">
                                        <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-8" />
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={saveEdit}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setEditingId(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-gray-800">{expense.description}</div>
                                        <div className="text-xs text-gray-500">{expense.category?.name || 'General'}</div>
                                    </div>
                                    <div className="font-bold text-gray-700 mr-4">
                                        ${expense.amount.toLocaleString('es-AR')}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-500" onClick={() => startEdit(expense)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => handleDelete(expense.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {expenses.length === 0 && !isAdding && (
                        <div className="text-center text-gray-400 text-sm py-4">
                            No hay gastos fijos registrados.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
