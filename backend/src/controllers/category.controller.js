import Category from '../models/Category.model.js';
import Transaction from '../models/Transaction.model.js';

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
export const createCategory = async (req, res, next) => {
  try {
    const { name, type, color, icon } = req.body;

    // Check if category already exists for this user
    const categoryExists = await Category.findOne({ userId: req.user.id, name });
    if (categoryExists) {
      return res.status(400).json({ success: false, error: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      type,
      color,
      icon,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Private
export const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    let query = {
      $or: [
        { userId: req.user.id },
        { isDefault: true }
      ]
    };

    if (type) {
      query.type = type;
    }

    const categories = await Category.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Private
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Check ownership
    if (category.userId && category.userId.toString() !== req.user.id && !category.isDefault) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PATCH /api/v1/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Check ownership
    if (category.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Prevent updating default categories
    if (category.isDefault) {
      return res.status(400).json({ success: false, error: 'Cannot update default category' });
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Check ownership
    if (category.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    // Prevent deleting default categories
    if (category.isDefault) {
      return res.status(400).json({ success: false, error: 'Cannot delete default category' });
    }

    // Check if transactions exist
    const transactionCount = await Transaction.countDocuments({ categoryId: req.params.id, userId: req.user.id });
    
    if (transactionCount > 0 && req.query.action !== 'cascade') {
      return res.status(409).json({ 
        success: false, 
        error: `Category has ${transactionCount} transactions. Use ?action=cascade to delete all.` 
      });
    }

    if (req.query.action === 'cascade') {
      await Transaction.deleteMany({ categoryId: req.params.id, userId: req.user.id });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    next(error);
  }
};
