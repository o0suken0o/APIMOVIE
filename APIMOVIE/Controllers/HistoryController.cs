using APIMOVIE.Data;
using APIMOVIE.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace HistoryController.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public HistoryController(MovieDbContext context)
        {
            _context = context;
        }

        // 🟢 Thêm lịch sử xem phim
        [HttpPost("add")]
        public IActionResult AddHistory(int movieId, string userName)
        {
            var movie = _context.Movie.Find(movieId);
            if (movie == null)
                return NotFound(new { message = "Không tìm thấy phim." });

            var history = new WatchHistory
            {
                MovieId = movie.Id,
                MovieTitle = movie.Title,
                PosterUrl = movie.ThumbnailUrl,
                UserName = userName,
                WatchedAt = DateTime.Now
            };

            _context.WatchHistories.Add(history);
            _context.SaveChanges();

            return Ok(new { message = "Đã lưu lịch sử xem phim." });
        }

        // 🟡 Lấy lịch sử theo người dùng
        [HttpGet("list")]
        public IActionResult GetHistory(string userName)
        {
            var histories = _context.WatchHistories
                .Where(h => h.UserName == userName)
                .OrderByDescending(h => h.WatchedAt)
                .ToList();

            return Ok(histories);
        }

        // 🔴 Xóa lịch sử của use
        [HttpDelete("delete")]
        public IActionResult DeleteHistory(string userName, int movieId)
        {
            var record = _context.WatchHistories
                .FirstOrDefault(h => h.UserName == userName && h.MovieId == movieId);

            if (record == null)
                return NotFound(new { message = "Không tìm thấy lịch sử cần xóa." });

            _context.WatchHistories.Remove(record);
            _context.SaveChanges();

            return Ok(new { message = "Đã xóa lịch sử xem phim." });
        }

    }
}
