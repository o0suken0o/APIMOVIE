using APIMOVIE.Data;
using APIMOVIE.Models;
using Microsoft.AspNetCore.Mvc;

namespace APIMOVIE.Controllers
{
    [Route("api")]
    [ApiController]
    public class DangKyController : ControllerBase
    {
            private readonly MovieDbContext _context;

            public DangKyController(MovieDbContext context)
            {
                _context = context;
            }

            // 🟢 Đăng ký tài khoản mới
            [HttpPost("dangky")]
            public IActionResult DangKy([FromBody] Users registration)
            {
                if (registration == null)
                    return BadRequest(new { message = "Thiếu dữ liệu đăng ký." });

                // 1️⃣ Kiểm tra trùng Email
                bool emailExists = _context.DangKy.Any(u => u.Email == registration.Email);
                if (emailExists)
                    return Conflict(new { message = "Email đã tồn tại!" });

                // 2️⃣ Tạo tài khoản mới (mặc định Role = User)
                registration.Role = "User";
                registration.IsActive = true;

                _context.DangKy.Add(registration);
                _context.SaveChanges();

                return Ok(new { message = "Đăng ký thành công", role = "User" });
            }

        [HttpPost("dangnhap")]
        public IActionResult DangNhap([FromBody] Users login)
        {
            var user = _context.DangKy
                .FirstOrDefault(u => u.Email == login.Email && u.PassWord == login.PassWord);

            if (user == null)
                return BadRequest(new { message = "Sai email hoặc mật khẩu!" });

            if (!user.IsActive)
                return BadRequest(new { message = "Tài khoản của bạn đã bị khóa!" });

            return Ok(new
            {
                userName = user.UserName,
                role = user.Role,
                isActive = user.IsActive
            });
        }

    }
}