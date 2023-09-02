const express = require("express");
const router = express.Router();

const correctPassword = require("../middlewares");
const {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
} = require("../controllers");

router.get("/contas", correctPassword, listingExistingBankAccounts);
router.post("/contas", addBankAccount);
router.put("/:numeroConta/usuario", editUserBankAccount);
module.exports = router;
