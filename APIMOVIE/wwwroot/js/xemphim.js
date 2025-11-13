document.addEventListener("DOMContentLoaded", () => {
    // Lấy movieId từ URL
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");
    if (!movieId) return;

    // Lấy các phần tử HTML
    const poster = document.querySelector(".poster");
    const titleEl = document.querySelector(".movie-info h1");
    const genreEl = document.querySelector(".meta .badge.blue");
    const countryEl = document.querySelector(".meta .badge.purple");
    const durationEl = document.querySelector(".meta .badge.yellow");
    const statusEl = document.querySelector(".meta .badge.green");
    const ratingEl = document.querySelector(".meta .badge.black");
    const descriptionEl = document.querySelector(".description");
    const watchBtn = document.querySelector(".buttons a");

    // Gọi API lấy thông tin phim
    fetch(`https://localhost:7019/api/Movies/${movieId}`)
        .then(res => res.json())
        .then(movie => {
            console.log("Movie fetched:", movie);

            // Gán dữ liệu vào HTML
            if (poster && movie.thumbnailUrl) poster.src = movie.thumbnailUrl;
            if (titleEl) titleEl.textContent = movie.title || "Chưa có tên";
            if (genreEl) genreEl.textContent = movie.genre || "Không xác định";
            if (countryEl) countryEl.textContent = movie.country || "Không xác định";
            if (durationEl) durationEl.textContent = movie.duration ? movie.duration + " phút" : "Chưa có";
            if (statusEl) statusEl.textContent = movie.status || "Chưa cập nhật";
            if (ratingEl) ratingEl.textContent = movie.rating ? "*" + movie.rating + "/10" : "Chưa có";
            if (descriptionEl) descriptionEl.textContent = movie.description || "Chưa có nội dung";

            // Gán link cho nút xem phim
            if (watchBtn && movie.videoUrl) watchBtn.href = movie.videoUrl;
        })
        .catch(err => console.error("Lỗi fetch movie:", err));
});
