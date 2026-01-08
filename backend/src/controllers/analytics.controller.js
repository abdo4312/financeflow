import Transaction from '../models/Transaction.model.js';
import Category from '../models/Category.model.js';
import mongoose from 'mongoose';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// @desc    Get dashboard summary
// @route   GET /api/v1/analytics/summary
// @access  Private
export const getSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total balance, income, expenses (all time)
    const stats = await Transaction.aggregate([
      { $match: { userId, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      }
    ]);

    // Current month stats
    const monthStats = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          isDeleted: false,
          date: { $gte: startOfMonth, $lte: endOfMonth }
        } 
      },
      {
        $group: {
          _id: null,
          monthlyIncome: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          monthlyExpenses: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      }
    ]);

    const result = {
      totalBalance: (stats[0]?.totalIncome || 0) - (stats[0]?.totalExpenses || 0),
      totalIncome: stats[0]?.totalIncome || 0,
      totalExpenses: stats[0]?.totalExpenses || 0,
      monthlyIncome: monthStats[0]?.monthlyIncome || 0,
      monthlyExpenses: monthStats[0]?.monthlyExpenses || 0,
      monthlyBalance: (monthStats[0]?.monthlyIncome || 0) - (monthStats[0]?.monthlyExpenses || 0)
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expenses by category
// @route   GET /api/v1/analytics/category-stats
// @access  Private
export const getCategoryStats = async (req, res, next) => {
  try {
    const { startDate, endDate, type = 'expense' } = req.query;
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const match = { 
      userId, 
      isDeleted: false,
      type 
    };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$categoryId',
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          amount: 1,
          count: 1,
          name: '$category.name',
          color: '$category.color',
          icon: '$category.icon'
        }
      },
      { $sort: { amount: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to Excel
// @route   GET /api/v1/analytics/export/excel
// @access  Private
export const exportToExcel = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id, isDeleted: false })
      .populate('categoryId')
      .sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Description', key: 'description', width: 30 }
    ];

    transactions.forEach(t => {
      worksheet.addRow({
        date: t.date.toLocaleDateString(),
        type: t.type,
        category: t.categoryId.name,
        amount: t.amount,
        description: t.description || ''
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Export transactions to PDF
// @route   GET /api/v1/analytics/export/pdf
// @access  Private
export const exportToPdf = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id, isDeleted: false })
      .populate('categoryId')
      .sort({ date: -1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Transaction Report', { align: 'center' });
    doc.moveDown();

    transactions.forEach(t => {
      doc.fontSize(12).text(`${t.date.toLocaleDateString()} - ${t.type.toUpperCase()} - ${t.categoryId.name}: ${t.amount}`);
      if (t.description) {
        doc.fontSize(10).text(`Description: ${t.description}`, { indent: 20 });
      }
      doc.moveDown(0.5);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly trend
// @route   GET /api/v1/analytics/trend
// @access  Private
export const getTrend = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const stats = await Transaction.aggregate([
      { 
        $match: { 
          userId, 
          isDeleted: false,
          date: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          income: {
            $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
          },
          expense: {
            $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
