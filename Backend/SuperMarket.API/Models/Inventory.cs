namespace SuperMarket.API.Models;

public sealed class Inventory
{
    public int ProductId { get; set; }
    public int OpeningStock { get; set; }
    public int PurchasesReceived { get; set; }
    public int Returns { get; set; }
    public int Sold { get; set; }
    public int DamagedStock { get; set; }
    public int Adjustments { get; set; }
    public int CurrentStock { get; private set; }
    public Product Product { get; set; } = null!;
}
