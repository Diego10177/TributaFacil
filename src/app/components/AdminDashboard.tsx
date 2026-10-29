import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Bell,
  Settings,
  FileBarChart,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Home,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { View } from "../App";

interface Props {
  navigate: (v: View) => void;
}

const monthlyData = [
  { mes: "Ene", recaudacion: 42000, meta: 50000 },
  { mes: "Feb", recaudacion: 48500, meta: 50000 },
  { mes: "Mar", recaudacion: 53200, meta: 55000 },
  { mes: "Abr", recaudacion: 47800, meta: 55000 },
  { mes: "May", recaudacion: 61000, meta: 60000 },
  { mes: "Jun", recaudacion: 58400, meta: 60000 },
  { mes: "Jul", recaudacion: 65200, meta: 65000 },
  { mes: "Ago", recaudacion: 70100, meta: 65000 },
  { mes: "Sep", recaudacion: 63800, meta: 70000 },
  { mes: "Oct", recaudacion: 72400, meta: 70000 },
  { mes: "Nov", recaudacion: 68900, meta: 72000 },
  { mes: "Dic", recaudacion: 80200, meta: 75000 },
];

const recentTransactions = [
  { id: "T001", contribuyente: "María García", tributo: "Impuesto Predial", monto: 420.0, fecha: "22/06/2026", estado: "Pagado" },
  { id: "T002", contribuyente: "Carlos López", tributo: "Arbitrios Q2", monto: 187.5, fecha: "22/06/2026", estado: "Pendiente" },
  { id: "T003", contribuyente: "Ana Rodríguez", tributo: "Licencia Comercial", monto: 850.0, fecha: "21/06/2026", estado: "Pagado" },
  { id: "T004", contribuyente: "Juan Pérez", tributo: "Impuesto Predial", monto: 560.0, fecha: "21/06/2026", estado: "Vencido" },
  { id: "T005", contribuyente: "Rosa Mendoza", tributo: "Arbitrios Q1", monto: 210.0, fecha: "20/06/2026", estado: "Pagado" },
  { id: "T006", contribuyente: "Luis Torres", tributo: "Publicidad Exterior", monto: 320.0, fecha: "20/06/2026", estado: "Pendiente" },
  { id: "T007", contribuyente: "Sofía Castro", tributo: "Impuesto Predial", monto: 380.0, fecha: "19/06/2026", estado: "Pagado" },
];

const kpis = [
  {
    label: "Recaudación del mes",
    value: "S/ 80,200",
    trend: +12.3,
    subtitle: "vs. mes anterior",
    sparkline: [60, 65, 58, 72, 68, 80],
  },
  {
    label: "Tasa de morosidad",
    value: "18.4%",
    trend: -2.1,
    subtitle: "puntos menos",
    sparkline: [25, 23, 21, 20, 19, 18.4],
  },
  {
    label: "Pagos hoy",
    value: "147",
    trend: +8.7,
    subtitle: "transacciones",
    sparkline: [90, 110, 95, 130, 120, 147],
  },
  {
    label: "Nuevos contribuyentes",
    value: "23",
    trend: +4.5,
    subtitle: "este mes",
    sparkline: [12, 15, 18, 14, 20, 23],
  },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", view: "admin-dashboard" as View },
  { icon: Users, label: "Contribuyentes", view: "admin-contribuyentes" as View },
  { icon: Wallet, label: "Recaudación", view: null },
  { icon: Bell, label: "Notificaciones", view: "notifications" as View },
  { icon: FileBarChart, label: "Reportes", view: null },
  { icon: Settings, label: "Configuración", view: null },
];

const statusStyles: Record<string, { bg: string; text: string }> = {
  Pagado: { bg: "#DCFCE7", text: "#166534" },
  Pendiente: { bg: "#FEF3C7", text: "#92400E" },
  Vencido: { bg: "#FEE2E2", text: "#991B1B" },
};

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 72;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={points} stroke="#C9A227" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function AdminSidebar({
  collapsed,
  onToggle,
  navigate,
  currentView,
}: {
  collapsed: boolean;
  onToggle: () => void;
  navigate: (v: View) => void;
  currentView: View;
}) {
  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-200"
      style={{
        width: collapsed ? 64 : 220,
        background: "#0D1B4B",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", minHeight: 64 }}
      >
        <div
          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
          style={{ background: "#C9A227" }}
        >
          <span style={{ color: "#0D1B4B", fontSize: 12, fontWeight: 700 }}>TF</span>
        </div>
        {!collapsed && (
          <span
            className="ml-2.5 text-white whitespace-nowrap overflow-hidden"
            style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: 16 }}
          >
            Tributa<span style={{ color: "#C9A227" }}>Fácil</span>
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 overflow-hidden">
        {navItems.map(({ icon: Icon, label, view }) => {
          const active = view === currentView;
          return (
            <button
              key={label}
              onClick={() => view && navigate(view)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-all"
              style={{
                background: active ? "rgba(201,162,39,0.15)" : "transparent",
                color: active ? "#C9A227" : "rgba(255,255,255,0.65)",
                borderLeft: active ? "3px solid #C9A227" : "3px solid transparent",
              }}
              title={collapsed ? label : undefined}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center py-3 transition-colors"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.45)",
        }}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Back to citizen */}
      <button
        onClick={() => navigate("landing")}
        className="flex items-center gap-2 px-4 py-3 text-xs transition-colors"
        style={{
          color: "rgba(255,255,255,0.35)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
        title={collapsed ? "Portal ciudadano" : undefined}
      >
        <Home size={16} className="flex-shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">Portal ciudadano</span>}
      </button>
    </aside>
  );
}

export function AdminDashboard({ navigate }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F6FC]">
      {/* Desktop Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        navigate={navigate}
        currentView="admin-dashboard"
      />

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{ background: "#0D1B4B" }}
          >
            <div className="flex items-center justify-between px-4 py-4">
              <span
                className="text-white"
                style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700 }}
              >
                Tributa<span style={{ color: "#C9A227" }}>Fácil</span>
              </span>
              <button onClick={() => setMobileNavOpen(false)} className="text-white/60">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 py-2">
              {navItems.map(({ icon: Icon, label, view }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (view) navigate(view);
                    setMobileNavOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  <Icon size={20} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </nav>
            <button
              onClick={() => navigate("landing")}
              className="flex items-center gap-2 px-4 py-3 text-xs mb-4"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <Home size={16} />
              Portal ciudadano
            </button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="bg-white sticky top-0 z-40 flex-shrink-0"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <div className="px-4 sm:px-6 h-16 flex items-center gap-4">
            <button
              className="md:hidden p-1.5 text-[#0D1B4B]"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar contribuyente..."
                className="w-full pl-9 pr-4 py-2 text-sm text-[#0D1B4B] focus:outline-none placeholder-gray-400"
                style={{
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 4,
                  background: "#F4F6FC",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0D1B4B")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {/* Bell */}
              <button
                onClick={() => navigate("notifications")}
                className="relative p-2 text-[#0D1B4B] hover:text-[#C9A227] transition-colors"
              >
                <Bell size={20} />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: "#DC2626" }}
                />
              </button>

              {/* User */}
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: "#0D1B4B", color: "#C9A227" }}
                >
                  MM
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-[#0D1B4B]">Mun. Miraflores</div>
                  <div className="text-xs text-gray-400">Administrador</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1
              className="text-[#0D1B4B]"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: "1.5rem" }}
            >
              Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">Resumen de recaudación — Junio 2026</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, i) => (
              <div
                key={i}
                className="bg-white p-5"
                style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-gray-400">{kpi.label}</span>
                  {kpi.trend > 0 ? (
                    <TrendingUp size={16} style={{ color: "#16A34A" }} />
                  ) : (
                    <TrendingDown size={16} style={{ color: "#DC2626" }} />
                  )}
                </div>
                <div
                  className="mb-1"
                  style={{
                    color: "#0D1B4B",
                    fontFamily: "Lora, serif",
                    fontWeight: 700,
                    fontSize: "1.6rem",
                    lineHeight: 1,
                  }}
                >
                  {kpi.value}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span
                      className="text-xs font-medium mr-1"
                      style={{ color: kpi.trend > 0 ? "#16A34A" : "#DC2626" }}
                    >
                      {kpi.trend > 0 ? "+" : ""}
                      {kpi.trend}%
                    </span>
                    <span className="text-xs text-gray-400">{kpi.subtitle}</span>
                  </div>
                  <MiniSparkline data={kpi.sparkline} />
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div
            className="bg-white p-6 mb-6"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-[#0D1B4B]"
                  style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.1rem" }}
                >
                  Recaudación mensual vs. Meta
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">Enero – Diciembre 2026 (S/ soles)</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={monthlyData}
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `S/ ${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`S/ ${value.toLocaleString("es-PE")}`, undefined]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Line
                  type="monotone"
                  dataKey="recaudacion"
                  name="Recaudación"
                  stroke="#0D1B4B"
                  strokeWidth={2.5}
                  dot={{ fill: "#0D1B4B", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  name="Meta"
                  stroke="#C9A227"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Transactions Table */}
          <div
            className="bg-white"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
              <h2
                className="text-[#0D1B4B]"
                style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1rem" }}
              >
                Transacciones recientes
              </h2>
              <button
                onClick={() => navigate("admin-contribuyentes")}
                className="text-xs font-medium transition-colors hover:text-[#C9A227]"
                style={{ color: "#0D1B4B" }}
              >
                Ver todas →
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                    {["Contribuyente", "Tributo", "Monto", "Fecha", "Estado"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "#6B7280" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      className="transition-colors hover:bg-[#F9FAFB]"
                      style={{ borderBottom: idx < recentTransactions.length - 1 ? "1px solid #F9FAFB" : "none" }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "#E0E7FF", color: "#0D1B4B" }}
                          >
                            {tx.contribuyente.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="text-sm text-gray-800">{tx.contribuyente}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{tx.tributo}</td>
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                        S/ {tx.monto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{tx.fecha}</td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs px-2.5 py-1 font-medium"
                          style={{
                            background: statusStyles[tx.estado].bg,
                            color: statusStyles[tx.estado].text,
                            borderRadius: 9999,
                          }}
                        >
                          {tx.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden divide-y divide-gray-50">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: "#E0E7FF", color: "#0D1B4B" }}
                      >
                        {tx.contribuyente.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium" style={{ color: "#0D1B4B" }}>
                        {tx.contribuyente}
                      </span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 font-medium"
                      style={{
                        background: statusStyles[tx.estado].bg,
                        color: statusStyles[tx.estado].text,
                        borderRadius: 9999,
                      }}
                    >
                      {tx.estado}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{tx.tributo}</span>
                    <span className="font-semibold" style={{ color: "#0D1B4B" }}>
                      S/ {tx.monto.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-40 flex"
        style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.10)" }}
      >
        {[
          { icon: LayoutDashboard, label: "Dashboard", view: "admin-dashboard" as View },
          { icon: Users, label: "Contribuyentes", view: "admin-contribuyentes" as View },
          { icon: Bell, label: "Alertas", view: "notifications" as View },
          { icon: Home, label: "Inicio", view: "landing" as View },
        ].map(({ icon: Icon, label, view }) => (
          <button
            key={label}
            onClick={() => navigate(view)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors"
            style={{ color: view === "admin-dashboard" ? "#0D1B4B" : "#9CA3AF" }}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
