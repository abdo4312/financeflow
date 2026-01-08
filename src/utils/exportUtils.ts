import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction, Category } from '../types';
import { formatCurrency, formatDate } from './format';

export const exportToExcel = (transactions: Transaction[], categories: Category[]) => {
  const data = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return {
      Date: formatDate(t.date),
      Description: t.description,
      Category: category?.name || 'Unknown',
      Type: t.type.toUpperCase(),
      Amount: t.amount
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
  // Set column widths
  const wscols = [
    { wch: 15 }, // Date
    { wch: 30 }, // Description
    { wch: 20 }, // Category
    { wch: 10 }, // Type
    { wch: 15 }  // Amount
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `transactions_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportToPDF = (transactions: Transaction[], categories: Category[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Transactions Report', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Generated on: ${reportDate}`, 14, 30);

  const tableData = transactions.map(t => {
    const category = categories.find(c => c.id === t.categoryId);
    return [
      formatDate(t.date),
      t.description,
      category?.name || 'Unknown',
      t.type.toUpperCase(),
      formatCurrency(t.amount)
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 }, // Blue-600
    alternateRowStyles: { fillColor: [248, 250, 252] }, // Slate-50
    margin: { top: 40 },
  });

  doc.save(`transactions_${new Date().toISOString().split('T')[0]}.pdf`);
};
