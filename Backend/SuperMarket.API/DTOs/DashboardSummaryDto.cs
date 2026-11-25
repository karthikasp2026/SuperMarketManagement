namespace SuperMarket.API.DTOs;

public sealed record DashboardSummaryDto(
    decimal TodaySales,
    decimal MonthlySales,
    int TotalProducts,
    decimal TotalStockValue,
    int TotalTransactions,
    int LowStockProducts,
    int OutOfStockProducts,
    InventoryOverviewDto InventoryOverview,
    IReadOnlyList<SalesTrendPointDto> SalesTrend,
    IReadOnlyList<TopProductDto> TopProducts,
    IReadOnlyList<RecentTransactionDto> RecentTransactions);

public sealed record InventoryOverviewDto(int InStock, int LowStock, int OutOfStock);
public sealed record SalesTrendPointDto(string Day, decimal Sales);
public sealed record TopProductDto(int ProductId, string ProductName, int QuantitySold, decimal Revenue);
public sealed record RecentTransactionDto(string InvoiceNumber, string? CustomerName, string? PaymentMethod, decimal Total, DateTime SoldAt);
