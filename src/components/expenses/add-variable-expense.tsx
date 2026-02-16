'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addVariableExpense } from "@/actions/variable-expenses"
import { Plus, X, Calendar, CreditCard, Tag } from "lucide-react"

export function AddVariableExpense({
    categories,
    users,
    paymentMethods
}: {
    categories: any[],
    users: any[],
    paymentMethods: any[]
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [categoryId, setCategoryId] = useState(categories[0]?.id || "")
    const [paidById, setPaidById] = useState(users[0]?.id || "")
    const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id || "")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount || !description) return

        await addVariableExpense({
            description,
            amount: parseFloat(amount),
            date: new Date(date),
            categoryId,
            paidById,
            paymentMethodId
        })

        setIsOpen(false)
        setAmount("")
        setDescription("")
        // Keep other fields as defaults for easier rapid entry
    }

    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 z-50 pointer-events-auto"
                onClick={() => setIsOpen(true)}
            >
                <Plus className="h-8 w-8 text-white" />
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Nuevo Gasto</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Monto</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-8 text-lg font-bold"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-500">Descripción</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="¿Qué compraste?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Fecha
                            </label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                <Tag className="h-3 w-3" /> Categoría
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Pagado por</label>
                            <div className="flex gap-2">
                                {users.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => setPaidById(user.id)}
                                        className={`flex-1 py-2 text-sm rounded-md border transition-colors ${paidById === user.id
                                                ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {user.name.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                <CreditCard className="h-3 w-3" /> Método
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={paymentMethodId}
                                onChange={(e) => setPaymentMethodId(e.target.value)}
                            >
                                {paymentMethods.map(pm => (
                                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 mt-4">
                        Guardar Gasto
                    </Button>
                </form>
            </div>
        </div>
    )
}
