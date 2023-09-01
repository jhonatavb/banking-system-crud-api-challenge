const {
  banco: { senha },
} = require("../data/bancodedados");

const correctPassword = (req, res, next) => {
  try {
    const { senha_banco } = req.query;
    if (!senha_banco)
      return res.status(400).send({ mensagem: "Por favor, informe a senha!" });
    if (senha_banco !== senha)
      return res
        .status(401)
        .send({ mensagem: "A senha do banco informada é inválida!" });

    next();
  } catch (e) {
    console.error(e);
  }
};

module.exports = correctPassword;
