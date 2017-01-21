const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cons = require('consolidate');
const session = require('express-session');
const flash = require("connect-flash");

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'dust');
app.engine('dust', cons.dust);
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));


var fs = require("fs");
app.get("/", function (req, res) {
    res.status(200).write("home");
    res.end();
});
app.use("/line", require("./line"));
app.use("/fb", require("./fb"));
app.get("/log", function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    fs.createReadStream("./node.log").pipe(res);
});

// catch 404 and handle it
app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handlers
// development envrionment only
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json(err);
    });
}

// production handler, no stack trace leak to users
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
});

module.exports = app;
