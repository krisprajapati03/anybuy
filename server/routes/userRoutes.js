const express = require("express");
const {
  getUserDetails,
  updateUserProfile,
  fetchUsers,
} = require("../controllers/userController");
const upload = require("../middleware/uploadMulter");

const router = express.Router();

router.get("/:id", getUserDetails);
router.get("/", fetchUsers);
router.put("/update/:id", upload.single("image"), updateUserProfile);

module.exports = router;
