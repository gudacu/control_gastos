'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { rolloverBalance } from "@/actions/expenses"
import { ArrowLeftRight } from "lucide-react"
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
    const isPastMonth = new Date(year, month) < new Date(new Date().getFullYear(), new Date().getMonth())
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
        if (percent > 90) return "bg-red-500"
        if (percent > 75) return "bg-yellow-500"
        return "bg-green-500"
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card className="col-span-2 bg-white shadow-sm border-l-4 border-l-blue-500">
                <CardHeader className="pb-2 pt-4 flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">Saldo Restante (Real)</CardTitle>
                        <div className="text-3xl font-bold text-gray-800">
                            ${remainingBalance.toLocaleString('es-AR')}
                        </div>
                    </div>
                    {canRollover && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-200"
                            onClick={handleRollover}
                            title="Pasar saldo a mes siguiente"
                        >
                            <ArrowLeftRight className="h-4 w-4 mr-1" />
                            Rollover
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Gastado Var: ${spentVariable.toLocaleString('es-AR')}</span>
                        <span>Disp Teórico: ${disposableIncome.toLocaleString('es-AR')}</span>
                    </div>
                    <Progress value={spentPercentage} className="h-2" indicatorClassName={getProgressColor(spentPercentage)} />
                </CardContent>
            </Card>

            <Card className="bg-slate-50 border-none shadow-none">
                <CardContent className="p-4">
                    <div className="text-xs text-gray-500">Ingresos Totales</div>
                    <div className="text-lg font-semibold text-gray-700">${totalIncome.toLocaleString('es-AR')}</div>
                    <div className="text-xs text-gray-400">(Aportes + Extras)</div>
                </CardContent>
            </Card>

            <Card className="bg-slate-50 border-none shadow-none">
                <CardContent className="p-4">
                    <div className="text-xs text-gray-500">Gastos Fijos</div>
                    <div className="text-lg font-semibold text-red-600">-${totalFixedExpenses.toLocaleString('es-AR')}</div>
                </CardContent>
            </Card>
        </div>
    )
}
