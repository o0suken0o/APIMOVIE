using Microsoft.AspNetCore.Mvc;
using APIMOVIE.Data;
using APIMOVIE.Models;
using System.Linq;

namespace APIMOVIE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public UserController(MovieDbContext context)
        {
            _context = context;
        }

        // GET: api/User
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_context.DangKy.ToList());
        }

        // GET: api/User/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _context.DangKy.Find(id);
            if (user == null) return NotFound(new { message = "Không tìm thấy user" });
            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public IActionResult Create([FromBody] Users user)
        {
            _context.DangKy.Add(user);
            _context.SaveChanges();
            return Ok(new { message = "Đã thêm user", user });
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Users updatedUser)
        {
            var user = _context.DangKy.Find(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy user để cập nhật" });

            user.UserName = updatedUser.UserName;
            user.PassWord = updatedUser.PassWord; // nếu muốn update password
            user.Email = updatedUser.Email;
            user.Role = updatedUser.Role;
            user.IsActive = updatedUser.IsActive;

            _context.SaveChanges();
            return Ok(new { message = "Cập nhật user thành công" });
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.DangKy.Find(id);
            if (user == null)
                return NotFound(new { message = "Không tìm thấy user để xóa" });

            _context.DangKy.Remove(user);
            _context.SaveChanges();
            return Ok(new { message = "Đã xóa user" });
        }
    }
}
