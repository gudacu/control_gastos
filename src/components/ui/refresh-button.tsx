'use client'

import { useState } from "react"
import { RefreshCw } from "lucide-react"

export function RefreshButton() {
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        window.location.reload()
    }

    return (
        <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
            aria-label="Actualizar"
        >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
    )
}
