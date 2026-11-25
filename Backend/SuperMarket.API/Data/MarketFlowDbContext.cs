using Microsoft.EntityFrameworkCore;
using SuperMarket.API.Models;

namespace SuperMarket.API.Data;

public sealed class MarketFlowDbContext(DbContextOptions<MarketFlowDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Inventory> Inventory => Set<Inventory>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<Purchase> Purchases => Set<Purchase>();
    public DbSet<PurchaseItem> PurchaseItems => Set<PurchaseItem>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<SaleItem> SaleItems => Set<SaleItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("Categories");
            entity.Property(x => x.Name).HasMaxLength(80).IsRequired();
            entity.Property(x => x.Description).HasMaxLength(300);
            entity.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.ToTable("Suppliers");
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.Property(x => x.ContactPerson).HasMaxLength(120);
            entity.Property(x => x.Email).HasMaxLength(254);
            entity.Property(x => x.Phone).HasMaxLength(32);
            entity.Property(x => x.Address).HasMaxLength(400);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("Products", table =>
                table.HasCheckConstraint("CK_Products_Prices", "[PurchasePrice] >= 0 AND [SellingPrice] >= 0 AND [TaxPercent] >= 0"));
            entity.Property(x => x.Name).HasMaxLength(160).IsRequired();
            entity.Property(x => x.SKU).HasMaxLength(50).IsRequired();
            entity.Property(x => x.Barcode).HasMaxLength(80);
            entity.Property(x => x.ImageUrl).HasMaxLength(500);
            entity.Property(x => x.Unit).HasMaxLength(24).IsRequired();
            entity.Property(x => x.PurchasePrice).HasPrecision(18, 2);
            entity.Property(x => x.SellingPrice).HasPrecision(18, 2);
            entity.Property(x => x.TaxPercent).HasPrecision(5, 2);
            entity.HasIndex(x => x.SKU).IsUnique();
            entity.HasIndex(x => x.Barcode).IsUnique().HasFilter("[Barcode] IS NOT NULL");
            entity.HasIndex(x => new { x.CategoryId, x.IsActive });
            entity.HasOne(x => x.Category).WithMany(x => x.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(x => x.Supplier).WithMany(x => x.Products).HasForeignKey(x => x.SupplierId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.ToTable("Inventory", table =>
                table.HasCheckConstraint("CK_Inventory_Stock", "[OpeningStock] >= 0 AND [PurchasesReceived] >= 0 AND [Returns] >= 0 AND [Sold] >= 0 AND [DamagedStock] >= 0 AND [CurrentStock] >= 0"));
            entity.HasKey(x => x.ProductId);
            entity.Property(x => x.CurrentStock)
                .HasComputedColumnSql("([OpeningStock] + [PurchasesReceived] + [Returns] - [Sold] - [DamagedStock] + [Adjustments])", stored: true);
            entity.HasOne(x => x.Product).WithOne(x => x.Inventory).HasForeignKey<Inventory>(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StockMovement>(entity =>
        {
            entity.ToTable("StockMovements");
            entity.Property(x => x.MovementType).HasMaxLength(32).IsRequired();
            entity.Property(x => x.ReferenceType).HasMaxLength(32);
            entity.Property(x => x.Notes).HasMaxLength(400);
            entity.HasIndex(x => new { x.ProductId, x.OccurredAt });
            entity.HasOne(x => x.Product).WithMany(x => x.StockMovements).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers");
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(254);
            entity.Property(x => x.Phone).HasMaxLength(32);
            entity.HasIndex(x => x.Phone);
        });

        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.ToTable("Purchases");
            entity.Property(x => x.PurchaseNumber).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Status).HasMaxLength(24).IsRequired();
            entity.Property(x => x.Total).HasPrecision(18, 2);
            entity.HasIndex(x => x.PurchaseNumber).IsUnique();
            entity.HasIndex(x => new { x.SupplierId, x.OrderedAt });
            entity.HasOne(x => x.Supplier).WithMany(x => x.Purchases).HasForeignKey(x => x.SupplierId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PurchaseItem>(entity =>
        {
            entity.ToTable("PurchaseItems", table =>
                table.HasCheckConstraint("CK_PurchaseItems_Quantity", "[Quantity] > 0"));
            entity.Property(x => x.UnitCost).HasPrecision(18, 2);
            entity.Property(x => x.TaxPercent).HasPrecision(5, 2);
            entity.HasOne(x => x.Purchase).WithMany(x => x.Items).HasForeignKey(x => x.PurchaseId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Product).WithMany(x => x.PurchaseItems).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Sale>(entity =>
        {
            entity.ToTable("Sales");
            entity.Property(x => x.InvoiceNumber).HasMaxLength(40).IsRequired();
            entity.Property(x => x.Subtotal).HasPrecision(18, 2);
            entity.Property(x => x.Discount).HasPrecision(18, 2);
            entity.Property(x => x.Tax).HasPrecision(18, 2);
            entity.Property(x => x.Total).HasPrecision(18, 2);
            entity.HasIndex(x => x.InvoiceNumber).IsUnique();
            entity.HasIndex(x => x.SoldAt);
            entity.HasOne(x => x.Customer).WithMany(x => x.Sales).HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<SaleItem>(entity =>
        {
            entity.ToTable("SaleItems", table =>
                table.HasCheckConstraint("CK_SaleItems_Quantity", "[Quantity] > 0"));
            entity.Property(x => x.UnitPrice).HasPrecision(18, 2);
            entity.Property(x => x.TaxPercent).HasPrecision(5, 2);
            entity.Property(x => x.Discount).HasPrecision(18, 2);
            entity.HasOne(x => x.Sale).WithMany(x => x.Items).HasForeignKey(x => x.SaleId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.Product).WithMany(x => x.SaleItems).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("Payments");
            entity.Property(x => x.Method).HasMaxLength(24).IsRequired();
            entity.Property(x => x.Amount).HasPrecision(18, 2);
            entity.HasIndex(x => new { x.SaleId, x.PaidAt });
            entity.HasOne(x => x.Sale).WithMany(x => x.Payments).HasForeignKey(x => x.SaleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("Users");
            entity.Property(x => x.Name).HasMaxLength(140).IsRequired();
            entity.Property(x => x.Email).HasMaxLength(254).IsRequired();
            entity.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
            entity.Property(x => x.Role).HasMaxLength(32).IsRequired();
            entity.HasIndex(x => x.Email).IsUnique();
        });
    }
}
