
// =====================
// XỬ LÝ FORM ĐĂNG KÝ
// =====================
document.getElementById('register-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        userName: document.getElementById('username').value,
        email: document.getElementById('email').value,
        passWord: document.getElementById('password').value,
    };

    const response = await fetch('https://localhost:7019/api/dangky', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('result').innerText = "✅ " + result.message;
        window.location.href = "login.html";
    } else {
        document.getElementById('result').innerText = "❌ " + (result.message || "Đăng ký thất bại!");
    }
});


document.getElementById('login-form')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        Email: document.getElementById('login-email').value,
        PassWord: document.getElementById('login-password').value
    };

    try {
        const response = await fetch('https://localhost:7019/api/dangnhap', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            // Kiểm tra IsActive
            if (!result.isActive) {
                alert("⚠️ Tài khoản của bạn đã bị khóa!");
                return;
            }

            // Lưu tên người dùng và role
            localStorage.setItem("username", result.userName || data.Email);
            localStorage.setItem("role", result.role);

            // Điều hướng theo quyền
            if (result.role === "Admin") {
                window.location.href = "indexadmin.html";
            } else {
                window.location.href = "index.html";
            }
        } else {
            alert(result.message || "Đăng nhập thất bại!");
        }
    } catch (err) {
        console.error(err);
        alert("Đã xảy ra lỗi khi đăng nhập!");
    }
});



// =====================
// HIỂN THỊ TÊN NGƯỜI DÙNG + NÚT ADMIN
// =====================

document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("username");
    const userRole = localStorage.getItem("role"); // 👉 Lấy vai trò (Admin/User)
    const loginButton = document.querySelector(".btn-login");
    const logoutButton = document.querySelector(".btn-logout");
    const nutadmin = document.getElementById("btnadmin");

    if (userName && loginButton) {
        // 🔹 Hiển thị tên người dùng
        loginButton.textContent = userName;
        loginButton.href = "#";

        // 🔹 Hiển thị nút đăng xuất
        if (logoutButton) {
            logoutButton.style.display = "inline-block";
            logoutButton.onclick = () => {
                if (confirm("Bạn có muốn đăng xuất không?")) {
                    localStorage.removeItem("username");
                    localStorage.removeItem("role");
                    window.location.reload();
                }
            };
        }

        // 🔹 Nếu là admin → hiện nút admin
        if (userRole === "Admin" && nutadmin) {
            nutadmin.style.display = "inline-block";
        } else if (nutadmin) {
            nutadmin.style.display = "none";
        }

    } else {
        // 🔹 Nếu chưa đăng nhập → ẩn các nút
        if (logoutButton) logoutButton.style.display = "none";
        if (nutadmin) nutadmin.style.display = "none";
    }
});



// =====================
// FORM THÊM PHIM (DÙNG CHO ADMIN)
// =====================
document.getElementById('movieForm')?.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        Title: document.getElementById('Title').value,
        Description: document.getElementById('Description').value,
        Genre: document.getElementById('Genre').value,
        Director: document.getElementById('Director').value,
        Actors: document.getElementById('Actors').value,
        ReleaseDate: document.getElementById('ReleaseDate').value,
        Duration: document.getElementById('Duration').value,
        Language: document.getElementById('Language').value,
        ThumbnailUrl: document.getElementById('ThumbnailUrl').value,
        VideoUrl: document.getElementById('VideoUrl').value,
        Rating: document.getElementById('Rating').value,
        IsActive: document.getElementById('IsActive').checked,
        Country: document.getElementById('Country').value,
        AgeRating: document.getElementById('AgeRating').value
    };

    try {
        const res = await fetch('https://localhost:7019/api/movies/them', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('❌ Lỗi từ server:', text);
            alert("Lỗi: không thể thêm phim! Kiểm tra lại thông tin nhập.");
            return;
        }

        const result = await res.json();
        alert(result?.message || 'Thêm phim thành công!');

        document.getElementById('movieForm').reset(); // reset form
        loadMovies(); // reload danh sách phim ngay
    } catch (error) {
        console.error('🚨 Lỗi khi gửi request:', error);
        alert('Không thể kết nối tới server.');
    }
});

