import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Activity, ArrowRight, Bell, Boxes,
  CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  Command, CreditCard, FileBarChart, LayoutDashboard, Menu, Moon, MoreHorizontal,
  Package, Plus, Search, Settings, ShoppingBag, ShoppingCart, Sun, Truck,
  Users, WalletCards, X,
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import MetricCard from './components/MetricCard'
import { useTheme } from './context/ThemeContext'
import useDashboardSummary from './hooks/useDashboardSummary'
import './App.css'

const navigation = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: LayoutDashboard }] },
  {
    label: 'Manage',
    items: [
      { label: 'Products', icon: Package },
      { label: 'Inventory', icon: Boxes },
      { label: 'Point of sale', icon: ShoppingCart },
      { label: 'Sales & invoices', icon: WalletCards },
      { label: 'Purchases', icon: ShoppingBag },
      { label: 'Suppliers', icon: Truck },
      { label: 'Customers', icon: Users },
    ],
  },
  { label: 'Insights', items: [{ label: 'Reports', icon: FileBarChart }] },
]

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const formatCurrency = (value) => currency.format(value ?? 0)

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { theme, setTheme, accent, setAccent } = useTheme()
  const { summary, loading, error, retry } = useDashboardSummary()
  const trend = summary?.salesTrend ?? []
  const pageTitle = activePage === 'Dashboard' ? 'Dashboard' : activePage
  const dateLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening'
  const formatCount = (value) => Math.round(value).toLocaleString('en-IN')

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''} ${mobileNavOpen ? 'mobile-nav-open' : ''}`}>
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); setActivePage('Dashboard') }}>
          <span className="brand-mark"><Activity size={20} strokeWidth={2.6} /></span>
          <span className="brand-name">market<span>flow</span><small>RETAIL OPERATIONS</small></span>
        </a>
        <button className="workspace-switch" type="button" aria-label="Current workspace">
          <span className="workspace-avatar">M</span>
          <span className="workspace-copy"><strong>MarketFlow Market</strong><small>Retail workspace</small></span>
          <ChevronDown size={15} />
        </button>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((group) => (
            <section className="nav-group" key={group.label}>
              <span className="nav-heading">{group.label}</span>
              {group.items.map(({ label, icon: Icon }) => (
                <button
                  type="button"
                  className={`nav-link ${activePage === label ? 'active' : ''}`}
                  key={label}
                  onClick={() => { setActivePage(label); setMobileNavOpen(false) }}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
                  {label === 'Inventory' && Number(summary?.lowStockProducts ?? 0) > 0 && (
                    <span className="nav-count">{summary.lowStockProducts}</span>
                  )}
                </button>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-glow" />
            <strong>Need a hand?</strong>
            <p>Get help setting up your store.</p>
            <button type="button" onClick={() => setSettingsOpen(true)}>Visit help center <ArrowRight size={13} /></button>
          </div>
          <button type="button" className="nav-link" onClick={() => setSettingsOpen(true)}><Settings size={18} /><span>Settings</span></button>
          <div className="profile-row">
            <span className="profile-avatar">RK</span>
            <span className="profile-copy"><strong>Store admin</strong><small>Administrator</small></span>
            <MoreHorizontal size={19} />
          </div>
        </div>
        <button className="collapse-button" type="button" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu icon-button" type="button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle navigation"><Menu size={19} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{pageTitle}</strong></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={16} /><input type="search" placeholder="Search anything..." aria-label="Search" /><kbd><Command size={11} /> K</kbd></div>
            <button className="icon-button theme-toggle" type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="icon-button notification-button" type="button" aria-label="Notifications"><Bell size={18} /><i /></button>
            <span className="topbar-divider" />
            <span className="topbar-avatar">RK</span>
          </div>
        </header>

        <div className="page-content">
          {activePage === 'Dashboard' ? (
            <>
              <section className="page-heading">
                <div>
                  <p className="eyebrow"><span className="live-dot" /> YOUR STORE AT A GLANCE</p>
                  <h1>{greeting}<span className="heading-period">.</span></h1>
                  <p className="heading-subtitle">Here’s what’s happening with your store today.</p>
                </div>
                <div className="heading-actions">
                  <span className="date-chip"><CalendarDays size={15} />{dateLabel}</span>
                  <button className="primary-button" type="button" onClick={() => setActivePage('Point of sale')}><Plus size={16} /> New sale</button>
                </div>
              </section>

              {error && (
                <div className="error-banner" role="alert">
                  <CircleHelp size={18} /><span>{error}</span>
                  <button type="button" onClick={retry}>Retry</button>
                </div>
              )}

              <section className="metric-grid" aria-label="Store metrics">
                <MetricCard label="Today’s sales" value={loading || !summary ? undefined : summary.todaySales} formatter={formatCurrency} note="From completed transactions" icon={WalletCards} tone="icon-lime" index={0} />
                <MetricCard label="Monthly sales" value={loading || !summary ? undefined : summary.monthlySales} formatter={formatCurrency} note="Revenue this month" icon={Activity} tone="icon-blue" index={1} />
                <MetricCard label="Products in catalog" value={loading || !summary ? undefined : summary.totalProducts} formatter={formatCount} note="Active products" icon={Package} tone="icon-violet" index={2} />
                <MetricCard label="Stock valuation" value={loading || !summary ? undefined : summary.totalStockValue} formatter={formatCurrency} note="At purchase price" icon={Boxes} tone="icon-orange" index={3} />
              </section>

              <section className="dashboard-grid">
                <article className="chart-card surface">
                  <div className="card-heading">
                    <div><span className="section-kicker">PERFORMANCE</span><h2>Sales overview</h2></div>
                    <button className="select-button" type="button">Last 7 days <ChevronDown size={14} /></button>
                  </div>
                  <div className="chart-summary">
                    <strong>{loading || !summary ? '—' : formatCurrency(trend.reduce((total, point) => total + (point.sales ?? 0), 0))}</strong>
                    <span className="chart-caption">Total sales <span className="chart-period">· this week</span></span>
                  </div>
                  <div className="sales-chart">
                    {!loading && summary && trend.every((point) => point.sales === 0) && <span className="chart-empty">Sales activity will appear here</span>}
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
                        <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs>
                        <CartesianGrid stroke="var(--line)" strokeDasharray="3 5" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} tickFormatter={(value) => value === 0 ? '0' : `${Math.round(value / 1000)}k`} />
                        <Tooltip contentStyle={{ background: 'var(--tooltip)', border: '1px solid var(--line)', borderRadius: 10, color: 'var(--text)' }} formatter={(value) => [formatCurrency(value), 'Sales']} />
                        <Area type="monotone" dataKey="sales" stroke="var(--accent)" strokeWidth={2.5} fill="url(#salesFill)" activeDot={{ r: 5, fill: 'var(--accent)', stroke: 'var(--panel)' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="inventory-card surface">
                  <div className="card-heading">
                    <div><span className="section-kicker">STOCK HEALTH</span><h2>Inventory overview</h2></div>
                    <button className="more-button" type="button" aria-label="More inventory options"><MoreHorizontal size={19} /></button>
                  </div>
                  <div className="inventory-total"><strong>{loading || !summary ? '—' : summary.totalProducts.toLocaleString('en-IN')}</strong><span>products tracked</span></div>
                  <div className="inventory-bar" aria-label="Inventory status">
                    <span className="stock-healthy" style={{ flex: Math.max(0, summary?.inventoryOverview?.inStock ?? 0) }} />
                    <span className="stock-low" style={{ flex: Math.max(0, summary?.inventoryOverview?.lowStock ?? 0) }} />
                    <span className="stock-empty" style={{ flex: Math.max(0, summary?.inventoryOverview?.outOfStock ?? 0) }} />
                    <span className="stock-placeholder" />
                  </div>
                  <div className="inventory-legend">
                    <div><i className="legend-healthy" /><span>In stock</span><strong>{loading || !summary ? '—' : summary.inventoryOverview.inStock.toLocaleString('en-IN')}</strong></div>
                    <div><i className="legend-low" /><span>Low stock</span><strong>{loading || !summary ? '—' : summary.lowStockProducts.toLocaleString('en-IN')}</strong></div>
                    <div><i className="legend-empty" /><span>Out of stock</span><strong>{loading || !summary ? '—' : summary.outOfStockProducts.toLocaleString('en-IN')}</strong></div>
                  </div>
                  <button className="text-link" type="button" onClick={() => setActivePage('Inventory')}>View inventory <ArrowRight size={14} /></button>
                </article>
              </section>

              <section className="lower-grid">
                <article className="table-card surface">
                  <div className="card-heading">
                    <div><span className="section-kicker">LATEST ACTIVITY</span><h2>Recent transactions</h2></div>
                    <button className="text-link compact-link" type="button" onClick={() => setActivePage('Sales & invoices')}>View all <ArrowRight size={14} /></button>
                  </div>
                  <div className="transactions-table">
                    <div className="transaction-row transaction-header"><span>INVOICE</span><span>CUSTOMER</span><span>PAYMENT</span><span>AMOUNT</span><span>STATUS</span></div>
                    {loading ? (
                      Array.from({ length: 3 }, (_, index) => <div className="transaction-row loading-row" key={index}><span /><span /><span /><span /><span /></div>)
                    ) : (summary?.recentTransactions ?? []).length ? (
                      summary.recentTransactions.map((transaction) => (
                        <div className="transaction-row" key={transaction.invoiceNumber}>
                          <strong className="invoice-number">{transaction.invoiceNumber}</strong>
                          <span className="customer-name">{transaction.customerName || 'Walk-in customer'}</span>
                          <span className="payment-method">{transaction.paymentMethod || '—'}</span>
                          <strong className="transaction-amount">{formatCurrency(transaction.total)}</strong>
                          <span className="status-pill"><Check size={11} /> Paid</span>
                        </div>
                      ))
                    ) : (
                      <div className="table-empty"><span className="empty-icon"><CreditCard size={19} /></span><strong>{summary ? 'No transactions yet' : 'Transactions unavailable'}</strong><p>{summary ? 'Completed sales will show up here.' : 'Check the API connection to load activity.'}</p></div>
                    )}
                  </div>
                </article>
                <article className="top-products-card surface">
                  <div className="card-heading">
                    <div><span className="section-kicker">YOUR BESTSELLERS</span><h2>Top products</h2></div>
                    <button className="more-button" type="button" aria-label="More product options"><MoreHorizontal size={19} /></button>
                  </div>
                  <div className="product-list">
                    {loading ? Array.from({ length: 3 }, (_, index) => <div className="product-row loading-row" key={index}><span /><span /><span /></div>) : (summary?.topProducts ?? []).length ? (
                      summary.topProducts.map((product, index) => (
                        <div className="product-row" key={product.productId}>
                          <span className={`product-rank rank-${index + 1}`}>{String(index + 1).padStart(2, '0')}</span>
                          <span className="product-info"><strong>{product.productName}</strong><small>{product.quantitySold} units sold</small></span>
                          <span className="product-sales">{formatCurrency(product.revenue)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="products-empty"><ShoppingBag size={19} /><span>{summary ? 'Best sellers appear after your first sale.' : 'Product data is unavailable until the API connects.'}</span></div>
                    )}
                  </div>
                </article>
              </section>
              <footer className="page-footer"><span>MarketFlow <span className="footer-dot">·</span> Retail, in rhythm.</span><span>Dashboard metrics sync from your store database</span></footer>
            </>
          ) : (
            <section className="module-placeholder surface">
              <span className="placeholder-icon"><Settings size={22} /></span>
              <span className="section-kicker">COMING UP NEXT</span>
              <h1>{activePage}</h1>
              <p>This module is part of the MarketFlow roadmap. The dashboard and API foundation are ready; this workspace will be built out in the next implementation phase.</p>
              <button className="primary-button" type="button" onClick={() => setActivePage('Dashboard')}><ArrowRight size={15} /> Back to dashboard</button>
            </section>
          )}
        </div>
      </main>

      {settingsOpen && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setSettingsOpen(false)}>
          <motion.section className="settings-dialog surface" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="dialog-heading"><div><span className="section-kicker">PERSONALIZE</span><h2 id="settings-title">Appearance</h2></div><button className="icon-button" type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={18} /></button></div>
            <p className="settings-label">COLOR THEME</p>
            <div className="theme-options">
              <button type="button" className={`theme-option ${theme === 'dark' ? 'selected' : ''}`} onClick={() => setTheme('dark')}><span className="theme-preview dark-preview" /><span>Midnight</span>{theme === 'dark' && <Check size={14} />}</button>
              <button type="button" className={`theme-option ${theme === 'light' ? 'selected' : ''}`} onClick={() => setTheme('light')}><span className="theme-preview light-preview" /><span>Daylight</span>{theme === 'light' && <Check size={14} />}</button>
            </div>
            <p className="settings-label">ACCENT COLOR</p>
            <div className="accent-options">
              {['#c7f36b', '#a8e6cf', '#91b7ff', '#d2a8ff', '#ffb58a'].map((color) => <button key={color} type="button" className={`accent-swatch ${accent === color ? 'chosen' : ''}`} style={{ '--swatch': color }} onClick={() => setAccent(color)} aria-label={`Set accent color ${color}`} />)}
              <label className="custom-color"><input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} aria-label="Choose custom accent color" /> Custom</label>
            </div>
            <button className="dialog-done" type="button" onClick={() => setSettingsOpen(false)}>Done</button>
          </motion.section>
        </div>
      )}
    </div>
  )
}

export default App
