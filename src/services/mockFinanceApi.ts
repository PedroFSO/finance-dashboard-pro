import database from '../../db.json'
import type {
  Category,
  CategoryPayload,
  Transaction,
  TransactionPayload,
} from '../types/finance'

const STORAGE_KEY = 'finance-dashboard-pro:mock-api:v2'

interface FinanceDatabase {
  categories: Category[]
  transactions: Transaction[]
}

const initialDatabase: FinanceDatabase = {
  categories: database.categories as Category[],
  transactions: database.transactions as Transaction[],
}

function cloneDatabase(data: FinanceDatabase): FinanceDatabase {
  return structuredClone(data)
}

function readDatabase(): FinanceDatabase {
  if (typeof localStorage === 'undefined') {
    return cloneDatabase(initialDatabase)
  }

  const storedDatabase = localStorage.getItem(STORAGE_KEY)

  if (!storedDatabase) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase))
    return cloneDatabase(initialDatabase)
  }

  try {
    return JSON.parse(storedDatabase) as FinanceDatabase
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDatabase))
    return cloneDatabase(initialDatabase)
  }
}

function writeDatabase(data: FinanceDatabase) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }
}

export function getMockTransactions() {
  return readDatabase().transactions
}

export function createMockTransaction(payload: TransactionPayload) {
  const data = readDatabase()
  const transaction = {
    ...payload,
    id: crypto.randomUUID(),
  }

  data.transactions.push(transaction)
  writeDatabase(data)

  return transaction
}

export function updateMockTransaction(
  id: string,
  payload: TransactionPayload,
) {
  const data = readDatabase()
  const transactionIndex = data.transactions.findIndex(
    (transaction) => transaction.id === id,
  )

  if (transactionIndex === -1) {
    throw new Error('Transacao nao encontrada.')
  }

  const transaction = {
    ...payload,
    id,
  }

  data.transactions[transactionIndex] = transaction
  writeDatabase(data)

  return transaction
}

export function deleteMockTransaction(id: string) {
  const data = readDatabase()
  data.transactions = data.transactions.filter(
    (transaction) => transaction.id !== id,
  )
  writeDatabase(data)
}

export function getMockCategories() {
  return readDatabase().categories
}

export function createMockCategory(payload: CategoryPayload) {
  const data = readDatabase()
  const category = {
    ...payload,
    id: crypto.randomUUID(),
  }

  data.categories.push(category)
  writeDatabase(data)

  return category
}

export function updateMockCategory(id: string, payload: CategoryPayload) {
  const data = readDatabase()
  const categoryIndex = data.categories.findIndex(
    (category) => category.id === id,
  )

  if (categoryIndex === -1) {
    throw new Error('Categoria nao encontrada.')
  }

  const category = {
    ...payload,
    id,
  }

  data.categories[categoryIndex] = category
  writeDatabase(data)

  return category
}
