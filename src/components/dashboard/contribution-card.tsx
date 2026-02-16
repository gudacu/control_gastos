'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addUser, updateContribution } from "@/actions/users"
import { Pencil, Check, X, Users, Plus, UserPlus } from "lucide-react"

type User = {
    id: string
    name: string
    amount: number
}

export function ContributionCard({ users }: { users: User[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [tempAmount, setTempAmount] = useState<string>("")
    const [isPending, setIsPending] = useState(false)

    // New User State
    const [isAddingUser, setIsAddingUser] = useState(false)
    const [newUserName, setNewUserName] = useState("")
    const [newUserAmount, setNewUserAmount] = useState("")

    const totalBudget = users.reduce((acc, user) => acc + user.amount, 0)

    const handleEdit = (user: User) => {
        setEditingId(user.id)
        setTempAmount(user.amount.toString())
    }

    const handleSave = async (userId: string) => {
        setIsPending(true)
        const amount = parseFloat(tempAmount)
        if (isNaN(amount)) return

        const result = await updateContribution(userId, amount)
        if (result.success) {
            setEditingId(null)
            router.refresh()
        } else {
            alert("Error al actualizar. Intente nuevamente.")
        }
        setIsPending(false)
    }

    const handleCancel = () => {
        setEditingId(null)
        setTempAmount("")
    }

    const handleAddUser = async () => {
        if (!newUserName) return
        setIsPending(true)
        const amount = parseFloat(newUserAmount) || 0

        const result = await addUser(newUserName, amount)

        if (result.success) {
            setIsAddingUser(false)
            setNewUserName("")
            setNewUserAmount("")
            router.refresh()
        } else {
            alert(result.error || "Error al agregar usuario. Intente nuevamente.")
        }
        setIsPending(false)
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
                {users.length === 0 && !isAddingUser && (
                    <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-white/40 text-sm mb-3">No hay participantes aún.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingUser(true)}
                            className="bg-white/5 border-white/10 text-indigo-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Agregar Participante
                        </Button>
                    </div>
                )}

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
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-2 hover:bg-white/10 text-indigo-300 hover:text-white rounded-lg transition-colors flex items-center gap-1"
                                    onClick={() => handleEdit(user)}
                                >
                                    <span className="text-xs font-medium">Editar</span>
                                    <Pencil className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add User Form */}
                {isAddingUser && (
                    <div className="flex flex-col gap-3 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider mb-1 block">Nombre</label>
                                <Input
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="Nombre"
                                    className="h-8 bg-black/20 border-white/10 text-white placeholder:text-white/20 text-sm"
                                    autoFocus
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider mb-1 block">Aporte Inicial</label>
                                <Input
                                    type="number"
                                    value={newUserAmount}
                                    onChange={(e) => setNewUserAmount(e.target.value)}
                                    placeholder="$"
                                    className="h-8 bg-black/20 border-white/10 text-white placeholder:text-white/20 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsAddingUser(false)}
                                className="h-7 text-xs text-white/50 hover:text-white hover:bg-white/10"
                            >
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleAddUser}
                                disabled={!newUserName || isPending}
                                className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                {!isAddingUser && users.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 border border-dashed border-white/10 text-white/30 hover:text-white hover:bg-white/5 hover:border-white/20"
                        onClick={() => setIsAddingUser(true)}
                    >
                        <UserPlus className="h-4 w-4 mr-2" /> Agregar otro participante
                    </Button>
                )}
            </div>

            {/* Decorativo de fondo */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
