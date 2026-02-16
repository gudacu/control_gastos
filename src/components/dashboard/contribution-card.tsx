'use client'

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateContribution } from "@/actions/users"
import { Pencil, Check, X, Users } from "lucide-react"

type User = {
    id: string
    name: string
    amount: number
}

export function ContributionCard({ users }: { users: User[] }) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [tempAmount, setTempAmount] = useState<string>("")
    const [isPending, setIsPending] = useState(false)

    const totalBudget = users.reduce((acc, user) => acc + user.amount, 0)

    const handleEdit = (user: User) => {
        setEditingId(user.id)
        setTempAmount(user.amount.toString())
    }

    const handleSave = async (userId: string) => {
        setIsPending(true)
        const amount = parseFloat(tempAmount)
        if (isNaN(amount)) return

        await updateContribution(userId, amount)
        setEditingId(null)
        setIsPending(false)
    }

    const handleCancel = () => {
        setEditingId(null)
        setTempAmount("")
    }

    return (
        <GlassCard className="p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm">
                        <Users className="h-5 w-5 text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Fondo Común</span>
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                    ${totalBudget.toLocaleString('es-AR')}
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 transition-all hover:bg-black/30">
                        <div className="flex flex-col">
                            <span className="font-medium text-indigo-200 text-sm mb-0.5">{user.name}</span>
                            {editingId === user.id ? (
                                <Input
                                    type="number"
                                    value={tempAmount}
                                    onChange={(e) => setTempAmount(e.target.value)}
                                    className="h-8 w-28 bg-white/10 text-white border-indigo-500/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    autoFocus
                                />
                            ) : (
                                <span className="text-lg font-semibold text-white">${user.amount.toLocaleString('es-AR')}</span>
                            )}
                        </div>
                        <div className="flex gap-1">
                            {editingId === user.id ? (
                                <>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-full"
                                        onClick={() => handleSave(user.id)}
                                        disabled={isPending}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-full"
                                        onClick={handleCancel}
                                        disabled={isPending}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-colors"
                                    onClick={() => handleEdit(user)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Decorativo de fondo */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
