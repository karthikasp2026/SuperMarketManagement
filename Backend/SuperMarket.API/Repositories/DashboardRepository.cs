using Microsoft.EntityFrameworkCore;
using SuperMarket.API.Data;
using SuperMarket.API.DTOs;
using SuperMarket.API.Repositories.Interfaces;

namespace SuperMarket.API.Repositories;

public sealed class DashboardRepository(MarketFlowDbContext dbContext) : IDashboardRepository
{
    public async Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var monthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var trendStart = today.AddDays(-6);
        var trendEnd = today.AddDays(1);

        var todaySales = await dbContext.Sales
            .Where(sale => sale.SoldAt >= today && sale.SoldAt < today.AddDays(1))
            .SumAsync(sale => (decimal?)sale.Total, cancellationToken) ?? 0m;
        var monthlySales = await dbContext.Sales
            .Where(sale => sale.SoldAt >= monthStart && sale.SoldAt < today.AddDays(1))
            .SumAsync(sale => (decimal?)sale.Total, cancellationToken) ?? 0m;
        var totalProducts = await dbContext.Products
            .CountAsync(product => product.IsActive, cancellationToken);
        var totalStockValue = await dbContext.Inventory
            .Where(inventory => inventory.Product.IsActive)
            .SumAsync(inventory => (decimal?)(inventory.CurrentStock * inventory.Product.PurchasePrice), cancellationToken) ?? 0m;
        var totalTransactions = await dbContext.Sales
            .CountAsync(sale => sale.SoldAt >= today && sale.SoldAt < today.AddDays(1), cancellationToken);

        var inventoryCounts = await dbContext.Inventory
            .Where(inventory => inventory.Product.IsActive)
            .GroupBy(inventory => inventory.CurrentStock <= 0
                ? 2
                : inventory.CurrentStock <= inventory.Product.ReorderLevel ? 1 : 0)
            .Select(group => new { Status = group.Key, Count = group.Count() })
            .ToListAsync(cancellationToken);

        var inStock = inventoryCounts.FirstOrDefault(item => item.Status == 0)?.Count ?? 0;
        var lowStock = inventoryCounts.FirstOrDefault(item => item.Status == 1)?.Count ?? 0;
        var outOfStock = inventoryCounts.FirstOrDefault(item => item.Status == 2)?.Count ?? 0;

        var trendSales = await dbContext.Sales
            .Where(sale => sale.SoldAt >= trendStart && sale.SoldAt < trendEnd)
            .GroupBy(sale => sale.SoldAt.Date)
            .Select(group => new { Day = group.Key, Sales = group.Sum(sale => sale.Total) })
            .ToListAsync(cancellationToken);
        var salesByDay = trendSales.ToDictionary(item => item.Day.Date, item => item.Sales);
        var salesTrend = Enumerable.Range(0, 7)
            .Select(offset =>
            {
                var day = trendStart.AddDays(offset);
                return new SalesTrendPointDto(day.ToString("ddd"), salesByDay.GetValueOrDefault(day.Date));
            })
            .ToArray();

        var topProductRows = await dbContext.SaleItems
            .GroupBy(item => new { item.ProductId, item.Product.Name })
            .Select(group => new
            {
                ProductId = group.Key.ProductId,
                ProductName = group.Key.Name,
                QuantitySold = group.Sum(item => item.Quantity),
                Revenue = group.Sum(item => item.Quantity * item.UnitPrice - item.Discount)
            })
            .OrderByDescending(item => item.QuantitySold)
            .Take(5)
            .ToListAsync(cancellationToken);
        var topProducts = topProductRows
            .Select(item => new TopProductDto(item.ProductId, item.ProductName, item.QuantitySold, item.Revenue))
            .ToArray();

        var recentTransactions = await dbContext.Sales
            .OrderByDescending(sale => sale.SoldAt)
            .Take(5)
            .Select(sale => new RecentTransactionDto(
                sale.InvoiceNumber,
                sale.Customer == null ? null : sale.Customer.Name,
                sale.Payments.OrderByDescending(payment => payment.PaidAt).Select(payment => payment.Method).FirstOrDefault(),
                sale.Total,
                sale.SoldAt))
            .ToListAsync(cancellationToken);

        return new DashboardSummaryDto(
            todaySales,
            monthlySales,
            totalProducts,
            totalStockValue,
            totalTransactions,
            lowStock,
            outOfStock,
            new InventoryOverviewDto(inStock, lowStock, outOfStock),
            salesTrend,
            topProducts,
            recentTransactions);
    }
}
