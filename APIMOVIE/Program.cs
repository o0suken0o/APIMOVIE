using APIMOVIE.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // Cho phép mọi domain
              .AllowAnyHeader()   // Cho phép mọi header
              .AllowAnyMethod();  // Cho phép GET, POST, PUT, DELETE
    });
});
// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Movie")));

var app = builder.Build();

// Configure the HTTP request pipeline.
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ⚙️ Phục vụ file tĩnh (HTML, CSS, JS trong wwwroot)
app.UseStaticFiles();

// ✅ Đặt CORS trước Authorization (rất quan trọng)
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// ✅ Nếu bạn muốn khi vào https://localhost:7019 thì tự mở index.html
app.MapFallbackToFile("index.html");

app.Run();
