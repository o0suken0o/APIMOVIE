
document.addEventListener("DOMContentLoaded", async () => {
    const movieGrid = document.getElementById("movie-grid");

    // Hàm hiển thị phim
    function renderMovies(data) {
        movieGrid.innerHTML = "";
        data.forEach(movie => {
            const card = document.createElement("div");
            card.classList.add("movie-card");
            card.dataset.id = movie.id;
            card.innerHTML = `
                <img class="anh" src="${movie.thumbnailUrl}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p>${movie.genre} - ${movie.duration} phút</p>
            `;
            card.addEventListener("click", () => {
                watchMovie(movie.id);
            });
            movieGrid.appendChild(card);
        });
    }

    // Hàm xem phim (và lưu lịch sử)
    function watchMovie(movieId) {
        const userName = localStorage.getItem("username"); // Lấy đúng key
        //if (!userName) {
        //    alert("⚠️ Bạn phải đăng nhập để lưu lịch sử!");
        //    window.location.href = "login.html"; // hoặc chỉ cho xem phim mà không lưu lịch sử
        //    return;
        //}

        fetch(`https://localhost:7019/api/History/add?movieId=${movieId}&userName=${userName}`, {
            method: "POST"
        })
            .then(res => res.json())
            .then(data => {
                console.log("Lưu lịch sử:", data.message);
                window.location.href = `xemphim.html?id=${movieId}`;
            })
            .catch(err => {
                console.error("Lỗi lưu lịch sử:", err);
                window.location.href = `xemphim.html?id=${movieId}`;
            });
    }


    // 1️⃣ Lấy danh sách phim ban đầu
    try {
        const res = await fetch("https://localhost:7019/api/movies");
        if (!res.ok) throw new Error("Không thể lấy dữ liệu phim!");
        const data = await res.json();
        const activeMovies = data.filter(movie => movie.isActive === true);
        console.log("Dữ liệu phim:", activeMovies);
        renderMovies(activeMovies);
    } catch (err) {
        console.error(err);
        movieGrid.innerHTML = `<p style="color:red;">Không tải được danh sách phim.</p>`;
    }

    // 2️⃣ Xử lý khi bấm vào thể loại
    document.querySelectorAll('.cat-grid a').forEach(button => {
        button.addEventListener('click', async e => {
            e.preventDefault();
            const datacat = button.dataset.cat;
            console.log("Thể loại chọn:", datacat);

            const res = await fetch("https://localhost:7019/api/movies");
            const data = await res.json();

            const filtered = data.filter(movie => movie.genre === datacat);
            renderMovies(filtered);
        });
    });
});