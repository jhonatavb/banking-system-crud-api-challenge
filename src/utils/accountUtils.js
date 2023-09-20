const { contas } = require("../data");
const { isEmail } = require("validator");
const { BAD_REQUEST, UNPROCESSABLE_ENTITY } = require("./httpStatusUtils");
let ID = 1;

const createFormatAccountBank = (usuario) => {
  return {
    numero: (ID++).toString(),
    saldo: 0,
    usuario,
  };
};

const verifyBodyAndData = (body = {}, numberKeys, correctKeys = []) => {
  const bodyData = Object.keys(body);

  if (bodyData.length === 0)
    return {
      statusCode: BAD_REQUEST,
      mensagem: "Por favor informe os dados da conta!",
    };

  if (bodyData.length !== numberKeys)
    return {
      statusCode: 400,
      mensagem:
        "A requisição possui campos em excesso/insuficientes. Por favor, ajuste-a para incluir/excluir os campos necessários!",
    };

  const dataVerificationSuccess = bodyData.every((key) => {
    return correctKeys.includes(key);
  });

  if (!dataVerificationSuccess)
    return {
      statusCode: UNPROCESSABLE_ENTITY,
      mensagem:
        "Existe algum campo incorreto na requisição. Por favor revise-o!",
    };

  return false;
};

const userDataValidator = (body = {}) => {
  const { cpf, email, senha } = body;
  const SIZE_CPF = 11;

  if (cpf.length !== SIZE_CPF)
    return {
      statusCode: BAD_REQUEST,
      mensagem: "O CPF informado é inválido!",
    };

  if (!isEmail(email))
    return {
      statusCode: BAD_REQUEST,
      mensagem:
        "O endereço de e-mail fornecido não é válido. Certifique-se de inserir um endereço de e-mail válido.",
    };

  if (!senha.trim())
    return {
      statusCode: BAD_REQUEST,
      mensagem:
        "Sua senha é muito fraca. Por favor, escolha uma senha mais forte para garantir a segurança da sua conta.",
    };

  return false;
};

const checkIfClientIsRegistered = (cpf, email, accountNumber = "") => {
  return contas.some((acc) => {
    return (
      (acc.usuario.cpf === cpf || acc.usuario.email === email) &&
      acc.numero !== accountNumber
    );
  });
};

const numberAccountExists = (accountNumber) =>
  contas.find((acc) => acc.numero === accountNumber);

const idxAccount = (accountNumber) =>
  contas.findIndex((acc) => acc.numero === accountNumber);

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

module.exports = {
  createFormatAccountBank,
  verifyBodyAndData,
  userDataValidator,
  checkIfClientIsRegistered,
  numberAccountExists,
  idxAccount,
  getActualDateTime,
};
