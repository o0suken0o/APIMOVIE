using System.ComponentModel.DataAnnotations;

namespace APIMOVIE.Models
{
    public class Movies
    {
        public int Id { get; set; } // Khóa chính

        [StringLength(255)]
        public string? Title { get; set; } // Tên phim

        public string? Description { get; set; } // Mô tả nội dung

        public string? Genre { get; set; } // Thể loại: "Hành động", "Tình cảm", ...

        public string? Director { get; set; } // Đạo diễn

        public string? Actors { get; set; } // Diễn viên chính (chuỗi cách nhau bởi dấu phẩy)

        public DateTime? ReleaseDate { get; set; } // Ngày phát hành

        public int? Duration { get; set; } // Thời lượng (phút)

        public string? Language { get; set; } // Ngôn ngữ (VD: "Tiếng Việt", "English")

        public string? ThumbnailUrl { get; set; } // Ảnh đại diện phim

        public string? VideoUrl { get; set; } // Link video (VD: link Google Drive, link stream)

        public double? Rating { get; set; } // Điểm đánh giá (IMDb, người dùng)

        public bool IsActive { get; set; } = true; // Ẩn/hiện phim trên web

        public string? Country { get; set; } // Quốc gia sản xuất

        public string? AgeRating { get; set; } // Giới hạn độ tuổi (VD: "13+", "18+")

        // Nếu bạn có quản lý ai thêm phim (admin nào):
        public string? CreatedBy { get; set; } // Email hoặc ID người thêm

        public DateTime CreatedAt { get; set; } = DateTime.Now; // Ngày tạo
        
    }
}
