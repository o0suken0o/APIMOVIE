document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("userForm");
    const tableBody = document.getElementById("usersTableBody");
    let users = [];

    // 🔹 Load danh sách user
    async function renderUsers() {
        try {
            const res = await fetch("https://localhost:7019/api/User");
            if (!res.ok) throw new Error("Không thể lấy danh sách user");
            users = await res.json();

            tableBody.innerHTML = "";
            users.forEach(u => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${u.id}</td>
                    <td>${u.userName}</td>
                    <td>${u.email}</td>
                    <td>${u.role}</td>
                    <td>${u.isActive ? "✔️" : "❌"}</td>
                    <td>
                        <button class="btn small" onclick="editUser(${u.id})">Sửa</button>
                        <button class="btn small danger" onclick="deleteUser(${u.id})">Xóa</button>
                    </td>`;
                tableBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `<tr><td colspan="6" style="color:red;">Lỗi tải user</td></tr>`;
        }
    }

    // 🔹 Thêm user
    form.addEventListener("submit", async e => {
        e.preventDefault();
        const newUser = {
            userName: form.Username.value,
            passWord: form.Password.value,
            email: form.Email.value,
            role: form.Role.value,
            isActive: form.IsActive.checked
        };
        try {
            const res = await fetch("https://localhost:7019/api/User", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            if (!res.ok) throw new Error("Không thể thêm user");
            alert("✅ Đã thêm user");
            form.reset();
            renderUsers();
        } catch (err) {
            console.error(err);
            alert("❌ Thêm user thất bại");
        }
    });

    // 🔹 Sửa user
    window.editUser = (id) => {
        const user = users.find(u => u.id === id);
        if (!user) return alert("Không tìm thấy user");

        document.getElementById("editUserId").value = user.id;
        document.getElementById("editUsername").value = user.userName;
        document.getElementById("editPassword").value = user.passWord;
        document.getElementById("editEmail").value = user.email;
        document.getElementById("editRole").value = user.role;
        document.getElementById("editIsActive").checked = user.isActive;
        document.getElementById("editUserModal").style.display = "block";
    };

    document.getElementById("saveEditUserBtn").addEventListener("click", async () => {
        const id = parseInt(document.getElementById("editUserId").value);
        console.log("Editing user with ID:", users);
        const updatedUser = {
            userName: document.getElementById("editUsername").value,
            passWord: document.getElementById("editPassword").value,
            email: document.getElementById("editEmail").value,
            role: document.getElementById("editRole").value,
            isActive: document.getElementById("editIsActive").checked
        };

        try {
            const res = await fetch(`https://localhost:7019/api/User/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedUser)
            });
            if (!res.ok) throw new Error("Cập nhật thất bại");
            alert("✅ Cập nhật thành công");
            document.getElementById("editUserModal").style.display = "none";
            renderUsers();
        } catch (err) {
            console.error(err);
            alert("❌ Không thể cập nhật user");
        }
    });

    // 🔹 Xóa user
    window.deleteUser = async (id) => {
        if (!confirm("Bạn có chắc muốn xóa user này?")) return;
        try {
            const res = await fetch(`https://localhost:7019/api/User/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Xóa thất bại");
            alert("🗑️ Đã xóa user");
            renderUsers();
        } catch (err) {
            console.error(err);
            alert("❌ Không thể xóa user");
        }
    };

    renderUsers();
});
