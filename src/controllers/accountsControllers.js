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
  const bodyData = Object.keys(body);

  if (!body || bodyData.length === 0)
    return {
      statusCode: 400,
      mensagem: "Por favor informe os dados da conta!",
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

  if (correctKeys.length !== 6 || !dataVerificationSuccess)
    return { statusCode: 422, mensagem: "Por favor informe todos os campos" };

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

  const accountExists = contas.find(
    (acc) => acc.numero === Number(numeroConta)
  );

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

  const idxAccountEdit = contas.findIndex(
    (acc) => acc.numero === Number(numeroConta)
  );

  accountExists.usuario = body;
  contas.splice(idxAccountEdit, 1, accountExists);

  return res.status(204).send();
};

const deleteUserAccount = (req, res) => {
  const { contas } = bancoDeDados;
  const { numeroConta } = req.params;

  const accountExists = contas.find(
    (acc) => acc.numero === Number(numeroConta)
  );

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

  const idxAccountDel = contas.findIndex(
    (acc) => acc.numero === Number(numero)
  );

  contas.splice(idxAccountDel, 1);

  return res.status(204).send();
};

module.exports = {
  listingExistingBankAccounts,
  addBankAccount,
  editUserBankAccount,
  deleteUserAccount,
};
