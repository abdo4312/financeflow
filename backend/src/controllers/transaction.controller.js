import Transaction from '../models/Transaction.model.js';
import Category from '../models/Category.model.js';
import path from 'path';
import fs from 'fs';

// @desc    Create transaction
// @route   POST /api/v1/transactions
// @access  Private
export const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, categoryId, date, description } = req.body;

    // Verify category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      categoryId,
      date,
      description,
      userId: req.user.id
    });

    const populatedTransaction = await Transaction.findById(transaction._id).populate('categoryId');

    res.status(201).json({
      success: true,
      data: populatedTransaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      startDate, 
      endDate, 
      categoryId, 
      type, 
      minAmount, 
      maxAmount, 
      search,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const query = { userId: req.user.id, isDeleted: false };

    // Filtering
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (categoryId) query.categoryId = categoryId;
    if (type) query.type = type;

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Pagination & Sorting
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const transactions = await Transaction.find(query)
      .populate('categoryId')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      count: transactions.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/v1/transactions/:id
// @access  Private
export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    }).populate('categoryId');

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PATCH /api/v1/transactions/:id
// @access  Private
export const updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
      isDeleted: false
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    if (req.body.categoryId) {
      const category = await Category.findById(req.body.categoryId);
      if (!category) {
        return res.status(404).json({ success: false, error: 'Category not found' });
      }
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('categoryId');

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction (soft delete)
// @route   DELETE /api/v1/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    transaction.isDeleted = true;
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent transactions
// @route   GET /api/v1/transactions/recent
// @access  Private
export const getRecentTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,
      isDeleted: false
    })
    .populate('categoryId')
    .sort({ date: -1 })
    .limit(10);

    res.status(200).json({
      success: true,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete transactions
// @route   POST /api/v1/transactions/bulk-delete
// @access  Private
export const bulkDeleteTransactions = async (req, res, next) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: 'IDs array is required' });
    }

    const result = await Transaction.updateMany(
      { _id: { $in: ids }, userId: req.user.id },
      { isDeleted: true }
    );

    res.status(200).json({
      success: true,
      count: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload receipt
// @route   POST /api/v1/transactions/:id/receipt
// @access  Private
export const uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    // Delete old receipt if exists
    if (transaction.receipt) {
      const oldPath = path.join(process.cwd(), transaction.receipt);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    transaction.receipt = `uploads/receipts/${req.file.filename}`;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};
