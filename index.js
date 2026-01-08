const express = require("express");
const app = express();
const path = require("path");

require("dotenv").config();
const database = require("./config/database.config");
const port = process.env.PORT || 3000;

const adminRoutes = require("./routes/admin/index.route");
const clientRoutes = require("./routes/client/index.route");

// Kết nối database
database.connect()
    .then(() => {
        app.listen(port, () => {
            console.log("Express server listening on port " + port);
        });
    });

// Cấu hình Express dùng Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cấu hình static files trong Express
app.use(express.static(path.join(__dirname, 'public')));

// Thiết lập đường dẫn
app.use("/", clientRoutes);
app.use("/admin", adminRoutes);