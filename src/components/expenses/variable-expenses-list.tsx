'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Tag, CreditCard, User, ArrowRight, ArrowLeft } from "lucide-react"

type VariableExpense = {
    id: string
    description: string
    amount: number
    date: Date | string
    type: string
    category: { name: string, icon: string }
    paidBy: { name: string }
    paymentMethod?: { name: string } | null
}

export function VariableExpensesList({ expenses }: { expenses: VariableExpense[] }) {
    // Group expenses by date (Today, Yesterday, Date)
    const groupedExpenses = expenses.reduce((groups, expense) => {
        const dateKey = new Date(expense.date).toDateString()
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].push(expense)
        return groups
    }, {} as Record<string, VariableExpense[]>)

    const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-white/80 px-1 tracking-wide">Movimientos del Mes</h3>
            {sortedDates.map((dateKey) => (
                <div key={dateKey} className="space-y-3">
                    <div className="text-xs font-bold text-indigo-400 uppercase px-1 tracking-widest bg-indigo-500/10 inline-block py-1 rounded-md mb-1">
                        {format(new Date(dateKey), "EEEE d 'de' MMMM", { locale: es })}
                    </div>
                    {groupedExpenses[dateKey].map((expense) => {
                        const isIncome = expense.type === 'INCOME'
                        const isRollover = expense.type === 'ROLLOVER'

                        return (
                            <GlassCard key={expense.id} className="p-4 border-l-4 border-l-transparent hover:border-l-indigo-500/50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-white/90 flex items-center gap-2">
                                            {expense.description}
                                            {isIncome && <ArrowLeft className="h-3 w-3 text-green-400" />}
                                            {isRollover && <ArrowRight className="h-3 w-3 text-orange-400" />}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-white/50">
                                            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                                <Tag className="h-3 w-3" /> {expense.category.name}
                                            </span>
                                            {expense.paymentMethod && (
                                                <span className="flex items-center gap-1 text-white/40">
                                                    <CreditCard className="h-3 w-3" /> {expense.paymentMethod.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-lg font-bold tracking-tight ${isIncome ? 'text-green-400' : isRollover ? 'text-orange-400' : 'text-white'}`}>
                                            {isIncome ? '+' : '-'}${expense.amount.toLocaleString('es-AR')}
                                        </div>
                                        {!isIncome && !isRollover && (
                                            <div className="text-xs text-indigo-300/70 font-medium flex items-center justify-end gap-1 mt-1">
                                                <User className="h-3 w-3" /> {expense.paidBy.name.split(' ')[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>
            ))}
            {expenses.length === 0 && (
                <div className="text-center text-white/30 py-12 bg-white/5 rounded-2xl border border-dashed border-white/10 backdrop-blur-sm">
                    No hay movimientos registrados este mes.
                </div>
            )}
        </div>
    )
}
