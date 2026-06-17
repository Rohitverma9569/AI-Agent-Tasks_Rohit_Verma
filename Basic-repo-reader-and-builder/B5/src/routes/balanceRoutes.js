const express = require("express");
const { getBalance } = require("../controllers/transactionController");

const router = express.Router();

router.get("/balance", getBalance);

module.exports = router;
