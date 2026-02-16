'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addCategory, updateCategory, deleteCategory } from "@/actions/categories"
import { Pencil, Check, X, Tag, Plus, Trash2 } from "lucide-react"

type Category = {
    id: string
    name: string
    icon: string
}

export function CategoryCard({ categories }: { categories: Category[] }) {
    const router = useRouter()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [editIcon, setEditIcon] = useState("")
    const [isPending, setIsPending] = useState(false)

    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState("")
    const [newIcon, setNewIcon] = useState("")

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id)
        setEditName(cat.name)
        setEditIcon(cat.icon)
    }

    const handleSave = async () => {
        if (!editingId || !editName) return
        setIsPending(true)
        const result = await updateCategory(editingId, editName, editIcon)
        if (result.success) {
            setEditingId(null)
            router.refresh()
        } else {
            alert(result.error)
        }
        setIsPending(false)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar esta categoría?')) return
        setIsPending(true)
        const result = await deleteCategory(id)
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
        const result = await addCategory(newName, newIcon || 'Tag')
        if (result.success) {
            setIsAdding(false)
            setNewName("")
            setNewIcon("")
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
                    <div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-sm">
                        <Tag className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Categorías</span>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                {categories.length === 0 && !isAdding && (
                    <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/10">
                        <p className="text-white/40 text-sm mb-3">No hay categorías.</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAdding(true)}
                            className="bg-white/5 border-white/10 text-emerald-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Agregar Categoría
                        </Button>
                    </div>
                )}

                {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5 transition-all hover:bg-black/30">
                        {editingId === cat.id ? (
                            <>
                                <div className="flex gap-2 flex-1 mr-2">
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="h-8 bg-black/40 border-emerald-500/50 text-white"
                                        placeholder="Nombre"
                                        autoFocus
                                    />
                                    <Input
                                        value={editIcon}
                                        onChange={(e) => setEditIcon(e.target.value)}
                                        className="h-8 w-24 bg-black/40 border-emerald-500/50 text-white"
                                        placeholder="Ícono"
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
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-lg">{cat.icon}</span>
                                    <span className="font-medium text-sm text-white/90">{cat.name}</span>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-white/5" onClick={() => handleEdit(cat)}>
                                        <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-white/5" onClick={() => handleDelete(cat.id)} disabled={isPending}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                ))}

                {isAdding && (
                    <div className="flex flex-col gap-3 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 animate-in fade-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider mb-1 block">Nombre</label>
                                <Input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Ej: Supermercado"
                                    className="h-8 bg-black/20 border-white/10 text-white placeholder:text-white/20 text-sm"
                                    autoFocus
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider mb-1 block">Ícono</label>
                                <Input
                                    value={newIcon}
                                    onChange={(e) => setNewIcon(e.target.value)}
                                    placeholder="Tag"
                                    className="h-8 bg-black/20 border-white/10 text-white placeholder:text-white/20 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} className="h-7 text-xs text-white/50 hover:text-white hover:bg-white/10">
                                Cancelar
                            </Button>
                            <Button size="sm" onClick={handleAdd} disabled={!newName || isPending} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white">
                                Guardar
                            </Button>
                        </div>
                    </div>
                )}

                {!isAdding && categories.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 border border-dashed border-white/10 text-white/30 hover:text-white hover:bg-white/5 hover:border-white/20"
                        onClick={() => setIsAdding(true)}
                    >
                        <Plus className="h-4 w-4 mr-2" /> Agregar categoría
                    </Button>
                )}
            </div>

            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        </GlassCard>
    )
}
