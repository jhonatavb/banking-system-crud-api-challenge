const express = require("express");
const router = express.Router();

const correctPassword = require("../middlewares");
const {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
  deleteUserAccount,
  makeDeposit,
} = require("../controllers");

router.get("/contas", correctPassword, listingExistingBankAccounts);
router.post("/contas", addBankAccount);
router.put("/:numeroConta/usuario", editUserBankAccount);
router.delete("/contas/:numeroConta", deleteUserAccount);
router.post("/transacoes/depositar", makeDeposit);
module.exports = router;
