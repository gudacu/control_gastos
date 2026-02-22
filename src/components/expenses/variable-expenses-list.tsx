'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Tag, CreditCard, User, ArrowRight, ArrowLeft, Pencil, Trash2, Check, X, ChevronDown } from "lucide-react"
import { updateVariableExpense } from "@/actions/variable-expenses"
import { deleteExpense } from "@/actions/expenses"
import { getColorClasses } from "@/lib/colors"

type VariableExpense = {
    id: string
    description: string
    amount: number
    date: Date | string
    type: string
    category: { id?: string, name: string, icon: string, color?: string }
    paidBy: { id?: string, name: string, color?: string }
    paymentMethod?: { id?: string, name: string, color?: string } | null
}

type Category = { id: string, name: string, icon: string, color?: string }
type UserType = { id: string, name: string, amount: number, color?: string }
type PaymentMethod = { id: string, name: string, color?: string }

export function VariableExpensesList({
    expenses,
    categories,
    users,
    paymentMethods
}: {
    expenses: VariableExpense[],
    categories: Category[],
    users: UserType[],
    paymentMethods: PaymentMethod[]
}) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editDescription, setEditDescription] = useState("")
    const [editAmount, setEditAmount] = useState("")
    const [editDate, setEditDate] = useState("")
    const [editCategoryId, setEditCategoryId] = useState("")
    const [editPaidById, setEditPaidById] = useState("")
    const [editPaymentMethodId, setEditPaymentMethodId] = useState("")
    const [isPending, setIsPending] = useState(false)
    const [isExpanded, setIsExpanded] = useState(true)

    const handleEdit = (expense: VariableExpense) => {
        setEditingId(expense.id)
        setEditDescription(expense.description)
        setEditAmount(expense.amount.toString())
        const d = new Date(expense.date)
        setEditDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)
        setEditCategoryId(expense.category.id || categories[0]?.id || "")
        setEditPaidById(expense.paidBy.id || users[0]?.id || "")
        setEditPaymentMethodId(expense.paymentMethod?.id || paymentMethods[0]?.id || "")
    }

    const handleSave = async () => {
        if (!editingId || !editDescription || !editAmount) return
        setIsPending(true)
        const [y, m, d] = editDate.split('-').map(Number)
        const result = await updateVariableExpense(editingId, {
            description: editDescription,
            amount: parseFloat(editAmount),
            date: new Date(y, m - 1, d, 12, 0, 0),
            categoryId: editCategoryId,
            paidById: editPaidById,
            paymentMethodId: editPaymentMethodId
        })
        if (result.success) {
            setEditingId(null)
            router.refresh()
        } else {
            alert(result.error)
        }
        setIsPending(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este movimiento?')) return
        setIsPending(true)
        const result = await deleteExpense(id)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.error)
        }
        setIsPending(false)
    }

    // Group expenses by date
    const groupedExpenses = expenses.reduce((groups, expense) => {
        const dateKey = new Date(expense.date).toDateString()
        if (!groups[dateKey]) {
            groups[dateKey] = []
        }
        groups[dateKey].push(expense)
        return groups
    }, {} as Record<string, VariableExpense[]>)

    const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const totalVariable = expenses
        .filter(e => e.type === 'VARIABLE')
        .reduce((acc, e) => acc + e.amount, 0)

    return (
        <div className="space-y-6">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left px-1"
            >
                <h3 className="text-lg font-medium text-white/80 tracking-wide">Movimientos del Mes</h3>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white/70">{expenses.length} items</span>
                    <ChevronDown className={`h-5 w-5 text-white/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden space-y-6">
            {sortedDates.map((dateKey) => (
                <div key={dateKey} className="space-y-3">
                    <div className="text-xs font-bold text-indigo-400 uppercase px-1 tracking-widest bg-indigo-500/10 inline-block py-1 rounded-md mb-1">
                        {format(new Date(dateKey), "EEEE d 'de' MMMM", { locale: es })}
                    </div>
                    {groupedExpenses[dateKey].map((expense) => {
                        const isIncome = expense.type === 'INCOME'
                        const isRollover = expense.type === 'ROLLOVER'
                        const isEditing = editingId === expense.id

                        if (isEditing) {
                            return (
                                <GlassCard key={expense.id} className="p-4 border-l-4 border-l-indigo-500">
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder="Descripción"
                                                className="h-9 bg-black/20 border-white/10 text-white text-sm"
                                                autoFocus
                                            />
                                            <div className="relative">
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/50 text-sm">$</span>
                                                <Input
                                                    type="number"
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    className="h-9 pl-6 bg-black/20 border-white/10 text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                type="date"
                                                value={editDate}
                                                onChange={(e) => setEditDate(e.target.value)}
                                                className="h-9 bg-black/20 border-white/10 text-white text-sm"
                                            />
                                            <select
                                                value={editCategoryId}
                                                onChange={(e) => setEditCategoryId(e.target.value)}
                                                className="h-9 w-full rounded-md border border-white/10 bg-black/20 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                            >
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <select
                                                value={editPaidById}
                                                onChange={(e) => setEditPaidById(e.target.value)}
                                                className="h-9 w-full rounded-md border border-white/10 bg-black/20 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                            >
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id} className="bg-slate-900">{u.name}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={editPaymentMethodId}
                                                onChange={(e) => setEditPaymentMethodId(e.target.value)}
                                                className="h-9 w-full rounded-md border border-white/10 bg-black/20 px-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                            >
                                                {paymentMethods.map(pm => (
                                                    <option key={pm.id} value={pm.id} className="bg-slate-900">{pm.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending} className="h-8 text-white/50 hover:text-white hover:bg-white/10">
                                                <X className="h-4 w-4 mr-1" /> Cancelar
                                            </Button>
                                            <Button size="sm" onClick={handleSave} disabled={isPending} className="h-8 bg-indigo-600 hover:bg-indigo-500 text-white">
                                                <Check className="h-4 w-4 mr-1" /> Guardar
                                            </Button>
                                        </div>
                                    </div>
                                </GlassCard>
                            )
                        }

                        const catColor = getColorClasses(expense.category.color || 'emerald')
                        const userColor = getColorClasses(expense.paidBy.color || 'indigo')
                        const pmColor = expense.paymentMethod?.color ? getColorClasses(expense.paymentMethod.color) : null

                        return (
                            <GlassCard key={expense.id} className="p-4 border-l-4 border-l-transparent hover:border-l-indigo-500/50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="font-semibold text-white/90 flex items-center gap-2">
                                            {expense.description}
                                            {isIncome && <ArrowLeft className="h-3 w-3 text-green-400" />}
                                            {isRollover && <ArrowRight className="h-3 w-3 text-orange-400" />}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs flex-wrap">
                                            <span className={`flex items-center gap-1 ${catColor.bgLight} ${catColor.text} px-2 py-0.5 rounded-full`}>
                                                <Tag className="h-3 w-3" /> {expense.category.name}
                                            </span>
                                            {expense.paymentMethod && (
                                                <span className={`flex items-center gap-1 ${pmColor ? `${pmColor.bgLight} ${pmColor.text}` : 'text-white/40'} px-2 py-0.5 rounded-full`}>
                                                    <CreditCard className="h-3 w-3" /> {expense.paymentMethod.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="text-right">
                                            <div className={`text-lg font-bold tracking-tight ${isIncome ? 'text-green-400' : isRollover ? 'text-orange-400' : 'text-white'}`}>
                                                {isIncome ? '+' : '-'}${expense.amount.toLocaleString('es-AR')}
                                            </div>
                                            {!isIncome && !isRollover && (
                                                <div className={`text-xs ${userColor.text} font-medium flex items-center justify-end gap-1 mt-1`}>
                                                    <User className="h-3 w-3" /> {expense.paidBy.name.split(' ')[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 ml-1">
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-indigo-400 hover:text-indigo-300 hover:bg-white/5" onClick={() => handleEdit(expense)}>
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-white/5" onClick={() => handleDelete(expense.id)} disabled={isPending}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
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
            </div>
        </div>
    )
}
