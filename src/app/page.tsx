import { getFixedExpenses, getVariableExpenses } from "@/actions/expenses"
import { getCategories } from "@/actions/categories"
import { getPaymentMethods } from "@/actions/payment-methods"
import { getUsers } from "@/actions/users"
import { FinancialSummary } from "@/components/dashboard/financial-summary"
import { ContributionCard } from "@/components/dashboard/contribution-card"
import { CategoryCard } from "@/components/dashboard/category-card"
import { PaymentMethodCard } from "@/components/dashboard/payment-method-card"
import { FixedExpensesList } from "@/components/expenses/fixed-expenses-list"
import { VariableExpensesList } from "@/components/expenses/variable-expenses-list"
import { AddVariableExpense } from "@/components/expenses/add-variable-expense"
import { MonthSelector } from "@/components/dashboard/month-selector"
import { CategorySummary } from "@/components/dashboard/category-summary"

export const dynamic = 'force-dynamic'

export default async function Home({ searchParams }: { searchParams: { month?: string, year?: string } }) {
  const month = searchParams.month ? parseInt(searchParams.month) : new Date().getMonth()
  const year = searchParams.year ? parseInt(searchParams.year) : new Date().getFullYear()

  const [users, fixedExpenses, variableExpenses, categories, paymentMethods] = await Promise.all([
    getUsers(),
    getFixedExpenses(),
    getVariableExpenses(month, year),
    getCategories(),
    getPaymentMethods()
  ])

  // Balance logic
  // 1. Base Income from Users (Monthly Fixed Amount)
  const usersMonthlyContribution = users.reduce((acc, user) => acc + user.amount, 0)

  // 2. Extra Income (type=INCOME) from variable expenses list
  const extraIncome = variableExpenses
    .filter(e => e.type === 'INCOME')
    .reduce((acc, exp) => acc + exp.amount, 0)

  const totalIncome = usersMonthlyContribution + extraIncome

  // 3. Fixed Expenses (Always deducted)
  const totalFixed = fixedExpenses.reduce((acc, exp) => acc + exp.amount, 0)

  // 4. Variable Expenses (type=VARIABLE)
  const totalVariable = variableExpenses
    .filter(e => e.type === 'VARIABLE')
    .reduce((acc, exp) => acc + exp.amount, 0)

  // 5. Rollover Out (type=ROLLOVER)
  const totalRolloverOut = variableExpenses
    .filter(e => e.type === 'ROLLOVER')
    .reduce((acc, exp) => acc + exp.amount, 0)

  const remainingBalance = totalIncome - totalFixed - totalVariable - totalRolloverOut

  return (
    <main className="min-h-screen pb-20">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <header className="flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <h1 className="text-xl font-bold text-white">Gastos</h1>
          </div>
          <MonthSelector />
        </header>

        <section>
          <FinancialSummary
            totalIncome={totalIncome}
            totalFixedExpenses={totalFixed}
            totalVariableExpenses={totalVariable} // visual only includes variable expenses
            remainingBalance={remainingBalance}
          />
        </section>

        <section>
          <CategorySummary
            fixedExpenses={fixedExpenses}
            variableExpenses={variableExpenses}
            categories={categories}
          />
        </section>

        <section>
          <ContributionCard users={users} />
        </section>

        <section>
          <CategoryCard categories={categories} />
        </section>

        <section>
          <PaymentMethodCard paymentMethods={paymentMethods} />
        </section>

        <section>
          <FixedExpensesList
            expenses={fixedExpenses}
            categories={categories}
            users={users}
          />
        </section>

        <section>
          <VariableExpensesList
            expenses={variableExpenses}
            categories={categories}
            users={users}
            paymentMethods={paymentMethods}
          />
        </section>

        <AddVariableExpense
          categories={categories}
          users={users}
          paymentMethods={paymentMethods}
        />
      </div>
    </main>
  )
}
