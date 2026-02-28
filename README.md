# Travelista

Hệ thống website đặt tour du lịch xây bằng **Node.js + Express + MongoDB + Pug**, gồm:

- `Client`: trang công khai cho người dùng tìm tour, thêm giỏ hàng, đặt tour, thanh toán.
- `Admin`: trang quản trị để quản lý tour, danh mục, đơn hàng, tài khoản admin, nhóm quyền, thông tin website.

## 1. Công nghệ sử dụng

- Node.js (CommonJS)
- Express `5.2.x`
- MongoDB + Mongoose
- Pug template engine
- JWT (đăng nhập admin bằng cookie token)
- Cloudinary + Multer (upload ảnh)
- Nodemailer (gửi OTP reset mật khẩu)
- Joi (validate đầu vào)
- Tích hợp thanh toán:
  - VNPay
  - ZaloPay

## 2. Kiến trúc thư mục

```text
travelista/
├─ config/          # cấu hình app, DB, quyền, biến dùng chung
├─ controllers/     # xử lý nghiệp vụ admin/client
├─ helpers/         # helper cloudinary, mail, sort, category tree...
├─ middlewares/     # middleware auth admin + middleware dữ liệu client
├─ models/          # schema mongoose
├─ public/          # static assets (css/js/images)
├─ routes/          # route admin/client
├─ validates/       # Joi validation
├─ views/           # giao diện Pug (admin/client)
├─ index.js         # entry point
├─ .env.example     # mẫu biến môi trường
└─ package.json
```

## 3. Yêu cầu môi trường

- Node.js `>= 18` (khuyến nghị dùng bản LTS mới)
- MongoDB Atlas hoặc MongoDB local
- Tài khoản Cloudinary
- SMTP mail (project đang cấu hình host Gmail SMTP)
- Tài khoản test/payment gateway:
  - ZaloPay
  - VNPay

## 4. Cài đặt và chạy local

### Bước 1: cài dependencies

```bash
npm install
```

hoặc:

```bash
yarn
```

### Bước 2: tạo file `.env`

```bash
cp .env.example .env
```

Điền đầy đủ giá trị theo bảng bên dưới.

### Bước 3: chạy dự án

```bash
npm run start
```

Script hiện tại:

- `start`: chạy `nodemon --inspect index.js`
- `test`: chưa có test (`Error: no test specified`)

### Bước 4: truy cập

- Client: `http://localhost:3000/`
- Admin login: `http://localhost:3000/admin/account/login`

> `admin` là `pathAdmin` hiện tại trong `config/variable.config.js`.

## 5. Biến môi trường (`.env`)

File mẫu: `.env.example`

```env
PORT=
MONGODB_URI="mongodb+srv://username:password@cluster0.hexuern.mongodb.net/database_name"
JWT_SECRET=

# Nodemailer
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_SECURE=false

# Cloudinary
CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Zalopay
ZALO_APP_ID=
ZALO_KEY_1=
ZALO_KEY_2=
ZALO_DOMAIN=
ZALO_DOMAIN_WEBSITE=
DOMAIN_WEBSITE=

# VNPAY
VNPAY_CODE=""
VNPAY_SECRET=""
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
```

Giải thích nhanh:

- `PORT`: cổng chạy app (mặc định 3000 nếu bỏ trống)
- `MONGODB_URI`: URI MongoDB
- `JWT_SECRET`: ký/verify JWT cho admin
- `EMAIL_*`: gửi OTP quên mật khẩu
- `CLOUDINARY_*`: upload ảnh danh mục/tour/profile
- `ZALO_*`: tạo thanh toán ZaloPay + callback
- `DOMAIN_WEBSITE` và `ZALO_DOMAIN_WEBSITE`: domain redirect sau thanh toán
- `VNPAY_*`: cấu hình cổng VNPay

## 6. Luồng chức năng chính

### Client

- Trang chủ hiển thị tour nổi bật theo 2 nhóm danh mục (trong nước / nước ngoài)
- Xem danh sách tour theo danh mục (`/category/:slug`)
- Xem chi tiết tour (`/tour/detail/:slug`)
- Tìm kiếm/filter tour (`/search`)
- Giỏ hàng lưu bằng `localStorage` phía client
- Gửi thông tin đặt tour (`/order/create`)
- Thanh toán:
  - Tiền mặt/chuyển khoản: vào trang thành công
  - ZaloPay: redirect cổng ZaloPay + callback kết quả
  - VNPay: redirect cổng VNPay + verify hash kết quả

### Admin

- Đăng ký / đăng nhập / quên mật khẩu OTP qua email
- Dashboard tổng quan + biểu đồ doanh thu theo ngày
- Quản lý danh mục tour (CRUD + lọc + tìm kiếm)
- Quản lý tour (CRUD, thùng rác, khôi phục, xóa vĩnh viễn, thao tác hàng loạt)
- Quản lý đơn hàng (xem + cập nhật trạng thái)
- Quản lý liên hệ
- Cài đặt hệ thống:
  - Thông tin website
  - Tài khoản quản trị
  - Nhóm quyền (role + permissions)
- Quản lý profile admin

## 7. Danh sách route chính

## 7.1 Client routes

- `GET /` - Trang chủ
- `GET /tour/detail/:slug` - Chi tiết tour
- `GET /category/:slug` - Danh sách tour theo danh mục
- `GET /search` - Tìm kiếm tour
- `GET /cart` - Trang giỏ hàng
- `POST /cart/detail` - Lấy chi tiết item giỏ hàng từ danh sách localStorage
- `POST /contact/create` - Đăng ký liên hệ/email
- `POST /order/create` - Tạo đơn hàng
- `GET /order/success` - Trang đơn thành công
- `GET /order/payment-zalopay` - Tạo thanh toán ZaloPay
- `POST /order/payment-zalopay-result` - Callback từ ZaloPay
- `GET /order/payment-vnpay` - Tạo thanh toán VNPay
- `GET /order/payment-vnpay-result` - Callback từ VNPay

## 7.2 Admin routes (`/admin`)

### Account

- `GET /admin/account/login`
- `POST /admin/account/login`
- `GET /admin/account/register`
- `POST /admin/account/register`
- `GET /admin/account/forgot-password`
- `POST /admin/account/forgot-password`
- `GET /admin/account/otp-password`
- `POST /admin/account/otp-password`
- `GET /admin/account/reset-password`
- `POST /admin/account/reset-password`
- `GET /admin/account/register-initial`
- `POST /admin/account/logout`

### Dashboard

- `GET /admin/dashboard`
- `POST /admin/dashboard/revenue-chart`

### Category

- `GET /admin/category/list`
- `GET /admin/category/create`
- `POST /admin/category/create`
- `GET /admin/category/edit/:id`
- `PATCH /admin/category/edit/:id`
- `PATCH /admin/category/delete/:id`
- `PATCH /admin/category/change-multi`

### Tour

- `GET /admin/tour/list`
- `GET /admin/tour/create`
- `POST /admin/tour/create`
- `GET /admin/tour/trash`
- `GET /admin/tour/edit/:id`
- `PATCH /admin/tour/edit/:id`
- `PATCH /admin/tour/delete/:id`
- `PATCH /admin/tour/undo/:id`
- `PATCH /admin/tour/delete-destroy/:id`
- `PATCH /admin/tour/trash/change-multi`
- `PATCH /admin/tour/change-multi`

### Order

- `GET /admin/order/list`
- `GET /admin/order/edit/:id`
- `PATCH /admin/order/edit/:id`

### Contact

- `GET /admin/contact/list`
- `PATCH /admin/contact/delete/:id`
- `PATCH /admin/contact/change-multi`

### Setting

- `GET /admin/setting/list`
- `GET /admin/setting/website-info`
- `PATCH /admin/setting/website-info`
- `GET /admin/setting/account-admin/list`
- `GET /admin/setting/account-admin/create`
- `POST /admin/setting/account-admin/create`
- `GET /admin/setting/account-admin/edit/:id`
- `PATCH /admin/setting/account-admin/edit/:id`
- `PATCH /admin/setting/account-admin/change-multi`
- `GET /admin/setting/role/list`
- `GET /admin/setting/role/create`
- `POST /admin/setting/role/create`
- `GET /admin/setting/role/edit/:id`
- `PATCH /admin/setting/role/edit/:id`
- `PATCH /admin/setting/role/delete/:id`
- `PATCH /admin/setting/role/change-multi`

### Profile / Upload / User

- `GET /admin/profile/edit`
- `PATCH /admin/profile/edit`
- `GET /admin/profile/change-password`
- `PATCH /admin/profile/change-password`
- `POST /admin/upload/image`
- `GET /admin/user/list`

## 8. Data models chính

- `AccountAdmin`: thông tin admin, trạng thái, role, avatar
- `Role`: nhóm quyền + danh sách permissions
- `Category`: danh mục tour phân cấp cha-con, có slug
- `Tour`: thông tin tour, giá, tồn chỗ, lịch trình, ảnh, slug
- `Order`: đơn hàng gồm thông tin khách và danh sách item
- `Contact`: email đăng ký liên hệ
- `ForgotPassword`: OTP quên mật khẩu (có TTL qua `expireAt`)
- `SettingWebsiteInfo`: thông tin website hiển thị toàn cục
- `City`: danh sách thành phố

## 9. Middleware quan trọng

- `middlewares/admin/auth.middleware.js`
  - Verify JWT từ cookie `token`
  - Nạp `req.account`, `req.permissions`, `res.locals.account`
- `middlewares/client/setting.middleware.js`
  - Nạp thông tin website vào `res.locals.settingWebsiteInfo`
- `middlewares/client/category.middleware.js`
  - Nạp cây danh mục vào `res.locals.categoryList`

## 10. Lưu ý khi phát triển/triển khai

- Session đang để `maxAge: 60000` (60 giây) trong `index.js`, cần chỉnh lại cho production.
- `express-session secret` đang hardcode trong mã nguồn, nên đưa vào `.env`.
- Chưa có bộ test tự động.
- Một số logic trang chủ đang dùng cứng ID danh mục trong controller client (`home.controller.js`), cần cập nhật khi thay seed dữ liệu.
- Cần đảm bảo webhook/callback payment có thể truy cập từ internet khi chạy thực tế.

## 11. Gợi ý seed dữ liệu tối thiểu để chạy demo

- Tạo `Role` có permissions đầy đủ
- Tạo 1 `AccountAdmin` trạng thái `active` và gán role
- Tạo dữ liệu `City`
- Tạo dữ liệu `Category` (có parent nếu cần)
- Tạo vài `Tour` thuộc category active
- Tạo bản ghi `SettingWebsiteInfo`

---