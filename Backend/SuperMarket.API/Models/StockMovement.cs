namespace SuperMarket.API.Models;

public sealed class StockMovement
{
    public long Id { get; set; }
    public int ProductId { get; set; }
    public string MovementType { get; set; } = string.Empty;
    public int QuantityChange { get; set; }
    public string? ReferenceType { get; set; }
    public int? ReferenceId { get; set; }
    public DateTime OccurredAt { get; set; }
    public string? Notes { get; set; }
    public Product Product { get; set; } = null!;
}
