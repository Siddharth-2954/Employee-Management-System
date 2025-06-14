const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const {
  getEmployeesByUser,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeAuth");

router.get("/", verifyToken, getEmployeesByUser);
router.get("/:id", verifyToken, getEmployeeById);
router.post("/", verifyToken, addEmployee);
router.put("/:id", verifyToken, updateEmployee);
router.delete("/:id", verifyToken, deleteEmployee);

module.exports = router;
