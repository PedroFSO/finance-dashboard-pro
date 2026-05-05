import { lazy, Suspense, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { DashboardSkeleton } from './components/DashboardSkeleton'
import { useCategories } from './hooks/useCategories'
import { hasConfiguredApiBaseUrl } from './services/api'
import { resetMockFinanceData } from './services/mockFinanceApi'
import {
  useCreateTransaction,
  useUpdateTransaction,
} from './hooks/useTransactions'
import type { Transaction, TransactionPayload } from './types/finance'
import { notifySuccess } from './utils/notify'

const TransactionFormModal = lazy(() =>
  import('./components/TransactionFormModal').then((module) => ({
    default: module.TransactionFormModal,
  })),
)

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
)

const TransactionsPage = lazy(() =>
  import('./pages/TransactionsPage').then((module) => ({
    default: module.TransactionsPage,
  })),
)

const CategoriesPage = lazy(() =>
  import('./pages/CategoriesPage').then((module) => ({
    default: module.CategoriesPage,
  })),
)

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(
    null,
  )
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const categoriesQuery = useCategories({ enabled: isModalOpen })
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()

  const categories = categoriesQuery.data ?? []
  const isSaving = createMutation.isPending || updateMutation.isPending

  function openCreateTransactionModal() {
    setSelectedTransaction(null)
    setIsModalOpen(true)
  }

  function openEditTransactionModal(transaction: Transaction) {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  async function handleSaveTransaction(payload: TransactionPayload) {
    if (selectedTransaction) {
      await updateMutation.mutateAsync({
        id: selectedTransaction.id,
        payload,
      })
    } else {
      await createMutation.mutateAsync(payload)
    }

    setIsModalOpen(false)
    setSelectedTransaction(null)
  }

  function handleSearchChange(value: string) {
    setSearchTerm(value)

    if (value.trim() && location.pathname !== '/') {
      navigate('/')
    }
  }

  async function handleResetDemoData() {
    resetMockFinanceData()
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
    ])
    void notifySuccess('Dados demo restaurados.')
  }

  return (
    <>
      <AppShell
        isDemoMode={!hasConfiguredApiBaseUrl}
        onPrimaryAction={openCreateTransactionModal}
        onResetDemoData={handleResetDemoData}
        onSearchChange={handleSearchChange}
        searchValue={searchTerm}
      >
        <Suspense fallback={<DashboardSkeleton />}>
          <Routes>
            <Route
              element={
                <DashboardPage
                  onEditTransaction={openEditTransactionModal}
                  searchTerm={searchTerm}
                />
              }
              path="/"
            />
            <Route
              element={
                <TransactionsPage
                  onEditTransaction={openEditTransactionModal}
                  searchTerm={searchTerm}
                />
              }
              path="/transactions"
            />
            <Route element={<CategoriesPage />} path="/categories" />
          </Routes>
        </Suspense>
      </AppShell>

      <Suspense fallback={null}>
        <TransactionFormModal
          key={`${selectedTransaction?.id ?? 'create'}-${isModalOpen ? 'open' : 'closed'}`}
          categories={categories}
          isOpen={isModalOpen}
          isSaving={isSaving}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedTransaction(null)
          }}
          onSubmit={handleSaveTransaction}
          transaction={selectedTransaction}
        />
      </Suspense>
    </>
  )
}

export default App
