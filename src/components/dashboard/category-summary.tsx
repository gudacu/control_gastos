'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { getColorClasses } from "@/lib/colors"
import { PieChart } from "lucide-react"

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

    if (categoryTotals.length === 0) return null

    return (
        <GlassCard className="p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-violet-500/20 rounded-lg backdrop-blur-sm">
                    <PieChart className="h-5 w-5 text-violet-400" />
                </div>
                <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Gastos por Categoría</span>
            </div>

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

            <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-white/50 uppercase tracking-wider font-medium">Total</span>
                <span className="text-base font-bold text-white/90">
                    ${grandTotal.toLocaleString('es-AR')}
                </span>
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
