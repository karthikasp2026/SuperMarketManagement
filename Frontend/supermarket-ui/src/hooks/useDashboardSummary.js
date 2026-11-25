import { useEffect, useState } from 'react'
import { getDashboardSummary } from '../services/dashboardService'

function useDashboardSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshVersion, setRefreshVersion] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getDashboardSummary()
      .then((data) => {
        if (active) setSummary(data)
      })
      .catch(() => {
        if (active) setError('We couldn’t load dashboard data. Check that the MarketFlow API and SQL Server are running, then retry.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [refreshVersion])

  return {
    summary,
    loading,
    error,
    retry: () => setRefreshVersion((version) => version + 1),
  }
}

export default useDashboardSummary
