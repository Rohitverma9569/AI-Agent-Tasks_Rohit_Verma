const { randomUUID } = require("crypto");

class TransactionStore {
  constructor() {
    this._transactions = [];
  }

  create({ amount, type, timestamp }) {
    const transaction = {
      id: randomUUID(),
      amount: Number(amount),
      type,
      timestamp: timestamp || new Date().toISOString(),
    };
    this._transactions.push(transaction);
    return transaction;
  }

  listAll() {
    return [...this._transactions];
  }

  getBalance() {
    const balance = this._transactions.reduce((total, txn) => {
      return txn.type === "credit" ? total + txn.amount : total - txn.amount;
    }, 0);
    return { balance, transaction_count: this._transactions.length };
  }

  clear() {
    this._transactions = [];
  }
}

const store = new TransactionStore();

module.exports = { TransactionStore, store };
