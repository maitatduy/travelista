const express = require("express");
const app = express();
const path = require("path");

const cookieParser = require("cookie-parser");
const flash = require("express-flash");
const session = require("express-session");

const variableConfig = require("./config/variable.config");

require("dotenv").config();
const database = require("./config/database.config");
const port = process.env.PORT || 3000;

const adminRoutes = require("./routes/admin/index.route");
const clientRoutes = require("./routes/client/index.route");

// Kết nối database
database.connect().then(() => {
    app.listen(port, () => {
        console.log("Express server listening on port " + port);
    });
});

// Cho phép client có thể gửi data dạng JSON
app.use(express.json());

// Cấu hình Express dùng Pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Cấu hình static files trong Express
app.use(express.static(path.join(__dirname, "public")));

// Tạo biến toàn cục trong file pug
app.locals.pathAdmin = variableConfig.pathAdmin;

// Tạo biến toàn cục trong file backend
global.pathAdmin = variableConfig.pathAdmin;

// Khai báo middleware cookie-parser
app.use(cookieParser());
app.use(
    session({
        name: "sid",
        secret: "f8c4e1a9b7d2c6f3a0e5b9d1c7a2f4e8",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 60000,
        },
    }),
);
app.use(flash());

// Thiết lập đường dẫn
app.use("/", clientRoutes);
app.use(`/${variableConfig.pathAdmin}`, adminRoutes);
