namespace APIMOVIE.Models
{
    public class WatchHistory
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string? MovieTitle { get; set; }
        public string? PosterUrl { get; set; }
        public string? UserName { get; set; }
        public DateTime WatchedAt { get; set; } = DateTime.Now;
    }
}
