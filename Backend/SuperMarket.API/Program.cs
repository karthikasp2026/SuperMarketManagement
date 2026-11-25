using Microsoft.EntityFrameworkCore;
using SuperMarket.API.Data;
using SuperMarket.API.Middleware;
using SuperMarket.API.Repositories;
using SuperMarket.API.Repositories.Interfaces;
using SuperMarket.API.Services;
using SuperMarket.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("MarketFlow")
    ?? throw new InvalidOperationException("The MarketFlow SQL Server connection string is not configured.");

builder.Services.AddDbContext<MarketFlowDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<IDashboardRepository, DashboardRepository>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<ApiExceptionMiddleware>();
app.UseCors("Frontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" })).WithName("HealthCheck");
app.Run();
