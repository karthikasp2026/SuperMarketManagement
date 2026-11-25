namespace SuperMarket.API.Models;

public sealed class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<Sale> Sales { get; set; } = new List<Sale>();
}
