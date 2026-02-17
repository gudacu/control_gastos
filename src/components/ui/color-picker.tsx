'use client'

import { COLOR_OPTIONS, colorMap } from "@/lib/colors"

export function ColorPicker({ value, onChange }: { value: string, onChange: (color: string) => void }) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {COLOR_OPTIONS.map((opt) => {
                const c = colorMap[opt.value]
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`h-6 w-6 rounded-full transition-all ${c.bg} ${value === opt.value ? 'ring-2 ring-white ring-offset-2 ring-offset-black/80 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                        title={opt.label}
                    />
                )
            })}
        </div>
    )
}
