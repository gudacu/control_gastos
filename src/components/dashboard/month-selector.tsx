'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function MonthSelector() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const now = new Date()
    const currentMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : now.getMonth()
    const currentYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : now.getFullYear()

    const date = new Date(currentYear, currentMonth, 1)

    // Calculate prev and next dates for pre-fetching or just logic
    const prevDate = new Date(currentYear, currentMonth - 1, 1)
    const nextDate = new Date(currentYear, currentMonth + 1, 1)

    const handlePrev = () => {
        router.push(`/?month=${prevDate.getMonth()}&year=${prevDate.getFullYear()}`)
    }

    const handleNext = () => {
        router.push(`/?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`)
    }

    return (
        <div className="flex flex-col items-center justify-center py-4 relative z-20">
            <div className="flex items-center gap-6">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                    onClick={handlePrev}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <div className="flex flex-col items-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={`${currentMonth}-${currentYear}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-2xl font-bold text-white capitalize tracking-tight"
                        >
                            {date.toLocaleDateString('es-AR', { month: 'long' })}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-xs font-medium text-white/40 tracking-widest uppercase mt-1">
                        {currentYear}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                    onClick={handleNext}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
