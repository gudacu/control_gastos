'use client'

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { getColorClasses } from "@/lib/colors"
import { ChevronDown, TrendingDown, TrendingUp, Wallet } from "lucide-react"

type User = {
    id: string
    name: string
    amount: number
    color: string
}

type Expense = {
    id: string
    amount: number
    type: string
    paidById: string
}

export function UserBalanceCard({
    users,
    variableExpenses,
}: {
    users: User[]
    variableExpenses: Expense[]
}) {
    const [isExpanded, setIsExpanded] = useState(true)

    if (users.length === 0) return null

    const userStats = users.map(user => {
        const c = getColorClasses(user.color)
        const spent = variableExpenses
            .filter(e => e.paidById === user.id && e.type === 'VARIABLE')
            .reduce((acc, e) => acc + e.amount, 0)
        const remaining = user.amount - spent
        const percentage = user.amount > 0 ? (spent / user.amount) * 100 : 0

        return { user, c, spent, remaining, percentage }
    })

    return (
        <GlassCard className="p-5 relative overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
            >
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-cyan-500/20 rounded-lg backdrop-blur-sm">
                        <Wallet className="h-5 w-5 text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Balance por Persona</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden space-y-4">
                    {userStats.map(({ user, c, spent, remaining, percentage }) => (
                        <div key={user.id} className={`bg-black/20 rounded-xl border-l-4 ${c.border} p-4 space-y-3`}>
                            <div className="flex items-center justify-between">
                                <span className={`font-semibold ${c.text}`}>{user.name}</span>
                                <span className={`text-lg font-bold ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {remaining >= 0 ? '' : '-'}${Math.abs(remaining).toLocaleString('es-AR')}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-2.5 bg-black/30 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${percentage > 100 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : percentage > 80 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : `${c.bg} shadow-[0_0_8px_rgba(0,0,0,0.3)]`}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white/5 rounded-lg py-2 px-1">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <TrendingUp className="h-3 w-3 text-green-400" />
                                        <span className="text-[10px] text-white/40 uppercase font-medium">Aporte</span>
                                    </div>
                                    <span className="text-sm font-semibold text-white/90">
                                        ${user.amount.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <div className="bg-white/5 rounded-lg py-2 px-1">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <TrendingDown className="h-3 w-3 text-red-400" />
                                        <span className="text-[10px] text-white/40 uppercase font-medium">Gastado</span>
                                    </div>
                                    <span className="text-sm font-semibold text-white/90">
                                        ${spent.toLocaleString('es-AR')}
                                    </span>
                                </div>
                                <div className="bg-white/5 rounded-lg py-2 px-1">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Wallet className="h-3 w-3 text-cyan-400" />
                                        <span className="text-[10px] text-white/40 uppercase font-medium">
                                            {remaining >= 0 ? 'Resta' : 'Extra'}
                                        </span>
                                    </div>
                                    <span className={`text-sm font-semibold ${remaining >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                        ${Math.abs(remaining).toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-xs text-white/30">
                                    {percentage.toFixed(0)}% usado
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
