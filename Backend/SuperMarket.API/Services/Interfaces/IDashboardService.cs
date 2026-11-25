using SuperMarket.API.DTOs;

namespace SuperMarket.API.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken);
}
