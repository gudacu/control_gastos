'use client'

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { getColorClasses } from "@/lib/colors"
import { PieChart, ChevronDown } from "lucide-react"

type Category = {
    id: string
    name: string
    icon: string
    color: string
}

type Expense = {
    id: string
    amount: number
    type: string
    categoryId: string
    category: Category
}

export function CategorySummary({
    fixedExpenses,
    variableExpenses,
    categories,
}: {
    fixedExpenses: Expense[]
    variableExpenses: Expense[]
    categories: Category[]
}) {
    // Only count actual expenses (FIXED + VARIABLE), not INCOME or ROLLOVER
    const allExpenses = [
        ...fixedExpenses,
        ...variableExpenses.filter(e => e.type === 'VARIABLE'),
    ]

    // Group by category
    const categoryTotals = categories
        .map(cat => {
            const total = allExpenses
                .filter(e => e.categoryId === cat.id)
                .reduce((acc, e) => acc + e.amount, 0)
            return { category: cat, total }
        })
        .filter(item => item.total > 0)
        .sort((a, b) => b.total - a.total)

    const grandTotal = categoryTotals.reduce((acc, item) => acc + item.total, 0)

    const [isExpanded, setIsExpanded] = useState(false)

    if (categoryTotals.length === 0) return null

    return (
        <GlassCard className="p-5 relative overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
            >
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-violet-500/20 rounded-lg backdrop-blur-sm">
                        <PieChart className="h-5 w-5 text-violet-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Gastos por Categoría</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white/90">
                        ${grandTotal.toLocaleString('es-AR')}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="space-y-3">
                        {categoryTotals.map(({ category, total }) => {
                            const c = getColorClasses(category.color)
                            const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0

                            return (
                                <div key={category.id} className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base">{category.icon}</span>
                                            <span className={`text-sm font-medium ${c.text}`}>{category.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white/90">
                                                ${total.toLocaleString('es-AR')}
                                            </span>
                                            <span className="text-xs text-white/40">
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${c.bg}`}
                                            style={{ width: `${percentage}%`, opacity: 0.8 }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
