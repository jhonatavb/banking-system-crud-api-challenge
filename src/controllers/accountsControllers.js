const bancoDeDados = require("../data");
let id = 1;

const createFormatAccountBank = (usuario) => {
  return {
    numero: id++,
    saldo: 0,
    usuario,
  };
};

const verifyBodyAndData = (body = {}) => {
  const bodyData = Object.keys(body);

  if (bodyData.length === 0)
    return {
      statusCode: 400,
      mensagem: "Por favor informe os dados da conta!",
    };

  if (bodyData.length !== 6)
    return {
      statusCode: 422,
      mensagem:
        "A requisição possui campos em excesso/insuficientes. Por favor, ajuste-a para incluir/excluir os campos necessários!",
    };

  const correctKeys = [
    "nome",
    "cpf",
    "data_nascimento",
    "telefone",
    "email",
    "senha",
  ];

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

const checkIfClientIsRegistered = (cpf, email) => {
  const { contas } = bancoDeDados;

  return contas.some((acc) => {
    return acc.usuario.cpf === cpf || acc.usuario.email === email;
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

  return contas.find((acc) => acc.numero === Number(accountNumber));
};

const idxAccount = (accountNumber) => {
  const { contas } = bancoDeDados;

  return contas.findIndex((acc) => acc.numero === Number(accountNumber));
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
  const { statusCode, mensagem } = verifyBodyAndData(body);

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

  const { statusCode, mensagem } = verifyBodyAndData(body);

  if (statusCode && mensagem) return res.status(statusCode).send({ mensagem });

  const dataAlreadyRegistered = checkIfClientIsRegistered(cpf, email);

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
  const { numero_conta, valor } = req.body;

  if (!numero_conta || !valor)
    return res.status(400).send({
      mensagem: "Por favor informe o número da conta e o valor para deposito. ",
    });

  const accountExists = numberAccountExists(numero_conta);

  if (!accountExists)
    return res.status(404).send({
      mensagem:
        "Desculpe, a conta que está tentando realizar um deposito não existe.",
    });

  if (!valor || valor < 0)
    return res
      .status(400)
      .send({ mensagem: "Por favor, informe um saldo válido, acima de zero." });

  const data = getActualDateTime();

  depositos.push({ data, numero_conta, valor });

  accountExists.saldo += valor;

  return res.status(204).send();
};

module.exports = {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
  deleteUserAccount,
  makeDeposit,
};
