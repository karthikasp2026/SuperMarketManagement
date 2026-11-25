namespace SuperMarket.API.Models;

public sealed class Payment
{
    public int Id { get; set; }
    public int SaleId { get; set; }
    public string Method { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime PaidAt { get; set; }
    public Sale Sale { get; set; } = null!;
}
