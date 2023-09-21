<div align="center">

# Banking System CRUD API Challenge
##### :bank: Facilitating your banking needs with the utmost efficiency.


<img src="https://i.imgur.com/O1x9AGg.png" alt="cubosbank-logo" height="300" />
</div>

## 💻 Overview
Welcome to the Banking API, your gateway to a seamless banking experience. Our API is designed to bring the power of CRUD operations to your fingertips, ensuring smooth user registration, account management, and financial transactions.

## 🛠️ Technologies
![https://nodejs.org/en](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![https://expressjs.com/](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![https://developer.mozilla.org/en-US/docs/Web/JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## 📦 Features
- [x] **User Registration**
- [x] **User Editing**
- [x] **User Deletion**
- [x] **Add Funds**
- [x] **Balance Inquiry**
- [x] **Transfers**
- [x] **Bank Statement**
- [x] **Support for Different HTTP Methods**

## 📋 Prerequisites
To clone the repository, you will need to have [git](https://git-scm.com/downloads) installed on your machine. Additionally, to run the server, you will need [Node.js](https://nodejs.org/en) installed.

## 🚀 Installation
- Clone the project and navigate to the directory
```bash
git clone git@github.com:jhonatavbrg/banking-system-crud-api-challenge.git && cd banking-system-crud-api-challenge
```
- Install project dependencies<br />
```bash
npm i
```

# 🔎 How To Use
- Supported Methods `GET`, `POST`, `PUT` and `DELETE`
- For requests that use methods other than `GET`, such as `POST`, `PUT`, and `DELETE`, it will be necessary to use a client tool like [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com/), or any other of your choice
- (Optional) If you wish to configure a specific port for running the API, create a .env file with an environment variable `PORT=XXXX`, where `XXXX` is the port number. Alternatively, you can execute the following command within the project directory, simply replacing the number after the `=` with your preferred number. If you don't want to configure a number, the API runs on port 3000 by default
```bash
echo "PORT=YOUR_PREFERRED_NUMBER" >> .env
```
- Inside the project directory, run the command
```bash
node ./src/app.js
```
- After that, the server will be running the API, and you can configure your routes in Insomnia, Postman, or any other client of your choice. The routes to be configured are as follows:
(Remember to change the port if you have configured a different one)<br />
#### `GET http://localhost:3000/contas?senha_banco=Cubos123Bank`

Returns the list of all registered users.

#### `POST http://localhost:3000/contas?senha_banco=Cubos123Bank`
    {
      "nome": "Foo Bar",
      "cpf": "73278729064",
      "data_nascimento": "2000-03-15",
      "telefone": "71999998888",
      "email": "foo@bar.com",
      "senha": "barfoo4242?"
    }
Registers a user in the system (CPF, email, password, and date of birth will be validated).

#### `PUT http://localhost:3000/contas/1/usuario`
    {
      "nome": "Foo Bar Baz",
      "cpf": "73278729064",
      "data_nascimento": "1999-03-15",
      "telefone": "71999998888",
      "email": "foo@bar.com",
      "senha": "barfoo4242?"
    }
Edits a user. The user's number is sent via the parameters, and the fields are sent in the request body. It's important to include all fields, even the ones you don't want to modify.

#### `DELETE http://localhost:3000/contas/1`

Deletes a user from the system. The user's number is sent via the parameters.

#### `POST http://localhost:3000/transacoes/depositar`
    {
      "numero_conta": "1",
      "valor": 10000
    }
Adds funds to an account. The account number and the deposit amount are sent in the request body.

#### `POST http://localhost:3000/transacoes/sacar`
    {
      "numero_conta": "1",
      "valor": "1000",
      "senha": "barfoo4242?"
    }
Withdraws funds from a bank account. The account number, amount, and password are sent in the request body.

#### `POST http://localhost:3000/transacoes/transferir`
    {
      "numero_conta_origem": "1",
      "numero_conta_destino": "2",
      "valor": 1500,
      "senha": "barfoo4242?"
    }
Performs a bank transfer from one account to another. The source account number, destination account number, amount, and password are provided in the request body.

#### `GET http://localhost:3000/contas/extrato?numero_conta=1&senha=barfoo4242?`

Generates a statement with all transactions involving the requested account. The account number and password are provided in the parameters.

# 🖼️ Screenshots
<details>
  <summary>GET ALL USERS</summary><br />
    <img src="https://i.imgur.com/g90lBXy.png" />
</details>

<details>
  <summary>GET ACCOUNT STATEMENT</summary><br />
    <img src="https://i.imgur.com/QM08to2.png" />
</details>

# 🐞 Issues and 💡 Suggestions
- If you encounter any issues (bugs) or have suggestions for improving this project, please feel free to report them on the [Issue-tracker](https://github.com/jhonatavbrg/banking-system-crud-api-challenge/issues)

# 📝 License
[MIT](https://opensource.org/license/mit/) © [jhonatavbrg](https://www.linkedin.com/in/jhonatavbrg)
