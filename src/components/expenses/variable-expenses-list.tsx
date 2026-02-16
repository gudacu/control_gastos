'use client'

import { Card, CardContent } from "@/components/ui/card"
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
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 px-1">Movimientos del Mes</h3>
            {sortedDates.map((dateKey) => (
                <div key={dateKey} className="space-y-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase px-1">
                        {format(new Date(dateKey), "EEEE d 'de' MMMM", { locale: es })}
                    </div>
                    {groupedExpenses[dateKey].map((expense) => {
                        const isIncome = expense.type === 'INCOME'
                        const isRollover = expense.type === 'ROLLOVER'

                        return (
                            <Card key={expense.id} className={`shadow-sm border-l-4 hover:shadow-md transition-shadow ${isIncome ? 'border-l-green-500 bg-green-50/50' :
                                    isRollover ? 'border-l-orange-500 bg-orange-50/50' :
                                        'border-l-indigo-400'
                                }`}>
                                <CardContent className="p-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                                                {expense.description}
                                                {isIncome && <ArrowLeft className="h-3 w-3 text-green-600" />}
                                                {isRollover && <ArrowRight className="h-3 w-3 text-orange-600" />}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded">
                                                    <Tag className="h-3 w-3" /> {expense.category.name}
                                                </span>
                                                {expense.paymentMethod && (
                                                    <span className="flex items-center gap-1">
                                                        <CreditCard className="h-3 w-3" /> {expense.paymentMethod.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`font-bold ${isIncome ? 'text-green-600' : isRollover ? 'text-orange-600' : 'text-gray-800'}`}>
                                                {isIncome ? '+' : '-'}${expense.amount.toLocaleString('es-AR')}
                                            </div>
                                            {!isIncome && !isRollover && (
                                                <div className="text-xs text-indigo-600 font-medium flex items-center justify-end gap-1 mt-1">
                                                    <User className="h-3 w-3" /> {expense.paidBy.name.split(' ')[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ))}
            {expenses.length === 0 && (
                <div className="text-center text-gray-400 py-8 bg-white rounded-lg border border-dashed border-gray-300">
                    No hay movimientos registrados este mes.
                </div>
            )}
        </div>
    )
}
