const API_BASE = "https://localhost:7019/api/movies";

// ✅ Hàm tải danh sách phim
async function loadMovies() {
    try {
        const res = await fetch(API_BASE, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!res.ok) {
            console.error("Không thể tải danh sách phim:", res.status);
            return;
        }

        const movies = await res.json();
        const tbody = document.getElementById('moviesTableBody');
        tbody.innerHTML = '';

        if (!movies.length) {
            tbody.innerHTML = '<tr><td colspan="15" style="text-align:center;">Chưa có phim nào</td></tr>';
            return;
        }

        movies.forEach(m => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.id}</td>
                <td>${m.title}</td>
                <td>${m.genre || ''}</td>
                <td>${m.director || ''}</td>
                <td>${m.actors || ''}</td>
                <td>${m.releaseDate ? new Date(m.releaseDate).toLocaleDateString() : ''}</td>
                <td>${m.duration || ''}</td>
                <td>${m.language || ''}</td>
                <td>${m.rating ?? ''}</td>
                <td>${m.isActive ? '✅' : '❌'}</td>
                <td>${m.country || ''}</td>
                <td>${m.ageRating || ''}</td>
                <td>${m.createdBy || ''}</td>
                <td>${m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</td>
                <td class="actions-col">
                    <button class="btn small" onclick="editMovie(${m.id})">Sửa</button>
                    <button class="btn small danger" onclick="deleteMovie(${m.id})">Xóa</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error("Lỗi khi tải danh sách phim:", err);
    }
}

// ✅ Hàm xóa phim theo ID
async function deleteMovie(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa phim này?")) return;

    try {
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert("🗑️ Xóa phim thành công!");
            loadMovies(); // load lại danh sách
        } else {
            alert("❌ Xóa phim thất bại!");
        }
    } catch (err) {
        console.error("Lỗi khi xóa phim:", err);
        alert("⚠️ Không thể kết nối tới máy chủ!");
    }
}

// 🔁 Gọi hàm khi trang load xong
document.addEventListener('DOMContentLoaded', loadMovies);
function editMovie(id) {
    fetch(`https://localhost:7019/api/movies/${id}`)
        .then(res => res.json())
        .then(movie => {
            document.getElementById('editId').value = movie.id;
            document.getElementById('editTitle').value = movie.title;
            document.getElementById('editGenre').value = movie.genre;
            document.getElementById('editIsActive').checked = movie.isActive;

            document.getElementById('editModal').style.display = 'block';
        })
        .catch(err => console.error("Lỗi lấy phim:", err));
}
document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const id = document.getElementById('editId').value;
    const payload = {
        Title: document.getElementById('editTitle').value,
        Genre: document.getElementById('editGenre').value,
        IsActive: document.getElementById('editIsActive').checked
    };

    try {
        const res = await fetch(`https://localhost:7019/api/movies/sua/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Cập nhật thất bại!');
        alert('Cập nhật thành công!');
        document.getElementById('editModal').style.display = 'none';

        loadMovies(); // reload danh sách phim
    } catch (err) {
        console.error(err);
        alert('Có lỗi xảy ra khi cập nhật phim.');
    }
});
