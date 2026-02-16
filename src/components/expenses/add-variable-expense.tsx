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
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-[#0f172a] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                <div className="flex justify-between items-center p-4 border-b border-white/5 bg-white/5">
                    <h2 className="text-lg font-semibold text-white">Nuevo Gasto</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white hover:bg-white/10">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-indigo-300 uppercase tracking-wider">Monto</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-xl">$</span>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="pl-10 h-16 text-3xl font-bold bg-black/20 border-white/10 text-white placeholder:text-white/10 rounded-xl focus:ring-indigo-500/50"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Descripción</label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="¿Qué compraste?"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/50 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Fecha
                            </label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-white/5 border-white/10 text-white h-10"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/50 flex items-center gap-1">
                                <Tag className="h-3 w-3" /> Categoría
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/50">Pagado por</label>
                            <div className="flex gap-2">
                                {users.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => setPaidById(user.id)}
                                        className={`flex-1 py-2 text-sm rounded-lg border transition-all ${paidById === user.id
                                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                                            }`}
                                    >
                                        {user.name.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-white/50 flex items-center gap-1">
                                <CreditCard className="h-3 w-3" /> Método
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                value={paymentMethodId}
                                onChange={(e) => setPaymentMethodId(e.target.value)}
                            >
                                {paymentMethods.map(pm => (
                                    <option key={pm.id} value={pm.id} className="bg-slate-900">{pm.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-900/20 mt-2 rounded-xl transition-all hover:scale-[1.02]">
                        Guardar Gasto
                    </Button>
                </form>
            </div>
        </div>
    )
}
