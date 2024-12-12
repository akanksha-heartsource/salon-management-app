const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/:name", categoryController.getCategoryByName);
router.post("/", categoryController.addCategory);
router.put("/:name", categoryController.updateCategory);
router.delete("/:name", categoryController.deleteCategory);

module.exports = router;
