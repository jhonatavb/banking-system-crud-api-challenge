const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const { PORT = 3000 } = process.env;

const accountsRoutes = require("./routes");

app.use("/", accountsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
