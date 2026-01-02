const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// Cấu hình Express dùng Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cấu hình static files trong Express
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log("Express server listening on port " + port);
});