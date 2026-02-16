'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addPaymentMethod, updatePaymentMethod, deletePaymentMethod } from "@/actions/payment-methods"
import { Pencil, Check, X, CreditCard, Plus, Trash2 } from "lucide-react"

type PaymentMethod = {
    id: string
    name: string
}

export function PaymentMethodCard({ paymentMethods }: { paymentMethods: PaymentMethod[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [isPending, setIsPending] = useState(false)

    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState("")

    const handleEdit = (pm: PaymentMethod) => {
        setEditingId(pm.id)
        setEditName(pm.name)
    }

    const handleSave = async () => {
        if (!editingId || !editName) return
        setIsPending(true)
        const result = await updatePaymentMethod(editingId, editName)
        if (result.success) {
            setEditingId(null)
            router.refresh()
        } else {
            alert(result.error)
        }
        setIsPending(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este método de pago?')) return
        setIsPending(true)
        const result = await deletePaymentMethod(id)
        if (result.success) {
            router.refresh()
        } else {
            alert(result.error)
        }
        setIsPending(false)
    }

    const handleAdd = async () => {
        if (!newName) return
        setIsPending(true)
        const result = await addPaymentMethod(newName)
        if (result.success) {
            setIsAdding(false)
            setNewName("")
            router.refresh()
        } else {
            alert(result.error)
        }
        setIsPending(false)
    }

    return (
        <GlassCard className="p-5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-violet-500/20 rounded-lg backdrop-blur-sm">
                        <CreditCard className="h-5 w-5 text-violet-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Métodos de Pago</span>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {paymentMethods.length === 0 && !isAdding && (
                    <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-white/40 text-sm mb-3">No hay métodos de pago.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAdding(true)}
                            className="bg-white/5 border-white/10 text-violet-300 hover:text-white hover:bg-violet-600 hover:border-violet-500 transition-all"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Agregar Método
                        </Button>
                    </div>
                )}

                {paymentMethods.map((pm) => (
                    <div key={pm.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 transition-all hover:bg-black/30">
                        {editingId === pm.id ? (
                            <>
                                <div className="flex-1 mr-2">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="h-8 bg-black/40 border-violet-500/50 text-white"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:bg-green-500/20" onClick={handleSave} disabled={isPending}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-500/20" onClick={() => setEditingId(null)} disabled={isPending}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="font-medium text-sm text-white/90">{pm.name}</span>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-violet-400 hover:text-violet-300 hover:bg-white/5" onClick={() => handleEdit(pm)}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/5" onClick={() => handleDelete(pm.id)} disabled={isPending}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {isAdding && (
                    <div className="flex flex-col gap-3 bg-violet-500/10 p-3 rounded-xl border border-violet-500/20 animate-in fade-in slide-in-from-top-2">
                        <div>
                            <label className="text-[10px] text-violet-300 uppercase font-bold tracking-wider mb-1 block">Nombre</label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ej: Efectivo, Débito..."
                                className="h-8 bg-black/20 border-white/10 text-white placeholder:text-white/20 text-sm"
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7 text-xs text-white/50 hover:text-white hover:bg-white/10">
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={handleAdd} disabled={!newName || isPending} className="h-7 text-xs bg-violet-600 hover:bg-violet-500 text-white">
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                {!isAdding && paymentMethods.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 border border-dashed border-white/10 text-white/30 hover:text-white hover:bg-white/5 hover:border-white/20"
                        onClick={() => setIsAdding(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Agregar método de pago
                    </Button>
                )}
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
