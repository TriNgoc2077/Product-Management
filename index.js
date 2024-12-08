const express = require('express');
require("dotenv").config();

const database = require('./config/database');

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

// App Locals Variables

app.locals.prefixAdmin = systemConfig.prefixAdmin;
//app.localv."name var" => variable prefixAdmin exists in all project files

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
//git pull origin main