const { contas, depositos, saques, transferencias } = require("../data");
const {
  createFormatAccountBank,
  verifyBodyAndData,
  userDataValidator,
  checkIfClientIsRegistered,
  numberAccountExists,
  idxAccount,
  getActualDateTime,
  HTTP_STATUS: { OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND, CONFLICT },
} = require("../utils");

const listingExistingBankAccounts = (req, res) => {
  if (contas.length === 0) {
    return res.status(CREATED).json();
  }

  return res.status(OK).json(contas);
};

const addBankAccount = (req, res) => {
  const { body } = req || {};

  const correctKeys = [
    "nome",
    "cpf",
    "data_nascimento",
    "telefone",
    "email",
    "senha",
  ];

  const { statusCode, mensagem } = verifyBodyAndData(body, 6, correctKeys);
  if (statusCode && mensagem) return res.status(statusCode).json({ mensagem });

  const { statusCode: sc, mensagem: msg } = userDataValidator(body);
  if (sc && msg) return res.status(sc).json({ mensagem: msg });

  if (contas.length === 0) {
    const acc = createFormatAccountBank(body);
    contas.push(acc);

    return res.status(CREATED).json();
  }

  const { cpf, email } = body;
  const dataAlreadyRegistered = checkIfClientIsRegistered(cpf, email);

  if (dataAlreadyRegistered) {
    return res
      .status(CONFLICT)
      .json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
  }

  if (!dataAlreadyRegistered) {
    const acc = createFormatAccountBank(body);
    contas.push(acc);

    return res.status(CREATED).json();
  }
};

const editUserBankAccount = (req, res) => {
  const { numeroConta } = req.params || 0;
  const { body } = req || {};

  const accountExists = numberAccountExists(numeroConta);

  if (!accountExists)
    return res.status(NOT_FOUND).json({
      mensgem:
        "Conta não encontrada: A conta que você está tentando editar não existe em nosso sistema.",
    });

  const correctKeys = [
    "nome",
    "cpf",
    "data_nascimento",
    "telefone",
    "email",
    "senha",
  ];

  const { statusCode, mensagem } = verifyBodyAndData(body, 6, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).json({ mensagem });

  const { cpf, email } = body;
  const dataAlreadyRegistered = checkIfClientIsRegistered(
    cpf,
    email,
    numeroConta
  );

  if (dataAlreadyRegistered)
    return res
      .status(CONFLICT)
      .json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });

  const { statusCode: sc, mensagem: msg } = userDataValidator(body);
  if (sc && msg) return res.status(sc).json({ mensagem: msg });

  const idxAccountEdit = idxAccount(numeroConta);

  accountExists.usuario = body;
  contas.splice(idxAccountEdit, 1, accountExists);

  return res.status(NO_CONTENT).json();
};

const deleteUserAccount = (req, res) => {
  const { numeroConta } = req.params || 0;

  const accountExists = numberAccountExists(numeroConta);

  if (!accountExists)
    return res.status(NOT_FOUND).json({
      mensagem:
        "Desculpe, a conta que você está tentando excluir não foi encontrada em nosso sistema.",
    });

  const { numero, saldo } = accountExists;
  if (saldo !== 0)
    return res.status(CONFLICT).json({
      mensagem:
        "Não é possível excluir a conta neste momento, pois ela possui um saldo diferente de zero.",
    });

  const idxAccountDel = idxAccount(numero);
  contas.splice(idxAccountDel, 1);

  return res.status(NO_CONTENT).json();
};

const makeDeposit = (req, res) => {
  const { body } = req || {};

  const correctKeys = ["numero_conta", "valor"];
  const { statusCode, mensagem } = verifyBodyAndData(body, 2, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).json({ mensagem });

  const { numero_conta, valor } = req.body;

  const accountExists = numberAccountExists(numero_conta);

  if (!accountExists)
    return res.status(NOT_FOUND).json({
      mensagem:
        "Desculpe, a conta que está tentando realizar um deposito não existe.",
    });

  if (valor < 0)
    return res
      .status(BAD_REQUEST)
      .json({ mensagem: "Por favor, informe um saldo válido, acima de zero." });

  const data = getActualDateTime();

  depositos.push({ data, numero_conta, valor });

  accountExists.saldo += valor;

  return res.status(NO_CONTENT).json();
};

const withdrawMoney = (req, res) => {
  const { numero_conta = 0, valor = 0 } = req.body;

  const accountExists = numberAccountExists(numero_conta);

  if (!valor || valor > accountExists.saldo || valor <= 0)
    return res.status(BAD_REQUEST).json({
      mensagem:
        "O saque não pode ser processado devido a um valor inválido. Certifique-se de informar o campo valor, que ele seja positivo e não exceda seu saldo.",
    });

  const data = getActualDateTime();

  saques.push({ data, numero_conta, valor });

  accountExists.saldo -= valor;

  return res.status(NO_CONTENT).json();
};

const transferMoney = (req, res) => {
  const { body } = req || {};

  const correctKeys = [
    "numero_conta_origem",
    "numero_conta_destino",
    "valor",
    "senha",
  ];

  const { statusCode, mensagem } = verifyBodyAndData(body, 4, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).json({ mensagem });

  const { numero_conta_origem, numero_conta_destino, valor } = req.body;

  const sourceAccountExists = numberAccountExists(numero_conta_origem);
  const destinationAccountExists = numberAccountExists(numero_conta_destino);

  if (!destinationAccountExists)
    return res.status(NOT_FOUND).json({
      mensagem:
        "Conta de destino informada não existe, por favor informe outra conta!",
    });

  if (numero_conta_origem === numero_conta_destino)
    return res.status(NOT_FOUND).json({
      mensagem:
        "A transferência de uma conta para ela mesma não é permitida. Por favor, escolha contas diferentes para a transferência.",
    });

  if (valor <= 0 || valor > sourceAccountExists.saldo)
    return res.status(NOT_FOUND).json({
      mensagem:
        "A transferência não pode ser processada devido a um valor inválido. Certifique-se de que o valor seja positivo e não exceda o saldo disponível na conta bancária.",
    });

  const data = getActualDateTime();
  transferencias.push({
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  });

  sourceAccountExists.saldo -= valor;
  destinationAccountExists.saldo += valor;

  return res.status(NO_CONTENT).json();
};

const getBalance = (req, res) => {
  const { numero_conta } = req.query;

  const { saldo } = numberAccountExists(numero_conta);

  return res.status(OK).json({ saldo });
};

const getAccountStatement = (req, res) => {
  const { numero_conta: accNum } = req.query || 0;

  const filterTransfers = (transations, key) => {
    return transations.filter((transation) => transation[key] === accNum);
  };

  const deposits = filterTransfers(depositos, "numero_conta");
  const withdraw = filterTransfers(saques, "numero_conta");
  const sentTransfers = filterTransfers(transferencias, "numero_conta_origem");
  const receivedTransfers = filterTransfers(
    transferencias,
    "numero_conta_destino"
  );

  if (
    !deposits.length &&
    !withdraw.length &&
    !sentTransfers.length &&
    !receivedTransfers.length
  )
    return res.status(NOT_FOUND).json({
      mensagem: "Nenhuma transação bancária encontrada para esta conta.",
    });

  return res.status(OK).json({
    depositos: deposits,
    saques: withdraw,
    transferenciasEnviadas: sentTransfers,
    transferenciasRecebidas: receivedTransfers,
  });
};

module.exports = {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
  deleteUserAccount,
  makeDeposit,
  withdrawMoney,
  transferMoney,
  getBalance,
  getAccountStatement,
};
