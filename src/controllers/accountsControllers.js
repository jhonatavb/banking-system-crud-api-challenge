const bancoDeDados = require("../data");
let id = 1;

const createFormatAccountBank = (usuario) => {
  return {
    numero: id++,
    saldo: 0,
    usuario,
  };
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
  const { nome, cpf, data_nascimento, telefone, email, senha } = body;
  const { contas } = bancoDeDados;

  if (!body) {
    return res
      .status(400)
      .send({ mensagem: "Por favor informe os dados da conta!" });
  }

  if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
    return res
      .status(422)
      .send({ mensagem: "Por favor informe todos os campos!" });
  }

  if (contas.length === 0) {
    const acc = createFormatAccountBank(body);
    contas.push(acc);

    return res.status(201).send();
  }

  const dataAlreadyRegistered = contas.some((acc) => {
    return acc.usuario.cpf === cpf || acc.usuario.email === email;
  });

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

module.exports = {
  listingExistingBankAccounts,
  addBankAccount,
};
