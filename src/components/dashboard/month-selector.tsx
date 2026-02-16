'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function MonthSelector() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const now = new Date()
    const currentMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : now.getMonth()
    const currentYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : now.getFullYear()

    const date = new Date(currentYear, currentMonth, 1)

    const handlePrev = () => {
        const prev = new Date(currentYear, currentMonth - 1, 1)
        router.push(`/?month=${prev.getMonth()}&year=${prev.getFullYear()}`)
    }

    const handleNext = () => {
        const next = new Date(currentYear, currentMonth + 1, 1)
        router.push(`/?month=${next.getMonth()}&year=${next.getFullYear()}`)
    }

    return (
        <div className="flex items-center gap-2 bg-gray-200 rounded-full p-1 animate-in fade-in">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold w-24 text-center capitalize">
                {date.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
