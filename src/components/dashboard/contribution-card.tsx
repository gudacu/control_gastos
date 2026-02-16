'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateContribution } from "@/actions/users"
import { Pencil, Check, X } from "lucide-react"

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
        <Card className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium opacity-90">Fondo Común Mensual</CardTitle>
                <div className="text-4xl font-bold">
                    ${totalBudget.toLocaleString('es-AR')}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm">{user.name}</span>
                                {editingId === user.id ? (
                                    <Input
                                        type="number"
                                        value={tempAmount}
                                        onChange={(e) => setTempAmount(e.target.value)}
                                        className="h-7 w-24 bg-white/20 text-white border-transparent focus:bg-white/30"
                                        autoFocus
                                    />
                                ) : (
                                    <span className="text-sm opacity-80">${user.amount.toLocaleString('es-AR')}</span>
                                )}
                            </div>
                            <div className="flex gap-1">
                                {editingId === user.id ? (
                                    <>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 hover:bg-green-500/20 hover:text-green-300"
                                            onClick={() => handleSave(user.id)}
                                            disabled={isPending}
                                        >
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-8 w-8 hover:bg-red-500/20 hover:text-red-300"
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
                                        className="h-8 w-8 hover:bg-white/20"
                                        onClick={() => handleEdit(user)}
                                    >
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
