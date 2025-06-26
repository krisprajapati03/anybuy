const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  filterProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMulter");

const router = express.Router();

router.post("/add", upload.single("photo"), createProduct);
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/filter", filterProducts);
router.get("/:id", getProduct);
router.get("/category/:category", getProductsByCategory);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
