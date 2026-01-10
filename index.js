const express = require("express");
const app = express();
const path = require("path");

const variableConfig = require("./config/variable.config");

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

// Cho phép client có thể gửi data dạng JSON
app.use(express.json());

// Cấu hình Express dùng Pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cấu hình static files trong Express
app.use(express.static(path.join(__dirname, 'public')));

// Tạo biến toàn cục trong file pug
app.locals.pathAdmin = variableConfig.pathAdmin;

// Thiết lập đường dẫn
app.use("/", clientRoutes);
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);