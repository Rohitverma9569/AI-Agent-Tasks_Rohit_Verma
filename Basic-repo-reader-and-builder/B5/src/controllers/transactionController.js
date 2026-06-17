const { store } = require("../services/transactionStore");

function createTransaction(req, res, next) {
  try {
    const transaction = store.create(req.body);
    console.log(
      `[INFO] Created transaction id=${transaction.id} type=${transaction.type} amount=${transaction.amount}`
    );
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

function getTransactions(req, res, next) {
  try {
    const transactions = store.listAll();
    console.log(`[INFO] Listed ${transactions.length} transaction(s)`);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

function getBalance(req, res, next) {
  try {
    const result = store.getBalance();
    console.log(
      `[INFO] Balance requested: balance=${result.balance} count=${result.transaction_count}`
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTransaction,
  getTransactions,
  getBalance,
};
