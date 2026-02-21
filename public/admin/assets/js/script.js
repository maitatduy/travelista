// Menu Mobile
const buttonMenuMobile = document.querySelector(".header .inner-button-menu");
if (buttonMenuMobile) {
    const sider = document.querySelector(".sider");
    const siderOverlay = document.querySelector(".sider-overlay");

    buttonMenuMobile.addEventListener("click", () => {
        sider.classList.add("active");
        siderOverlay.classList.add("active");
    });

    siderOverlay.addEventListener("click", () => {
        sider.classList.remove("active");
        siderOverlay.classList.remove("active");
    });
}
// End Menu Mobile

// Schedule Section 8
const scheduleSection8 = document.querySelector(".section-8 .inner-schedule");
if (scheduleSection8) {
    const buttonCreate = scheduleSection8.querySelector(
        ".inner-schedule-create",
    );
    const listItem = scheduleSection8.querySelector(".inner-schedule-list");

    // Tạo mới
    if (buttonCreate) {
        buttonCreate.addEventListener("click", () => {
            const firstItem = listItem.querySelector(".inner-schedule-item");
            const cloneItem = firstItem.cloneNode(true);
            cloneItem.querySelector(".inner-schedule-head input").value = "";

            const body = cloneItem.querySelector(".inner-schedule-body");
            const id = `mce_${Date.now()}`;
            body.innerHTML = `<textarea textarea-mce id="${id}"></textarea>`;

            listItem.appendChild(cloneItem);

            initTinyMCE(`#${id}`);
        });
    }

    listItem.addEventListener("click", (event) => {
        // Đóng/mở item
        if (event.target.closest(".inner-more")) {
            const parentItem = event.target.closest(".inner-schedule-item");
            if (parentItem) {
                parentItem.classList.toggle("hidden");
            }
        }

        // Xóa item
        if (event.target.closest(".inner-remove")) {
            const parentItem = event.target.closest(".inner-schedule-item");
            const totalItem = listItem.querySelectorAll(
                ".inner-schedule-item",
            ).length;
            if (parentItem && totalItem > 1) {
                parentItem.remove();
            }
        }
    });

    // Sắp xếp
    new Sortable(listItem, {
        animation: 150, // Thêm hiệu ứng mượt mà
        handle: ".inner-move", // Chỉ cho phép kéo bằng class .inner-move
        onStart: (event) => {
            const textarea = event.item.querySelector("[textarea-mce]");
            const id = textarea.id;
            tinymce.get(id).remove();
        },
        onEnd: (event) => {
            const textarea = event.item.querySelector("[textarea-mce]");
            const id = textarea.id;
            initTinyMCE(`#${id}`);
        },
    });
}
// End Schedule Section 8

// Filepond Image
const listFilepondImage = document.querySelectorAll("[filepond-image]");
let filePond = {};
if (listFilepondImage.length > 0) {
    listFilepondImage.forEach((filepondImage) => {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateType);

        let files = null;
        const elementImageDefault = filepondImage.closest("[image-default]");
        if (elementImageDefault) {
            const imageDefault =
                elementImageDefault.getAttribute("image-default");
            if (imageDefault) {
                files = [
                    {
                        source: imageDefault, // Đường dẫn ảnh
                    },
                ];
            }
        }

        filePond[filepondImage.name] = FilePond.create(filepondImage, {
            labelIdle: "+",
            files: files,
        });
    });
}

// End Filepond Image

// Biểu đồ doanh thu
const revenueChart = document.querySelector("#revenue-chart");
if (revenueChart) {
    new Chart(revenueChart, {
        type: "line",
        data: {
            labels: ["01", "02", "03", "04", "05"],
            datasets: [
                {
                    label: "Tháng 04/2025", // Nhãn của dataset
                    data: [1200000, 1800000, 3200000, 900000, 1600000], // Dữ liệu
                    borderColor: "#4379EE", // Màu viền
                    borderWidth: 1.5, // Độ dày của đường
                },
                {
                    label: "Tháng 03/2025", // Nhãn của dataset
                    data: [1000000, 900000, 1200000, 1200000, 1400000], // Dữ liệu
                    borderColor: "#EF3826", // Màu viền
                    borderWidth: 1.5, // Độ dày của đường
                },
            ],
        },
        options: {
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Ngày",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Doanh thu (VND)",
                    },
                },
            },
            maintainAspectRatio: false, // Không giữ tỷ lệ khung hình mặc định
        },
    });
}
// Hết Biểu đồ doanh thu

// Category Create Form
const categoryCreateForm = document.querySelector("#category-create-form");
if (categoryCreateForm) {
    const validation = new JustValidate("#category-create-form");

    validation
        .addField("#name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên danh mục!",
            },
        ])
        .onSuccess((event) => {
            const name = event.target.name.value;
            const parent = event.target.parent.value;
            const position = event.target.position.value;
            const status = event.target.status.value;
            let avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
            }
            const description = tinymce.get("description").getContent();
            const formData = new FormData();

            formData.append("name", name);
            formData.append("parent", parent);
            formData.append("position", position);
            formData.append("status", status);
            formData.append("avatar", avatar);
            formData.append("description", description);

            fetch(`/${pathAdmin}/category/create`, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code === "error") {
                        alert(data.message);
                    }

                    if (data.code === "success") {
                        window.location.href = `/${pathAdmin}/category/list`;
                    }
                });
        });
}
// End Category Create Form

// Category Edit Form
const categoryEditForm = document.querySelector("#category-edit-form");
if (categoryEditForm) {
    const validation = new JustValidate("#category-edit-form");

    validation
        .addField("#name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên danh mục!",
            },
        ])
        .onSuccess((event) => {
            const id = event.target.id.value;
            const name = event.target.name.value;
            const parent = event.target.parent.value;
            const position = event.target.position.value;
            const status = event.target.status.value;
            const avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
                const elementImageDefault =
                    event.target.avatar.closest("[image-default]");
                const imageDefault =
                    elementImageDefault.getAttribute("image-default");
                if (imageDefault.includes(avatar.name)) {
                    avatar = null;
                }
            }
            const description = tinymce.get("description").getContent();

            // Tạo FormData
            const formData = new FormData();
            formData.append("name", name);
            formData.append("parent", parent);
            formData.append("position", position);
            formData.append("status", status);
            formData.append("avatar", avatar);
            formData.append("description", description);

            fetch(`/${pathAdmin}/category/edit/${id}`, {
                method: "PATCH",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Category Edit Form

// Tour Create Form
const tourCreateForm = document.querySelector("#tour-create-form");
if (tourCreateForm) {
    const validation = new JustValidate("#tour-create-form");

    validation
        .addField("#name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên tour!",
            },
        ])
        .onSuccess((event) => {
            const name = event.target.name.value;
            const category = event.target.category.value;
            const position = event.target.position.value;
            const status = event.target.status.value;
            const avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
            }
            const priceAdult = event.target.priceAdult.value;
            const priceChildren = event.target.priceChildren.value;
            const priceBaby = event.target.priceBaby.value;
            const priceNewAdult = event.target.priceNewAdult.value;
            const priceNewChildren = event.target.priceNewChildren.value;
            const priceNewBaby = event.target.priceNewBaby.value;
            const stockAdult = event.target.stockAdult.value;
            const stockChildren = event.target.stockChildren.value;
            const stockBaby = event.target.stockBaby.value;
            const locations = [];
            const time = event.target.time.value;
            const vehicle = event.target.vehicle.value;
            const departureDate = event.target.departureDate.value;
            const information = tinymce.get("information").getContent();
            const schedules = [];

            // Locations
            const listElementLocation = tourCreateForm.querySelectorAll(
                'input[name="locations"]:checked',
            );
            listElementLocation.forEach((input) => {
                locations.push(input.value);
            });
            // End Locations

            // Schedules
            const listElementScheduleItem = tourCreateForm.querySelectorAll(
                ".inner-schedule-item",
            );
            listElementScheduleItem.forEach((scheduleItem) => {
                const input = scheduleItem.querySelector("input");
                const title = input.value;

                const textarea = scheduleItem.querySelector("textarea");
                const idTextarea = textarea.id;
                const description = tinymce.get(idTextarea).getContent();

                schedules.push({
                    title: title,
                    description: description,
                });
            });
            // End Schedules

            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("position", position);
            formData.append("status", status);
            formData.append("time", time);
            formData.append("vehicle", vehicle);
            formData.append("departureDate", departureDate);
            formData.append("information", information);

            formData.append("avatar", avatar);

            formData.append("priceAdult", priceAdult);
            formData.append("priceChildren", priceChildren);
            formData.append("priceBaby", priceBaby);

            formData.append("priceNewAdult", priceNewAdult);
            formData.append("priceNewChildren", priceNewChildren);
            formData.append("priceNewBaby", priceNewBaby);

            formData.append("stockAdult", stockAdult);
            formData.append("stockChildren", stockChildren);
            formData.append("stockBaby", stockBaby);

            formData.append("locations", JSON.stringify(locations));
            formData.append("schedules", JSON.stringify(schedules));

            // Images
            if (filePondMulti.images.getFiles().length > 0) {
                filePondMulti.images.getFiles().forEach((item) => {
                    formData.append("images", item.file);
                });
            }
            // End Images

            fetch(`/${pathAdmin}/tour/create`, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code === "error") {
                        alert(data.message);
                    }

                    if (data.code === "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Tour Create Form

// Tour Edit Form
const tourEditForm = document.querySelector("#tour-edit-form");
if (tourEditForm) {
    const validation = new JustValidate("#tour-edit-form");

    validation
        .addField("#name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên tour!",
            },
        ])
        .onSuccess((event) => {
            const id = event.target.id.value;
            const name = event.target.name.value;
            const category = event.target.category.value;
            const position = event.target.position.value;
            const status = event.target.status.value;
            const avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
                const elementImageDefault =
                    event.target.avatar.closest("[image-default]");
                const imageDefault =
                    elementImageDefault.getAttribute("image-default");
                if (imageDefault.includes(avatar.name)) {
                    avatar = null;
                }
            }
            const priceAdult = event.target.priceAdult.value;
            const priceChildren = event.target.priceChildren.value;
            const priceBaby = event.target.priceBaby.value;
            const priceNewAdult = event.target.priceNewAdult.value;
            const priceNewChildren = event.target.priceNewChildren.value;
            const priceNewBaby = event.target.priceNewBaby.value;
            const stockAdult = event.target.stockAdult.value;
            const stockChildren = event.target.stockChildren.value;
            const stockBaby = event.target.stockBaby.value;
            const locations = [];
            const time = event.target.time.value;
            const vehicle = event.target.vehicle.value;
            const departureDate = event.target.departureDate.value;
            const information = tinymce.get("information").getContent();
            const schedules = [];

            const listElementLocation = tourEditForm.querySelectorAll(
                'input[name="locations"]:checked',
            );
            listElementLocation.forEach((input) => {
                locations.push(input.value);
            });

            const listElementScheduleItem = tourEditForm.querySelectorAll(
                ".inner-schedule-item",
            );
            listElementScheduleItem.forEach((scheduleItem) => {
                const input = scheduleItem.querySelector("input");
                const title = input.value;

                const textarea = scheduleItem.querySelector("textarea");
                const idTextarea = textarea.id;
                const description = tinymce.get(idTextarea).getContent();

                schedules.push({
                    title: title,
                    description: description,
                });
            });

            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("position", position);
            formData.append("status", status);
            formData.append("avatar", avatar);
            formData.append("priceAdult", priceAdult);
            formData.append("priceChildren", priceChildren);
            formData.append("priceBaby", priceBaby);
            formData.append("priceNewAdult", priceNewAdult);
            formData.append("priceNewChildren", priceNewChildren);
            formData.append("priceNewBaby", priceNewBaby);
            formData.append("stockAdult", stockAdult);
            formData.append("stockChildren", stockChildren);
            formData.append("stockBaby", stockBaby);
            formData.append("locations", JSON.stringify(locations));
            formData.append("time", time);
            formData.append("vehicle", vehicle);
            formData.append("departureDate", departureDate);
            formData.append("information", information);
            formData.append("schedules", JSON.stringify(schedules));
            // Images
            if (filePondMulti.images.getFiles().length > 0) {
                filePondMulti.images.getFiles().forEach((item) => {
                    formData.append("images", item.file);
                });
            }
            // End Images

            fetch(`/${pathAdmin}/tour/edit/${id}`, {
                method: "PATCH",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Tour Edit Form

// Order Edit Form
const orderEditForm = document.querySelector("#order-edit-form");
if (orderEditForm) {
    const validation = new JustValidate("#order-edit-form");

    validation
        .addField("#fullName", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập họ tên!",
            },
            {
                rule: "minLength",
                value: 5,
                errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
            },
            {
                rule: "maxLength",
                value: 50,
                errorMessage: "Họ tên không được vượt quá 50 ký tự!",
            },
        ])
        .addField("#phone", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập số điện thoại!",
            },
            {
                rule: "customRegexp",
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                errorMessage: "Số điện thoại không đúng định dạng!",
            },
        ])
        .onSuccess((event) => {
            const fullName = event.target.fullName.value;
            const phone = event.target.phone.value;
            const note = event.target.note.value;
            const paymentMethod = event.target.paymentMethod.value;
            const paymentStatus = event.target.paymentStatus.value;
            const status = event.target.status.value;

            console.log(fullName);
            console.log(phone);
            console.log(note);
            console.log(paymentMethod);
            console.log(paymentStatus);
            console.log(status);
        });
}
// End Order Edit Form

// Setting Website Info Form
const settingWebsiteInfoForm = document.querySelector(
    "#setting-website-info-form",
);
if (settingWebsiteInfoForm) {
    const validation = new JustValidate("#setting-website-info-form");

    validation
        .addField("#websiteName", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên website!",
            },
        ])
        .addField("#email", [
            {
                rule: "email",
                errorMessage: "Email không đúng định dạng!",
            },
        ])
        .onSuccess((event) => {
            const websiteName = event.target.websiteName.value;
            const phone = event.target.phone.value;
            const email = event.target.email.value;
            const address = event.target.address.value;
            const logos = filePond.logo.getFiles();
            let logo = null;
            if (logos.length > 0) {
                logo = logos[0].file;
                const elementImageDefault =
                    event.target.logo.closest("[image-default]");
                const imageDefault =
                    elementImageDefault.getAttribute("image-default");
                if (imageDefault.includes(logo.name)) {
                    logo = null;
                }
            }
            const favicons = filePond.favicon.getFiles();
            let favicon = null;
            if (favicons.length > 0) {
                favicon = favicons[0].file;
                const elementImageDefault =
                    event.target.favicon.closest("[image-default]");
                const imageDefault =
                    elementImageDefault.getAttribute("image-default");
                if (imageDefault.includes(favicon.name)) {
                    favicon = null;
                }
            }

            const formData = new FormData();
            formData.append("websiteName", websiteName);
            formData.append("phone", phone);
            formData.append("email", email);
            formData.append("address", address);
            formData.append("logo", logo);
            formData.append("favicon", favicon);

            fetch(`/${pathAdmin}/setting/website-info`, {
                method: "PATCH",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code === "error") {
                        alert(data.message);
                    }
                    if (data.code === "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Setting Website Info Form

// Setting Account Admin Create Form
const settingAccountAdminCreateForm = document.querySelector(
    "#setting-account-admin-create-form",
);
if (settingAccountAdminCreateForm) {
    const validation = new JustValidate("#setting-account-admin-create-form");

    validation
        .addField("#fullName", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập họ tên!",
            },
            {
                rule: "minLength",
                value: 5,
                errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
            },
            {
                rule: "maxLength",
                value: 50,
                errorMessage: "Họ tên không được vượt quá 50 ký tự!",
            },
        ])
        .addField("#email", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập email!",
            },
            {
                rule: "email",
                errorMessage: "Email không đúng định dạng!",
            },
        ])
        .addField("#phone", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập số điện thoại!",
            },
            {
                rule: "customRegexp",
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                errorMessage: "Số điện thoại không đúng định dạng!",
            },
        ])
        .addField("#positionCompany", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập chức vụ!",
            },
        ])
        .addField("#password", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập mật khẩu!",
            },
            {
                validator: (value) => value.length >= 8,
                errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
            },
            {
                validator: (value) => /[A-Z]/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
            },
            {
                validator: (value) => /[a-z]/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
            },
            {
                validator: (value) => /\d/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
            },
            {
                validator: (value) => /[@$!%*?&]/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
            },
        ])
        .onSuccess((event) => {
            const fullName = event.target.fullName.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;
            const role = event.target.role.value;
            const positionCompany = event.target.positionCompany.value;
            const status = event.target.status.value;
            const password = event.target.password.value;
            const avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
            }

            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("role", role);
            formData.append("positionCompany", positionCompany);
            formData.append("status", status);
            formData.append("password", password);
            formData.append("avatar", avatar);

            fetch(`/${pathAdmin}/setting/account-admin/create`, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.href = `/${pathAdmin}/setting/account-admin/list`;
                    }
                });
        });
}
// End Setting Account Admin Create Form

// Setting Account Admin Edit Form
const settingAccountAdminEditForm = document.querySelector(
    "#setting-account-admin-edit-form",
);
if (settingAccountAdminEditForm) {
    const validation = new JustValidate("#setting-account-admin-edit-form");

    validation
        .addField("#fullName", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập họ tên!",
            },
            {
                rule: "minLength",
                value: 5,
                errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
            },
            {
                rule: "maxLength",
                value: 50,
                errorMessage: "Họ tên không được vượt quá 50 ký tự!",
            },
        ])
        .addField("#email", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập email!",
            },
            {
                rule: "email",
                errorMessage: "Email không đúng định dạng!",
            },
        ])
        .addField("#phone", [
            {
                rule: "customRegexp",
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                errorMessage: "Số điện thoại không đúng định dạng!",
            },
        ])
        .addField("#positionCompany", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập chức vụ!",
            },
        ])
        .addField("#password", [
            {
                validator: (value) => (value ? value.length >= 8 : true),
                errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
            },
            {
                validator: (value) => (value ? /[A-Z]/.test(value) : true),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
            },
            {
                validator: (value) => (value ? /[a-z]/.test(value) : true),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
            },
            {
                validator: (value) => (value ? /\d/.test(value) : true),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
            },
            {
                validator: (value) => (value ? /[@$!%*?&]/.test(value) : true),
                errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
            },
        ])
        .onSuccess((event) => {
            const id = event.target.id.value;
            const fullName = event.target.fullName.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;
            const role = event.target.role.value;
            const positionCompany = event.target.positionCompany.value;
            const status = event.target.status.value;
            const password = event.target.password.value;
            const avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
                const elementImageDefault =
                    event.target.avatar.closest("[image-default]");
                const imageDefault =
                    elementImageDefault.getAttribute("image-default");
                if (imageDefault.includes(avatar.name)) {
                    avatar = null;
                }
            }

            // Tạo FormData
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("role", role);
            formData.append("positionCompany", positionCompany);
            formData.append("status", status);
            if (password) {
                formData.append("password", password);
            }
            formData.append("avatar", avatar);

            fetch(`/${pathAdmin}/setting/account-admin/edit/${id}`, {
                method: "PATCH",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Setting Account Admin Edit Form

// Setting Role Create Form
const settingRoleCreateForm = document.querySelector(
    "#setting-role-create-form",
);
if (settingRoleCreateForm) {
    const validation = new JustValidate("#setting-role-create-form");

    validation
        .addField("#name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên nhóm quyền!",
            },
        ])
        .onSuccess((event) => {
            const name = event.target.name.value;
            const description = event.target.description.value;
            const permissions = [];

            // permissions
            const listElementPermission =
                settingRoleCreateForm.querySelectorAll(
                    'input[name="permissions"]:checked',
                );
            listElementPermission.forEach((input) => {
                permissions.push(input.value);
            });
            // End permissions

            const data = {
                name: name,
                description: description,
                permissions: permissions,
            };

            fetch(`/${pathAdmin}/setting/role/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.href = `/${pathAdmin}/setting/role/list`;
                    }
                });
        });
}
// End Setting Role Create Form

// Profile Edit Form
const profileEditForm = document.querySelector("#profile-edit-form");
if (profileEditForm) {
    const validation = new JustValidate("#profile-edit-form");

    validation
        .addField("#fullName", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập họ tên!",
            },
            {
                rule: "minLength",
                value: 5,
                errorMessage: "Họ tên phải có ít nhất 5 ký tự!",
            },
            {
                rule: "maxLength",
                value: 50,
                errorMessage: "Họ tên không được vượt quá 50 ký tự!",
            },
        ])
        .addField("#email", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập email!",
            },
            {
                rule: "email",
                errorMessage: "Email không đúng định dạng!",
            },
        ])
        .addField("#phone", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập số điện thoại!",
            },
            {
                rule: "customRegexp",
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                errorMessage: "Số điện thoại không đúng định dạng!",
            },
        ])
        .onSuccess((event) => {
            const fullName = event.target.fullName.value;
            const email = event.target.email.value;
            const phone = event.target.phone.value;
            const avatars = filePond.avatar.getFiles();
            let avatar = null;
            if (avatars.length > 0) {
                avatar = avatars[0].file;
                const elementImageDefault =
                    event.target.avatar.closest("[image-default]");
                const imageDefault =
                    elementImageDefault.getAttribute("image-default");
                if (imageDefault.includes(avatar.name)) {
                    avatar = null;
                }
            }

            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("avatar", avatar);

            fetch(`/${pathAdmin}/profile/edit`, {
                method: "PATCH",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Profile Edit Form

// Profile Change Password Form
const profileChangePasswordForm = document.querySelector(
    "#profile-change-password-form",
);
if (profileChangePasswordForm) {
    const validation = new JustValidate("#profile-change-password-form");

    validation
        .addField("#password", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập mật khẩu!",
            },
            {
                validator: (value) => value.length >= 8,
                errorMessage: "Mật khẩu phải chứa ít nhất 8 ký tự!",
            },
            {
                validator: (value) => /[A-Z]/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
            },
            {
                validator: (value) => /[a-z]/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ cái thường!",
            },
            {
                validator: (value) => /\d/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một chữ số!",
            },
            {
                validator: (value) => /[@$!%*?&]/.test(value),
                errorMessage: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
            },
        ])
        .addField("#confirmPassword", [
            {
                rule: "required",
                errorMessage: "Vui lòng xác nhận mật khẩu!",
            },
            {
                validator: (value, fields) => {
                    const password = fields["#password"].elem.value;
                    return value == password;
                },
                errorMessage: "Mật khẩu xác nhận không khớp!",
            },
        ])
        .onSuccess((event) => {
            const password = event.target.password.value;
            const data = {
                password: password,
            };

            fetch(`/${pathAdmin}/profile/change-password`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Profile Change Password Form

// Sider
const sider = document.querySelector(".sider");
if (sider) {
    const pathNameCurrent = window.location.pathname;
    const splitPathNameCurrent = pathNameCurrent.split("/");
    const menuList = sider.querySelectorAll("a");
    menuList.forEach((item) => {
        const href = item.href;
        const pathName = new URL(href).pathname;
        const splitPathName = pathName.split("/");
        if (
            splitPathNameCurrent[1] === splitPathName[1] &&
            splitPathNameCurrent[2] === splitPathName[2]
        ) {
            item.classList.add("active");
        }
    });
}
// End Sider

// Logout
const button = document.querySelector(".inner-logout");
if (button) {
    button.addEventListener("click", () => {
        fetch(`/${pathAdmin}/account/logout`, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.code === "success") {
                    window.location.href = `/${pathAdmin}/account/login`;
                }
            });
    });
}
// End Logout
// Alert
const alertTime = document.querySelector("[alert-time]");
if (alertTime) {
    let time = alertTime.getAttribute("alert-time");
    time = time ? parseInt(time) : 4000;
    setTimeout(() => {
        alertTime.remove(); // Xóa phần tử khỏi giao diện
    }, time);
}
// End Alert
// Delete Category
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
    listButtonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const dataAPI = button.getAttribute("data-api");
            fetch(dataAPI, {
                method: "PATCH",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code === "error") {
                        alert(data.message);
                    }

                    if (data.code === "success") {
                        window.location.reload();
                    }
                });
        });
    });
}
// End Delete Category
// Filter Status
const filterStatus = document.querySelector("[filter-status]");
if (filterStatus) {
    const url = new URL(window.location.href);
    filterStatus.addEventListener("change", () => {
        const value = filterStatus.value;
        if (value) {
            url.searchParams.set("status", value);
        } else {
            url.searchParams.delete("status");
        }
        window.location.href = url.href;
    });
    // Hiển thị lựa chọn mặc định
    const statusCurrent = url.searchParams.get("status");
    if (statusCurrent) {
        filterStatus.value = statusCurrent;
    }
}
// End Filter Status
// Filter Created By
const filterCreatedBy = document.querySelector("[filter-created-by]");
if (filterCreatedBy) {
    const url = new URL(window.location.href);
    filterCreatedBy.addEventListener("change", () => {
        const value = filterCreatedBy.value;
        if (value) {
            url.searchParams.set("createdBy", value);
        } else {
            url.searchParams.delete("createdBy");
        }
        window.location.href = url.href;
    });
    // Hiển thị lựa chọn mặc định
    const createdByCurrent = url.searchParams.get("createdBy");
    if (createdByCurrent) {
        filterCreatedBy.value = createdByCurrent;
    }
}
// End Filter Created By
// Filter Start Date
const filterStartDate = document.querySelector("[filter-start-date]");
if (filterStartDate) {
    const url = new URL(window.location.href);
    filterStartDate.addEventListener("change", () => {
        const value = filterStartDate.value;
        if (value) {
            url.searchParams.set("startDate", value);
        } else {
            url.searchParams.delete("startDate");
        }
        window.location.href = url.href;
    });
    // Hiển thị lựa chọn mặc định
    const startDateCurrent = url.searchParams.get("startDate");
    if (startDateCurrent) {
        filterStartDate.value = startDateCurrent;
    }
}
// End Filter Start Date
// Filter Start Date
const filterEndDate = document.querySelector("[filter-end-date]");
if (filterEndDate) {
    const url = new URL(window.location.href);
    filterEndDate.addEventListener("change", () => {
        const value = filterEndDate.value;
        if (value) {
            url.searchParams.set("endDate", value);
        } else {
            url.searchParams.delete("endDate");
        }
        window.location.href = url.href;
    });
    // Hiển thị lựa chọn mặc định
    const endDateCurrent = url.searchParams.get("endDate");
    if (endDateCurrent) {
        filterEndDate.value = endDateCurrent;
    }
}
// End Filter Start Date
// Filter Category
const filterCategory = document.querySelector("[filter-category]");
if (filterCategory) {
    const url = new URL(window.location.href);
    filterCategory.addEventListener("change", () => {
        const value = filterCategory.value;
        if (value) {
            url.searchParams.set("category", value);
        } else {
            url.searchParams.delete("category");
        }
        window.location.href = url.href;
    });
    // Hiển thị lựa chọn mặc định
    const categoryCurrent = url.searchParams.get("category");
    if (categoryCurrent) {
        filterCategory.value = categoryCurrent;
    }
}
// End Filter Category
// Filter Price
const filterPrice = document.querySelector("[filter-price]");
if (filterPrice) {
    const url = new URL(window.location.href);
    filterPrice.addEventListener("change", () => {
        const value = filterPrice.value;
        if (value) {
            url.searchParams.set("priceRange", value);
        } else {
            url.searchParams.delete("priceRange");
        }
        window.location.href = url.href;
    });
    // Hiển thị lựa chọn mặc định
    const priceCurrent = url.searchParams.get("priceRange");
    if (priceCurrent) {
        filterPrice.value = priceCurrent;
    }
}
// End Filter Price
// Filter Reset
const filterReset = document.querySelector("[filter-reset]");
if (filterReset) {
    const url = new URL(window.location.href);

    filterReset.addEventListener("click", () => {
        url.search = "";
        window.location.href = url.href;
    });
}
// End Filter Reset
// Check All
const checkAll = document.querySelector("[check-all]");
if (checkAll) {
    checkAll.addEventListener("click", () => {
        const listCheckItem = document.querySelectorAll("[check-item]");
        listCheckItem.forEach((item) => {
            item.checked = checkAll.checked;
        });
    });
}
// End Check All
// Change Multi
const changeMulti = document.querySelector("[change-multi]");
if (changeMulti) {
    const select = changeMulti.querySelector("select");
    const button = changeMulti.querySelector("button");
    const dataAPI = changeMulti.getAttribute("data-api");

    button.addEventListener("click", () => {
        const option = select.value;
        const listInputChecked = document.querySelectorAll(
            "[check-item]:checked",
        );

        if (option && listInputChecked) {
            const ids = [];
            listInputChecked.forEach((item) => {
                const id = item.getAttribute("check-item");
                ids.push(id);
            });

            const data = {
                option: option,
                ids: ids,
            };

            fetch(dataAPI, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code === "error") {
                        alert(data.message);
                    }
                    if (data.code === "success") {
                        window.location.reload();
                    }
                });
        }
    });
}
// End Change Multi
// Search
const search = document.querySelector("[search]");
if (search) {
    const url = new URL(window.location.href);

    search.addEventListener("keyup", (event) => {
        if (event.code === "Enter") {
            const value = search.value;
            if (value) {
                url.searchParams.set("keyword", value.trim());
            } else {
                url.searchParams.delete("keyword");
            }
            window.location.href = url.href;
        }
    });

    // Hiển thị lựa chọn mặc định
    const valueCurrent = url.searchParams.get("keyword");
    if (valueCurrent) {
        search.value = valueCurrent;
    }
}
// End Search
// Pagination
const pagination = document.querySelector("[pagination]");
if (pagination) {
    const url = new URL(window.location.href);

    pagination.addEventListener("change", () => {
        const value = pagination.value;
        if (value) {
            url.searchParams.set("page", value);
        } else {
            url.searchParams.delete("page");
        }
        window.location.href = url.href;
    });

    const valueCurrent = url.searchParams.get("page");
    if (valueCurrent) {
        pagination.value = valueCurrent;
    }
}
// End Pagination

// Setting Role Edit Form
const settingRoleEditForm = document.querySelector("#setting-role-edit-form");
if (settingRoleEditForm) {
    const validation = new JustValidate("#setting-role-edit-form");

    validation
        .addField("#name", [
            {
                rule: "required",
                errorMessage: "Vui lòng nhập tên nhóm quyền!",
            },
        ])
        .onSuccess((event) => {
            const id = event.target.id.value;
            const name = event.target.name.value;
            const description = event.target.description.value;
            const permissions = [];

            // permissions
            const listElementPermission = settingRoleEditForm.querySelectorAll(
                'input[name="permissions"]:checked',
            );
            listElementPermission.forEach((input) => {
                permissions.push(input.value);
            });
            // End permissions

            const data = {
                name: name,
                description: description,
                permissions: permissions,
            };

            fetch(`/${pathAdmin}/setting/role/edit/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.code == "error") {
                        alert(data.message);
                    }

                    if (data.code == "success") {
                        window.location.reload();
                    }
                });
        });
}
// End Setting Role Edit Form

// Filepond Image Multi
const listFilepondImageMulti = document.querySelectorAll(
    "[filepond-image-multi]",
);
let filePondMulti = {};
if (listFilepondImageMulti.length > 0) {
    listFilepondImageMulti.forEach((filepondImage) => {
        FilePond.registerPlugin(FilePondPluginImagePreview);
        FilePond.registerPlugin(FilePondPluginFileValidateType);

        let files = null;
        const elementListImageDefault = filepondImage.closest(
            "[list-image-default]",
        );
        if (elementListImageDefault) {
            let listImageDefault =
                elementListImageDefault.getAttribute("list-image-default");
            if (listImageDefault) {
                listImageDefault = JSON.parse(listImageDefault);
                files = [];
                listImageDefault.forEach((image) => {
                    files.push({
                        source: image, // Đường dẫn ảnh
                    });
                });
            }
        }

        filePondMulti[filepondImage.name] = FilePond.create(filepondImage, {
            labelIdle: "+",
            files: files,
        });
    });
}
// End Filepond Image Multi
