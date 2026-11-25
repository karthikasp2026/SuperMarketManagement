namespace SuperMarket.API.Models;

public sealed class PurchaseItem
{
    public int Id { get; set; }
    public int PurchaseId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal UnitCost { get; set; }
    public decimal TaxPercent { get; set; }
    public Purchase Purchase { get; set; } = null!;
    public Product Product { get; set; } = null!;
}
