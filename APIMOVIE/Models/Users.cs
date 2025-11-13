using System.ComponentModel.DataAnnotations;

namespace APIMOVIE.Models
{
    public class Users
    {
            public int Id { get; set; }
            public string? UserName { get; set; }

            [Required]
            public string PassWord { get; set; }

            [Required]
            public string Email { get; set; }
            public bool IsActive { get; set; }
            public string? Role { get; set; }
            }
    }
