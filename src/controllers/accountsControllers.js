const bancoDeDados = require("../data");
let id = 1;

const createFormatAccountBank = (usuario) => {
  return {
    numero: id++,
    saldo: 0,
    usuario,
  };
};

const verifyBodyAndData = (body) => {
  if (!body || Object.keys(body).length === 0)
    return { statusCode: 400, message: "Por favor informe os dados da conta!" };

  const { nome, cpf, data_nascimento, telefone, email, senha } = body;

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha)
    return { statusCode: 422, message: "Por favor informe todos os campos" };

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

  res.status(200).send(contas);
};

const addBankAccount = (req, res) => {
  const [body] = req.body;
  const { contas } = bancoDeDados;
  const { statusCode, message } = verifyBodyAndData(body);

  if (statusCode && message) return res.status(statusCode).send({ message });

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

  const accountExists = contas.find(
    (acc) => acc.numero === Number(numeroConta)
  );

  if (!accountExists)
    return res.status(404).send({
      message:
        "Conta não encontrada: A conta que você está tentando editar não existe em nosso sistema.",
    });

  const { statusCode, message } = verifyBodyAndData(body);

  if (statusCode && message) return res.status(statusCode).send({ message });

  const dataAlreadyRegistered = checkIfClientIsRegistered(cpf, email);

  if (dataAlreadyRegistered)
    return res
      .status(409)
      .send({ message: "Já existe uma conta com o cpf ou e-mail informado!" });

  const idxAccountEdit = contas.findIndex(
    (acc) => acc.numero === Number(numeroConta)
  );

  accountExists.usuario = body;
  contas.splice(idxAccountEdit, 1, accountExists);

  return res.status(204).send();
};

module.exports = {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
};
