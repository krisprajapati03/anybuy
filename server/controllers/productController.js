const Product = require("../models/Product");

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin (or Public for now)
exports.createProduct = async (req, res) => {
  try {
    // Pull exactly the fields you collect in your form
    const {
      name, // your form’s Title
      price,
      description,
      stock,
      category,
      condition, // "advance" or "delivery"
    } = req.body;

    // Require image upload
    if (!req.file) {
      return res.status(400).json({ message: "Product image is required" });
    }

    // Build and save
    const product = new Product({
      name,
      price,
      description,
      stock: Number(stock) || 0,
      category,
      condition,
      image: req.file.path, // multer’s file path
      rating: 0, // default
      numReviews: 0, // if you track reviews
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get a single product by ID
// @route GET /api/products/:id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category) {
      filter.category = category;
    }

    // Fetch all products without pagination
    const products = await Product.find(filter);

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/products/category/:category
exports.getProductsByCategory = async (req, res) => {
  try {
    let { category } = req.params;

    // Define allowed categories with their URL-friendly versions
    const categoryMap = {
      "home-appliances": "Home Appliances",
      headphones: "Headphones",
      laptop: "Laptop",
      "gaming-accessories": "Gaming Accessories",
      phone: "Phone",
      television: "Television",
      smartwatch: "Smartwatch", // ✅ New Category Added
    };

    // Convert URL-friendly category to actual database category
    const categoryMatch = categoryMap[category.toLowerCase()];

    if (!categoryMatch) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // Fetch products that exactly match the category
    const products = await Product.find({ category: categoryMatch });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.json({
      totalProducts: products.length,
      category: categoryMatch,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

const categoryMap = {
  "home-appliances": "Home Appliances",
  headphones: "Headphones",
  laptop: "Laptop",
  "gaming-accessories": "Gaming Accessories",
  phone: "Phone",
  television: "Television",
  smartwatch: "Smartwatch",
};

// Keyword mapping for better search results
const keywordMap = {
  mobile: "phone", // map 'mobile' to 'phone'
  earphone: "headphones", // map 'earphone' to 'headphones'
  // Add more mappings as needed
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const queryLower = query.toLowerCase();

    // Check if the query matches a keyword map (like 'mobile' to 'phone')
    const mappedCategory = keywordMap[queryLower] || queryLower;

    // Check if the mapped category exists in the categoryMap
    const matchedCategory = Object.keys(categoryMap).find(
      (key) => key.toLowerCase() === mappedCategory
    );

    let filter = {};

    if (matchedCategory) {
      // If we have a category match, filter by the category name
      filter.category = categoryMap[matchedCategory];
    } else {
      // Otherwise, perform a partial match for product name (case-insensitive)
      filter.name = { $regex: query, $options: "i" };
    }

    const products = await Product.find(filter);

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({ totalProducts: products.length, products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, minRating, condition, sort } =
      req.query;

    let filter = {};

    // ✅ Category Mapping
    const categoryMap = {
      "home-appliances": "Home Appliances",
      headphones: "Headphones",
      laptop: "Laptop",
      "gaming-accessories": "Gaming Accessories",
      phone: "Phone",
      television: "Television",
      smartwatch: "Smartwatch",
    };

    // ✅ Convert URL-friendly category to actual database category
    if (category) {
      const categoryMatch = categoryMap[category.toLowerCase()];
      if (!categoryMatch) {
        return res.status(400).json({ message: "Invalid category" });
      }
      filter.category = categoryMatch;
    }

    // ✅ Fix Price Filtering Logic
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // Convert `minPrice` to a number
      if (maxPrice) filter.price.$lte = Number(maxPrice); // Convert `maxPrice` to a number
    }

    // ✅ Filter by minimum rating
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) };
    }

    // ✅ Filter by condition (must be "advance" or "delivery")
    if (
      condition &&
      ["advance", "delivery"].includes(condition.toLowerCase())
    ) {
      filter.condition = condition.toLowerCase();
    }

    // ✅ Sorting Logic (Default: No Sorting)
    let sortOption = {};
    if (sort === "price-asc") {
      sortOption.price = 1; // Sort Price Low to High
    } else if (sort === "price-desc") {
      sortOption.price = -1; // Sort Price High to Low
    }

    // 🔍 Fetch filtered & sorted products
    const products = await Product.find(filter).sort(sortOption);

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json({ totalProducts: products.length, products });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product details (price, stock, description)
// @route   PATCH /api/products/:id
// @access  Public (or make it Admin protected later)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock, description } = req.body;

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update only the fields that are provided
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (description !== undefined) product.description = description;

    // Save updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public (or Admin-protected later)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // findByIdAndDelete returns the deleted doc or null
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
