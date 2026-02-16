'use client'

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        <GlassCard className="w-full relative overflow-hidden p-0">
            <div className="p-4 border-b border-white/5 flex flex-row items-center justify-between bg-black/20">
                <CardTitle className="text-lg font-medium text-white/90 tracking-wide">Gastos Fijos</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)} className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                    <Plus className="h-4 w-4 mr-1" /> Agregar
                </Button>
            </div>
            <CardContent className="p-4">
                {isAdding && (
                    <div className="flex gap-2 mb-4 items-end animate-in fade-in slide-in-from-top-2 bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="flex-1">
                            <label className="text-xs text-white/50 mb-1 block">Descripción</label>
                            <Input
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="Ej: Internet"
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/20"
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-xs text-white/50 mb-1 block">Monto</label>
                            <Input
                                type="number"
                                value={newAmount}
                                onChange={(e) => setNewAmount(e.target.value)}
                                placeholder="$"
                                className="bg-black/20 border-white/10 text-white placeholder:text-white/20"
                            />
                        </div>
                        <Button size="icon" onClick={handleAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="space-y-2">
                    {expenses.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:bg-black/30 transition-colors group">
                            {editingId === expense.id ? (
                                <>
                                    <div className="flex-1 mr-2">
                                        <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="h-8 bg-black/40 border-indigo-500/50 text-white" />
                                    </div>
                                    <div className="w-24 mr-2">
                                        <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} className="h-8 bg-black/40 border-indigo-500/50 text-white" />
                                    </div>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:bg-green-500/20" onClick={saveEdit}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-500/20" onClick={() => setEditingId(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-white/90">{expense.description}</div>
                                        <div className="text-xs text-white/50">{expense.category?.name || 'General'}</div>
                                    </div>
                                    <div className="font-bold text-white/90 mr-4">
                                        ${expense.amount.toLocaleString('es-AR')}
                                    </div>
                                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-white/5" onClick={() => startEdit(expense)}>
                                            <Pencil className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/5" onClick={() => handleDelete(expense.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {expenses.length === 0 && !isAdding && (
                        <div className="text-center text-white/30 text-sm py-8">
                            No hay gastos fijos registrados.
                        </div>
                    )}
                </div>
            </CardContent>
        </GlassCard>
    )
}
