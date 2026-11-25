# MarketFlow

MarketFlow is a supermarket operations system built with React, Vite, ASP.NET Core Web API, Entity Framework Core, and SQL Server.

## Project structure

- `Frontend/supermarket-ui` — React UI, shared API client, dashboard, charts, and theme controls.
- `Backend/SuperMarket.API` — ASP.NET Core controllers, DTOs, services, repositories, SQL Server `DbContext`, and domain models.
- `Database` — reserved for database scripts and reference data added alongside future modules.

## Prerequisites

- .NET 10 SDK
- Node.js 20.19+ (or 22.12+) and npm
- SQL Server LocalDB, SQL Server Express, or a SQL Server instance

## Configure and run

1. Configure the `ConnectionStrings:MarketFlow` value in `Backend/SuperMarket.API/appsettings.json`, or override it with the `ConnectionStrings__MarketFlow` environment variable.
2. From `Backend/SuperMarket.API`, install the matching EF CLI once if it is not already installed, then apply the included initial schema:

   ```powershell
   dotnet tool install --global dotnet-ef --version 10.0.11
   dotnet ef database update
   ```

3. Start the API from `Backend/SuperMarket.API`:

   ```powershell
   dotnet run
   ```

   The development profile listens on `http://localhost:5192`. OpenAPI is available at `/openapi/v1.json`, and `/api/health` provides a database-independent health check.

4. In another terminal, start the UI:

   ```powershell
   cd Frontend/supermarket-ui
   npm install
   npm run dev
   ```

   The UI calls `http://localhost:5192/api` by default. Set `VITE_API_BASE_URL` when the API uses a different address.

## Implemented foundation

- Responsive MarketFlow dashboard shell with collapsible navigation, dark/light themes, accent customization, and reduced-motion support.
- SQL Server entities and relationships for categories, products, suppliers, inventory, stock movements, purchases, customers, sales, sale items, payments, and users.
- Initial EF Core migration for the complete normalized SQL Server schema.
- Dashboard summary endpoint (`GET /api/dashboard/summary`) that calculates its metrics and chart series from SQL-backed records.
- Layered dashboard controller → service → repository flow and centralized API error responses.

The dashboard intentionally displays empty states until the database contains store data. Product, POS, purchasing, reporting, authentication, and remaining management workflows are subsequent implementation phases; navigation entries are not yet functional business modules.
