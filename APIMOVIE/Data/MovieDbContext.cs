using APIMOVIE.Models;
using Microsoft.EntityFrameworkCore;
namespace APIMOVIE.Data
{
    public class MovieDbContext : DbContext
    {
        public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }

        public DbSet<Users> DangKy { get; set; }
        public DbSet<Movies> Movie { get; set; }
        public DbSet<WatchHistory> WatchHistories { get; set; }
    }
}
