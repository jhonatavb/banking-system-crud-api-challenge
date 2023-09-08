const {
  banco: { senha },
} = require("../data/bancodedados");

const { numberAccountExists, verifyBodyAndData } = require("../utils");

const bankValidatePassword = (req, res, next) => {
  try {
    const { senha_banco } = req.query;
    if (!senha_banco)
      return res.status(400).send({ mensagem: "Por favor, informe a senha!" });
    if (senha_banco !== senha)
      return res.status(401).send({ mensagem: "A autenticação falhou!" });

    next();
  } catch (err) {
    return res.status(500).json({ mensagem: err });
  }
};

const userValidatePassword = (req, res, next) => {
  try {
    const { query, body } = req;
    const { numero_conta_origem, numero_conta, senha } =
      Object.keys(query).length === 0 ? body : query;

    const params = {
      numero_conta: numero_conta_origem || numero_conta,
      senha,
    };

    const correctKeys = ["numero_conta", "senha"];
    const { statusCode, mensagem } = verifyBodyAndData(params, 2, correctKeys);

    if (statusCode && mensagem)
      return res.status(statusCode).send({ mensagem });

    const accountExists = numberAccountExists(params.numero_conta);

    if (!accountExists)
      return res.status(404).send({
        mensagem:
          "A conta informada não existe. Por favor, certifique-se de informar uma conta válida.",
      });

    const { usuario } = accountExists;
    if (usuario.senha !== senha)
      return res.status(401).send({ mensagem: "A autenticação falhou!" });

    next();
  } catch (err) {
    return res.status(500).json({ mensagem: err });
  }
};

module.exports = { bankValidatePassword, userValidatePassword };
