import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Category, Transaction } from '../types/finance'
import { buildTransactionExportRows } from './export'

export function exportTransactionsToPdf(
  transactions: Transaction[],
  categories: Category[],
) {
  const document = new jsPDF()

  document.setFontSize(18)
  document.text('Finance Dashboard Pro - Ledger Export', 14, 20)
  document.setFontSize(10)
  document.text(`Generated at ${new Date().toLocaleString('pt-BR')}`, 14, 27)

  autoTable(document, {
    head: [['Descricao', 'Tipo', 'Categoria', 'Data', 'Valor']],
    body: buildTransactionExportRows(transactions, categories),
    startY: 34,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [85, 99, 255],
    },
  })

  document.save('transactions-export.pdf')
}
