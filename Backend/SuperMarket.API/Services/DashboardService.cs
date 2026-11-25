using SuperMarket.API.DTOs;
using SuperMarket.API.Repositories.Interfaces;
using SuperMarket.API.Services.Interfaces;

namespace SuperMarket.API.Services;

public sealed class DashboardService(IDashboardRepository dashboardRepository) : IDashboardService
{
    public Task<DashboardSummaryDto> GetSummaryAsync(CancellationToken cancellationToken) =>
        dashboardRepository.GetSummaryAsync(cancellationToken);
}
