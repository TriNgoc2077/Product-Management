const express = require('express');
require("dotenv").config();

const route = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})