const bancoDeDados = require("../data");
let id = 1;

const createFormatAccountBank = (usuario) => {
  return {
    numero: (id++).toString(),
    saldo: 0,
    usuario,
  };
};

const verifyBodyAndData = (body = {}, numberKeys, correctKeys = []) => {
  const bodyData = Object.keys(body);

  if (bodyData.length === 0)
    return {
      statusCode: 400,
      mensagem: "Por favor informe os dados da conta!",
    };

  if (bodyData.length !== numberKeys)
    return {
      statusCode: 422,
      mensagem:
        "A requisição possui campos em excesso/insuficientes. Por favor, ajuste-a para incluir/excluir os campos necessários!",
    };

  const dataVerificationSuccess = bodyData.every((key) => {
    return correctKeys.includes(key);
  });

  if (!dataVerificationSuccess)
    return {
      statusCode: 422,
      mensagem:
        "Existe algum campo incorreto na requisição. Por favor revise-o!",
    };

  return false;
};

const checkIfClientIsRegistered = (cpf, email, accountNumber = "") => {
  const { contas } = bancoDeDados;

  return contas.some((acc) => {
    return (
      (acc.usuario.cpf === cpf || acc.usuario.email === email) &&
      acc.numero !== accountNumber
    );
  });
};

const listingExistingBankAccounts = (req, res) => {
  const { contas } = bancoDeDados;
  if (contas.length === 0) {
    return res.status(204).send(contas);
  }

  return res.status(200).send(contas);
};

const numberAccountExists = (accountNumber) => {
  const { contas } = bancoDeDados;

  return contas.find((acc) => acc.numero === accountNumber);
};

const idxAccount = (accountNumber) => {
  const { contas } = bancoDeDados;

  return contas.findIndex((acc) => acc.numero === accountNumber);
};

const getActualDateTime = () => {
  const fullDate = new Date();

  const year = fullDate.getFullYear();
  const month = String(fullDate.getMonth() + 1).padStart(2, "0");
  const day = String(fullDate.getDate()).padStart(2, "0");
  const hour = String(fullDate.getHours()).padStart(2, "0");
  const minute = String(fullDate.getMinutes()).padStart(2, "0");
  const second = String(fullDate.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const addBankAccount = (req, res) => {
  const [body] = req.body;
  const { contas } = bancoDeDados;

  const correctKeys = [
    "nome",
    "cpf",
    "data_nascimento",
    "telefone",
    "email",
    "senha",
  ];

  const { statusCode, mensagem } = verifyBodyAndData(body, 6, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).send({ mensagem });

  const { cpf, email } = body;

  if (contas.length === 0) {
    const acc = createFormatAccountBank(body);
    contas.push(acc);

    return res.status(201).send();
  }

  const dataAlreadyRegistered = checkIfClientIsRegistered(cpf, email);

  if (dataAlreadyRegistered) {
    return res
      .status(409)
      .send({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });
  }

  if (!dataAlreadyRegistered) {
    const acc = createFormatAccountBank(body);
    contas.push(acc);

    return res.status(201).send();
  }
};

const editUserBankAccount = (req, res) => {
  const { numeroConta } = req.params;
  const { body } = req;
  const { cpf, email } = body;
  const { contas } = bancoDeDados;

  const accountExists = numberAccountExists(numeroConta);

  if (!accountExists)
    return res.status(404).send({
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

  if (statusCode && mensagem) return res.status(statusCode).send({ mensagem });

  const dataAlreadyRegistered = checkIfClientIsRegistered(
    cpf,
    email,
    numeroConta
  );

  if (dataAlreadyRegistered)
    return res
      .status(409)
      .send({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" });

  const idxAccountEdit = idxAccount(numeroConta);

  accountExists.usuario = body;
  contas.splice(idxAccountEdit, 1, accountExists);

  return res.status(204).send();
};

const deleteUserAccount = (req, res) => {
  const { contas } = bancoDeDados;
  const { numeroConta } = req.params;

  const accountExists = numberAccountExists(numeroConta);

  if (!accountExists)
    return res.status(404).send({
      mensagem:
        "Desculpe, a conta que você está tentando excluir não foi encontrada em nosso sistema.",
    });

  const { numero, saldo } = accountExists;
  if (saldo !== 0)
    return res.status(409).send({
      mensagem:
        "Não é possível excluir a conta neste momento, pois ela possui um saldo diferente de zero.",
    });

  const idxAccountDel = idxAccount(numero);
  contas.splice(idxAccountDel, 1);

  return res.status(204).send();
};

const makeDeposit = (req, res) => {
  const { depositos } = bancoDeDados;
  const { body } = req;

  const correctKeys = ["numero_conta", "valor"];
  const { statusCode, mensagem } = verifyBodyAndData(body, 2, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).send({ mensagem });

  const { numero_conta, valor } = req.body;

  const accountExists = numberAccountExists(numero_conta);

  if (!accountExists)
    return res.status(404).send({
      mensagem:
        "Desculpe, a conta que está tentando realizar um deposito não existe.",
    });

  if (valor < 0)
    return res
      .status(400)
      .send({ mensagem: "Por favor, informe um saldo válido, acima de zero." });

  const data = getActualDateTime();

  depositos.push({ data, numero_conta, valor });

  accountExists.saldo += valor;

  return res.status(204).send();
};

const withdrawMoney = (req, res) => {
  const { saques } = bancoDeDados;
  const { body } = req;

  const correctKeys = ["numero_conta", "valor", "senha"];
  const { statusCode, mensagem } = verifyBodyAndData(body, 3, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).send({ mensagem });

  const { numero_conta, valor, senha } = req.body;

  const accountExists = numberAccountExists(numero_conta);

  if (!accountExists)
    return res.status(404).send({
      mensagem:
        "Desculpe, a conta que está tentando realizar um saque não existe.",
    });

  if (valor > accountExists.saldo || valor <= 0)
    return res.status(400).send({
      mensagem:
        "O saque não pode ser processado devido a um valor inválido. Certifique-se de que o valor seja positivo e não exceda o saldo disponível na conta bancária.",
    });

  if (senha !== accountExists.usuario.senha)
    return res.status(401).send({ mensagem: "A autenticação falhou!" });

  const data = getActualDateTime();

  saques.push({ data, numero_conta, valor });

  accountExists.saldo -= valor;

  return res.status(204).send();
};

const transferMoney = (req, res) => {
  const { body } = req;
  const { transferencias } = bancoDeDados;

  const correctKeys = [
    "numero_conta_origem",
    "numero_conta_destino",
    "valor",
    "senha",
  ];

  const { statusCode, mensagem } = verifyBodyAndData(body, 4, correctKeys);

  if (statusCode && mensagem) return res.status(statusCode).send({ mensagem });

  const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

  const sourceAccountExists = numberAccountExists(numero_conta_origem);
  const destinationAccountExists = numberAccountExists(numero_conta_destino);

  if (!sourceAccountExists || !destinationAccountExists)
    return res.status(404).send({
      mensagem:
        "Uma ou ambas as contas envolvidas na transferência não foram encontradas. A transferência não pode ser concluída.",
    });

  if (numero_conta_origem === numero_conta_destino)
    return res
      .status(400)
      .send({
        mensagem:
          "A transferência de uma conta para ela mesma não é permitida. Por favor, escolha contas diferentes para a transferência.",
      });

  if (valor <= 0 || valor > sourceAccountExists.saldo)
    return res.status(400).send({
      mensagem:
        "O saque não pode ser processado devido a um valor inválido. Certifique-se de que o valor seja positivo e não exceda o saldo disponível na conta bancária.",
    });

  if (senha !== sourceAccountExists.usuario.senha)
    return res.status(401).send({ mensagem: "A autenticação falhou! " });

  const data = getActualDateTime();
  transferencias.push({
    data,
    numero_conta_origem,
    numero_conta_destino,
    valor,
  });

  sourceAccountExists.saldo -= valor;
  destinationAccountExists.saldo += valor;

  return res.status(204).send();
};

module.exports = {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
  deleteUserAccount,
  makeDeposit,
  withdrawMoney,
  transferMoney,
};
