const express = require("express");
const router = express.Router();

const {
  bankValidatePassword,
  userValidatePassword,
} = require("../middlewares");

const {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
  deleteUserAccount,
  makeDeposit,
  withdrawMoney,
  transferMoney,
  getBalance,
} = require("../controllers");

router.get("/contas", bankValidatePassword, listingExistingBankAccounts);
router.post("/contas", addBankAccount);
router.put("/:numeroConta/usuario", editUserBankAccount);
router.delete("/contas/:numeroConta", deleteUserAccount);
router.post("/transacoes/depositar", makeDeposit);
router.post("/transacoes/sacar", userValidatePassword, withdrawMoney);
router.post("/transacoes/transferir", userValidatePassword, transferMoney);
router.get("/contas/saldo", userValidatePassword, getBalance);
module.exports = router;
