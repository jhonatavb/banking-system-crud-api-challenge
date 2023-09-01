const express = require("express");
const router = express.Router();

const correctPassword = require("../middlewares");
const {
  listingExistingBankAccounts,
  addBankAccount,
} = require("../controllers");

router.get("/contas", correctPassword, listingExistingBankAccounts);
router.post("/contas", addBankAccount);
module.exports = router;
