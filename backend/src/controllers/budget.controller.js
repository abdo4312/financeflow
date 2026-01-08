import Budget from '../models/Budget.model.js';
import Transaction from '../models/Transaction.model.js';
import mongoose from 'mongoose';

// @desc    Create budget
// @route   POST /api/v1/budgets
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { categoryId, amount, period, startDate, endDate } = req.body;

    // Check if budget already exists for this category and user
    const budgetExists = await Budget.findOne({ userId: req.user.id, categoryId });
    if (budgetExists) {
      return res.status(400).json({ success: false, error: 'Budget already exists for this category' });
    }

    const budget = await Budget.create({
      userId: req.user.id,
      categoryId,
      amount,
      period,
      startDate,
      endDate
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all budgets with progress
// @route   GET /api/v1/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).populate('categoryId');

    // Calculate progress for each budget
    const budgetsWithProgress = await Promise.all(budgets.map(async (budget) => {
      const spent = await Transaction.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(req.user.id),
            categoryId: budget.categoryId._id,
            type: 'expense',
            isDeleted: false,
            date: { $gte: budget.startDate, $lte: budget.endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$amount' }
          }
        }
      ]);

      const totalSpent = spent[0]?.totalSpent || 0;
      const remaining = budget.amount - totalSpent;
      const percentage = (totalSpent / budget.amount) * 100;

      return {
        ...budget._doc,
        totalSpent,
        remaining,
        percentage: Math.min(percentage, 100)
      };
    }));

    res.status(200).json({
      success: true,
      count: budgetsWithProgress.length,
      data: budgetsWithProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget
// @route   PATCH /api/v1/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await budget.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Budget deleted'
    });
  } catch (error) {
    next(error);
  }
};
