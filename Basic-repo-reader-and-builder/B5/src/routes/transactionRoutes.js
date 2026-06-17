const express = require("express");
const {
  createTransaction,
  getTransactions,
} = require("../controllers/transactionController");
const { validateTransaction } = require("../middleware/validateTransaction");

const router = express.Router();

router.post("/", validateTransaction, createTransaction);
router.get("/", getTransactions);

module.exports = router;
