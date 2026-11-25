namespace SuperMarket.API.Models;

public sealed class Purchase
{
    public int Id { get; set; }
    public string PurchaseNumber { get; set; } = string.Empty;
    public int SupplierId { get; set; }
    public DateTime OrderedAt { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "Draft";
    public Supplier Supplier { get; set; } = null!;
    public ICollection<PurchaseItem> Items { get; set; } = new List<PurchaseItem>();
}
