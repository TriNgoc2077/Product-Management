const express = require('express');
require("dotenv").config();
var methodOverride = require("method-override");
const bodyParser = require("body-parser");
const database = require('./config/database');
const flash = require("express-flash");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const systemConfig = require("./config/system");

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

//flash
// app.use(express.cookieParser("keyboard cat"));
// app.use(express.session({ cookie: { maxAge: 60000 }}));
// app.use(flash());
//end flash


// App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
//app.locals."name var" => variable prefixAdmin exists in all project files

app.use(express.static("public"));

routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})
//git pull origin main
//npm i method-override, ghi de phuong thuc khi gui len