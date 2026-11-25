using SuperMarket.API.DTOs;

namespace SuperMarket.API.Repositories.Interfaces;

public interface IDashboardRepository
{
    Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken);
}
