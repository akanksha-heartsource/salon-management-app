const Category = require("../models/Category");

// Get all categories with services
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single category by name
exports.getCategoryByName = async (req, res) => {
  try {
    const category = await Category.findOne({ category: req.params.name });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { category, services } = req.body;
    const newCategory = new Category({ category, services });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a category by name
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { category: req.params.name },
      { $set: req.body },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category by name
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      category: req.params.name,
    });
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
