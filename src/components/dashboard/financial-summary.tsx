'use client'

import { GlassCard } from "@/components/ui/glass-card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { rolloverBalance } from "@/actions/expenses"
import { ArrowLeftRight, TrendingDown, TrendingUp, Wallet } from "lucide-react"
import { useSearchParams } from "next/navigation"

export function FinancialSummary({
    totalIncome,
    totalFixedExpenses,
    totalVariableExpenses,
    remainingBalance
}: {
    totalIncome: number,
    totalFixedExpenses: number,
    totalVariableExpenses: number,
    remainingBalance: number
}) {
    // Note: totalIncome here includes User Contributions + Extra Income (Rollover In)
    // remainingBalance passed from server is (Total Income - Fixed - Variable - Rollover Out)

    const searchParams = useSearchParams()
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth()
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear()

    // Disable rollover if not current month or if balance is negative
    const canRollover = remainingBalance > 0 // Allow for past months too if we forgot? Yes.

    const handleRollover = async () => {
        if (!confirm(`¿Transferir saldo de $${remainingBalance.toLocaleString('es-AR')} al mes siguiente?`)) return
        await rolloverBalance(remainingBalance, month, year)
    }

    // Calculate disposable (Theory)
    const disposableIncome = totalIncome - totalFixedExpenses
    const spentVariable = totalVariableExpenses
    const spentPercentage = disposableIncome > 0 ? (spentVariable / disposableIncome) * 100 : 0

    const getProgressColor = (percent: number) => {
        if (percent > 90) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
        if (percent > 75) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
        return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
    }

    return (
        <div className="space-y-4">
            {/* Main Balance Card - Valid Credit Card Style */}
            <GlassCard gradient className="p-6 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-white/60 text-sm font-medium tracking-wider uppercase mb-1">Saldo Disponible</div>
                            <div className="text-4xl font-bold text-white tracking-tight">
                                ${remainingBalance.toLocaleString('es-AR')}
                            </div>
                        </div>
                        <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-white/70 font-medium">
                            <span>Gastado: ${spentVariable.toLocaleString('es-AR')}</span>
                            <span>Límite: ${disposableIncome.toLocaleString('es-AR')}</span>
                        </div>
                        <Progress
                            value={spentPercentage}
                            className="h-3 bg-black/20 backdrop-blur-sm border border-white/5"
                            indicatorClassName={`transition-all duration-500 ${getProgressColor(spentPercentage)}`}
                        />
                    </div>

                    {canRollover && (
                        <div className="pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md"
                                onClick={handleRollover}
                            >
                                <ArrowLeftRight className="h-4 w-4 mr-2" />
                                Transferir Restante (Rollover)
                            </Button>
                        </div>
                    )}
                </div>
            </GlassCard>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <GlassCard className="p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-green-500/10 rounded-lg">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                        <span className="text-xs text-white/50 font-medium">Ingresos</span>
                    </div>
                    <div className="text-lg font-semibold text-white/90">
                        ${totalIncome.toLocaleString('es-AR')}
                    </div>
                </GlassCard>

                <GlassCard className="p-4 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-red-500/10 rounded-lg">
                            <TrendingDown className="h-4 w-4 text-red-400" />
                        </div>
                        <span className="text-xs text-white/50 font-medium">Fijos</span>
                    </div>
                    <div className="text-lg font-semibold text-white/90">
                        -${totalFixedExpenses.toLocaleString('es-AR')}
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}
