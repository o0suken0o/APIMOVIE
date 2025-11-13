document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    fetch(`https://localhost:7019/api/History/list?userName=${username}`)
        .then(res => res.json())
        .then(history => {
            const list = document.getElementById("history-list");
            list.innerHTML = "";

            if (role !== "User" && role !== "Admin") {
                list.innerHTML = "<p>Bạn phải đăng nhập mới có lịch sử xem phim.</p>";
                return;
            }

            if (!history || history.length === 0) {
                list.innerHTML = "<p>Chưa có lịch sử xem phim.</p>";
                return;
            }

            history.forEach(item => {
                const div = document.createElement("div");
                div.className = "history-item";
                div.innerHTML = `
                    <a href="xemphim.html?id=${item.movieId}" class="history-link">
                        <img src="${item.posterUrl}" alt="${item.movieTitle}">
                        <div>
                            <h4>${item.movieTitle}</h4>
                            <small>Xem lúc: ${new Date(item.watchedAt).toLocaleString()}</small>
                        </div>
                    </a>
                    <button class="delete-btn" data-id="${item.movieId}">🗑️ Xóa</button>
                `;
                list.appendChild(div);
            });

            // Gắn sự kiện XÓA cho từng nút
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const movieId = e.target.getAttribute("data-id");
                    if (!confirm("Bạn có chắc muốn xóa lịch sử này không?")) return;

                    try {
                        const res = await fetch(`https://localhost:7019/api/History/delete?userName=${username}&movieId=${movieId}`, {
                            method: "DELETE"
                        });
                        const result = await res.json();
                        alert(result.message || "Đã xóa!");
                        location.reload(); // tải lại danh sách lịch sử
                    } catch (err) {
                        console.error(err);
                        alert("Không thể xóa lịch sử.");
                    }
                });
            });
        })
        .catch(err => {
            console.error("Lỗi khi tải lịch sử:", err);
            document.getElementById("history-list").innerHTML = "<p>Không thể tải lịch sử xem phim.</p>";
        });
});
