# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy file .csproj từ subfolder vào container
COPY APIMOVIE/APIMOVIE.csproj ./

# Restore packages
RUN dotnet restore

# Copy toàn bộ source code từ subfolder vào container
COPY APIMOVIE/. ./

# Build và publish ứng dụng
RUN dotnet publish -c Release -o out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy các file đã build từ stage trước vào runtime
COPY --from=build /app/out ./

# Expose port cho API
EXPOSE 10000

# Command chạy ứng dụng
ENTRYPOINT ["dotnet", "APIMOVIE.dll"]
