using APIMOVIE.Data;
using APIMOVIE.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIMOVIE.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController: ControllerBase
    {
            private readonly MovieDbContext _context;

            public MoviesController(MovieDbContext context)
            {
                _context = context;
            }

        // POST api/them
        [HttpPost("them")]
        public IActionResult ThemPhim([FromBody] Movies phim)
        {
            // Kiểm tra dữ liệu hợp lệ
            if (phim == null || string.IsNullOrWhiteSpace(phim.Title))
                return BadRequest(new { message = "Title là bắt buộc." });

            // Kiểm tra trùng phim (theo Title + ReleaseDate)
            bool exists = _context.Movie.Any(m =>
                m.Title == phim.Title &&
                (m.ReleaseDate == phim.ReleaseDate || (m.ReleaseDate == null && phim.ReleaseDate == null))
            );

            if (exists)
                return Conflict(new { message = "Phim đã tồn tại." });

            // Tự động thiết lập giá trị mặc định
            // Nếu bạn KHÔNG muốn IsActive mặc định là true, bỏ dòng dưới
            // phim.IsActive = true;

            phim.CreatedAt = DateTime.Now;
            phim.CreatedBy ??= "Admin"; // Nếu null thì gán mặc định "Admin"

            _context.Movie.Add(phim);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm phim thành công!",
                phim
            });
        }
        // GET api/{id}
        [HttpGet("{id}")]
        public IActionResult GetMovieById(int id)
        {
            var phim = _context.Movie.Find(id);
            if (phim == null)
                return NotFound(new { message = "Không tìm thấy phim." });
            return Ok(phim);
        }
        //get api/movies/{genre}
        [HttpGet("theloai/{genre}")]
        public IActionResult GetMoviesByGenre(string genre)
        {
            var movies = _context.Movie
                .Where(m => m.Genre != null && m.Genre.Contains(genre))
                .ToList();
            return Ok(movies);
        }

        // GET: api/movies
        [HttpGet]
        public IActionResult GetAllMovies()
        {
            var movies = _context.Movie.ToList();
            return Ok(movies);
        }
        //delete/api/{id}
        [HttpDelete("{id}")]
        public IActionResult XoaPhim(int id)
        {
            var phim = _context.Movie.Find(id);
            if (phim == null)
                return NotFound(new { message = "Không tìm thấy phim." });
            _context.Movie.Remove(phim);
            _context.SaveChanges();
            return Ok(new { message = "Xóa phim thành công!" });
        }

        // PUT api/sua/{id}
        [HttpPut("sua/{id}")]
        public IActionResult UpdatePhim(int id, [FromBody] Movies updatedPhim)
        {
            // Tìm phim trong database theo ID
            var existingPhim = _context.Movie.Find(id);

            // Nếu không tìm thấy thì trả về lỗi 404
            if (existingPhim == null)
                return NotFound(new { message = "Không tìm thấy phim." });
            // Cập nhật các trường cần thiết
            existingPhim.Title = updatedPhim.Title;
            existingPhim.Description = updatedPhim.Description;
            existingPhim.ReleaseDate = updatedPhim.ReleaseDate;
            existingPhim.Genre = updatedPhim.Genre;
            existingPhim.Director = updatedPhim.Director;
            existingPhim.Rating = updatedPhim.Rating;
            existingPhim.IsActive = updatedPhim.IsActive;
            // Lưu thay đổi vào database
            _context.Movie.Update(existingPhim);
            _context.SaveChanges();
            // Trả về phản hồi JSON
            return Ok(new
            {
                message = "✅ Cập nhật phim thành công!",
                existingPhim
            });
        }
        // GET api/timkiem?Genre=abc
        [HttpGet("timkiem")]
        public IActionResult TimKiemPhim([FromQuery] string Genre)
        {
            if (string.IsNullOrWhiteSpace(Genre))
                return BadRequest(new { message = "Genre không được để trống." });
            var ketqua = _context.Movie
                .Where(m => m.Genre != null && m.Genre.Contains(Genre))
                .ToList();
            return Ok(ketqua);
        }

    }

}