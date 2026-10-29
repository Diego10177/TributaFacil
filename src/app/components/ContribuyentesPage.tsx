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
  SlidersHorizontal,
  Eye,
  Send,
  Menu,
  X,
  Home,
  ChevronDown,
} from "lucide-react";
import type { View } from "../App";

interface Props {
  navigate: (v: View) => void;
}

interface Contribuyente {
  id: string;
  nombre: string;
  dni: string;
  distrito: string;
  tributosPendientes: number;
  montoTotal: number;
  estado: "Al día" | "Pendiente" | "Moroso";
}

const allContribuyentes: Contribuyente[] = [
  { id: "C001", nombre: "María García Ruiz", dni: "12345678", distrito: "Miraflores", tributosPendientes: 0, montoTotal: 0, estado: "Al día" },
  { id: "C002", nombre: "Carlos López Vega", dni: "23456789", distrito: "San Isidro", tributosPendientes: 2, montoTotal: 427.5, estado: "Pendiente" },
  { id: "C003", nombre: "Ana Rodríguez Salinas", dni: "34567890", distrito: "Miraflores", tributosPendientes: 0, montoTotal: 0, estado: "Al día" },
  { id: "C004", nombre: "Juan Pérez Torres", dni: "45678901", distrito: "Surco", tributosPendientes: 3, montoTotal: 980.0, estado: "Moroso" },
  { id: "C005", nombre: "Rosa Mendoza Flores", dni: "56789012", distrito: "La Molina", tributosPendientes: 1, montoTotal: 210.0, estado: "Pendiente" },
  { id: "C006", nombre: "Luis Torres Castillo", dni: "67890123", distrito: "Miraflores", tributosPendientes: 2, montoTotal: 640.0, estado: "Moroso" },
  { id: "C007", nombre: "Sofía Castro Ríos", dni: "78901234", distrito: "San Isidro", tributosPendientes: 0, montoTotal: 0, estado: "Al día" },
  { id: "C008", nombre: "Pedro Díaz Morales", dni: "89012345", distrito: "Surco", tributosPendientes: 1, montoTotal: 320.0, estado: "Pendiente" },
  { id: "C009", nombre: "Carmen Vargas Huanca", dni: "90123456", distrito: "La Molina", tributosPendientes: 4, montoTotal: 1250.0, estado: "Moroso" },
  { id: "C010", nombre: "Roberto Silva Quispe", dni: "01234567", distrito: "Miraflores", tributosPendientes: 0, montoTotal: 0, estado: "Al día" },
  { id: "C011", nombre: "Elena Fuentes Poma", dni: "11234567", distrito: "Surco", tributosPendientes: 1, montoTotal: 187.5, estado: "Pendiente" },
  { id: "C012", nombre: "Miguel Ángel Rojas", dni: "22345678", distrito: "San Isidro", tributosPendientes: 0, montoTotal: 0, estado: "Al día" },
];

const distritos = ["Todos", "Miraflores", "San Isidro", "Surco", "La Molina"];
const estadoOptions = ["Todos", "Al día", "Pendiente", "Moroso"];
const PAGE_SIZE = 8;

const statusStyles: Record<string, { bg: string; text: string }> = {
  "Al día": { bg: "#DCFCE7", text: "#166534" },
  Pendiente: { bg: "#FEF3C7", text: "#92400E" },
  Moroso: { bg: "#FEE2E2", text: "#991B1B" },
};

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", view: "admin-dashboard" as View },
  { icon: Users, label: "Contribuyentes", view: "admin-contribuyentes" as View },
  { icon: Wallet, label: "Recaudación", view: null },
  { icon: Bell, label: "Notificaciones", view: "notifications" as View },
  { icon: FileBarChart, label: "Reportes", view: null },
  { icon: Settings, label: "Configuración", view: null },
];

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
      style={{ width: collapsed ? 64 : 220, background: "#0D1B4B", overflow: "hidden" }}
    >
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

      <button
        onClick={onToggle}
        className="flex items-center justify-center py-3 transition-colors"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <button
        onClick={() => navigate("landing")}
        className="flex items-center gap-2 px-4 py-3 text-xs mb-1"
        style={{ color: "rgba(255,255,255,0.35)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        title={collapsed ? "Portal ciudadano" : undefined}
      >
        <Home size={16} className="flex-shrink-0" />
        {!collapsed && <span className="whitespace-nowrap">Portal ciudadano</span>}
      </button>
    </aside>
  );
}

function SelectFilter({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm focus:outline-none cursor-pointer"
        style={{
          border: "1.5px solid #E5E7EB",
          borderRadius: 4,
          background: "#fff",
          color: "#374151",
          minWidth: 130,
        }}
        onFocus={(e) => (e.target.style.borderColor = "#0D1B4B")}
        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "Todos" ? placeholder : o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
      />
    </div>
  );
}

export function ContribuyentesPage({ navigate }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterDistrito, setFilterDistrito] = useState("Todos");
  const [page, setPage] = useState(1);
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  const filtered = allContribuyentes.filter((c) => {
    const matchSearch =
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.dni.includes(search);
    const matchEstado = filterEstado === "Todos" || c.estado === filterEstado;
    const matchDistrito = filterDistrito === "Todos" || c.distrito === filterDistrito;
    return matchSearch && matchEstado && matchDistrito;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleNotify = (id: string) => {
    setNotifiedId(id);
    setTimeout(() => setNotifiedId(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6FC]">
      {/* Desktop Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        navigate={navigate}
        currentView="admin-contribuyentes"
      />

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
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
              <Home size={16} /> Portal ciudadano
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header
          className="bg-white sticky top-0 z-40"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <div className="px-4 sm:px-6 h-16 flex items-center gap-4">
            <button
              className="md:hidden p-1.5 text-[#0D1B4B]"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="relative flex-1 max-w-xs">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar contribuyente..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2 text-sm focus:outline-none placeholder-gray-400"
                style={{ border: "1.5px solid #E5E7EB", borderRadius: 4, background: "#F4F6FC", color: "#0D1B4B" }}
                onFocus={(e) => (e.target.style.borderColor = "#0D1B4B")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={() => navigate("notifications")}
                className="relative p-2 text-[#0D1B4B] hover:text-[#C9A227] transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
              </button>
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: "#0D1B4B", color: "#C9A227" }}
                >
                  MM
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium" style={{ color: "#0D1B4B" }}>Mun. Miraflores</div>
                  <div className="text-xs text-gray-400">Administrador</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 sm:px-6 py-6 pb-20 md:pb-6 overflow-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1
                className="text-[#0D1B4B]"
                style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: "1.5rem" }}
              >
                Contribuyentes
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {filtered.length} contribuyente{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <SlidersHorizontal size={14} />
                <span>Filtros:</span>
              </div>
              <SelectFilter
                value={filterEstado}
                options={estadoOptions}
                onChange={(v) => { setFilterEstado(v); setPage(1); }}
                placeholder="Estado"
              />
              <SelectFilter
                value={filterDistrito}
                options={distritos}
                onChange={(v) => { setFilterDistrito(v); setPage(1); }}
                placeholder="Distrito"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div
            className="hidden md:block bg-white mb-4"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                    {["Contribuyente", "DNI", "Distrito", "Tributos pendientes", "Monto total", "Estado", "Acciones"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
                        style={{ color: "#6B7280" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-gray-400 text-sm">
                        No se encontraron contribuyentes con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((c, idx) => (
                      <tr
                        key={c.id}
                        className="transition-colors hover:bg-[#F9FAFB]"
                        style={{ borderBottom: idx < paginated.length - 1 ? "1px solid #F9FAFB" : "none" }}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: "#E0E7FF", color: "#0D1B4B" }}
                            >
                              {c.nombre.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                            </div>
                            <span className="text-sm font-medium" style={{ color: "#111827" }}>
                              {c.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{c.dni}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">{c.distrito}</td>
                        <td className="px-5 py-3.5 text-sm text-center" style={{ color: c.tributosPendientes > 0 ? "#DC2626" : "#16A34A" }}>
                          <span className="font-semibold">{c.tributosPendientes}</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                          {c.montoTotal > 0 ? `S/ ${c.montoTotal.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="text-xs px-2.5 py-1 font-medium"
                            style={{
                              background: statusStyles[c.estado].bg,
                              color: statusStyles[c.estado].text,
                              borderRadius: 9999,
                            }}
                          >
                            {c.estado}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 transition-colors hover:text-[#0D1B4B] text-gray-400"
                              title="Ver perfil"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleNotify(c.id)}
                              className="p-1.5 transition-colors hover:text-[#C9A227] text-gray-400"
                              title="Notificar"
                            >
                              {notifiedId === c.id ? (
                                <span className="text-xs" style={{ color: "#16A34A" }}>¡Enviado!</span>
                              ) : (
                                <Send size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 mb-4">
            {paginated.length === 0 ? (
              <div
                className="bg-white p-10 text-center text-gray-400 text-sm"
                style={{ borderRadius: 8 }}
              >
                No se encontraron resultados.
              </div>
            ) : (
              paginated.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-4"
                  style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "#E0E7FF", color: "#0D1B4B" }}
                      >
                        {c.nombre.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                          {c.nombre}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">{c.dni}</div>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 font-medium"
                      style={{
                        background: statusStyles[c.estado].bg,
                        color: statusStyles[c.estado].text,
                        borderRadius: 9999,
                      }}
                    >
                      {c.estado}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs mt-3 pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
                    <div>
                      <div className="text-gray-400 mb-0.5">Distrito</div>
                      <div className="font-medium text-gray-700">{c.distrito}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-0.5">Pendientes</div>
                      <div className="font-semibold" style={{ color: c.tributosPendientes > 0 ? "#DC2626" : "#16A34A" }}>
                        {c.tributosPendientes}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 mb-0.5">Monto</div>
                      <div className="font-semibold" style={{ color: "#0D1B4B" }}>
                        {c.montoTotal > 0 ? `S/ ${c.montoTotal.toFixed(2)}` : "—"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 py-1.5 text-xs font-medium flex items-center justify-center gap-1.5"
                      style={{ border: "1px solid #E5E7EB", borderRadius: 4, color: "#374151" }}
                    >
                      <Eye size={13} /> Ver
                    </button>
                    <button
                      onClick={() => handleNotify(c.id)}
                      className="flex-1 py-1.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      style={{
                        border: `1px solid ${notifiedId === c.id ? "#16A34A" : "#E5E7EB"}`,
                        borderRadius: 4,
                        color: notifiedId === c.id ? "#16A34A" : "#374151",
                      }}
                    >
                      <Send size={13} />
                      {notifiedId === c.id ? "¡Enviado!" : "Notificar"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                Página {page} de {totalPages} — {filtered.length} resultados
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 transition-colors disabled:opacity-30"
                  style={{ border: "1px solid #E5E7EB", borderRadius: 4, color: "#374151" }}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 text-sm font-medium transition-colors"
                      style={{
                        borderRadius: 4,
                        background: page === p ? "#0D1B4B" : "#fff",
                        color: page === p ? "#C9A227" : "#374151",
                        border: `1px solid ${page === p ? "#0D1B4B" : "#E5E7EB"}`,
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 transition-colors disabled:opacity-30"
                  style={{ border: "1px solid #E5E7EB", borderRadius: 4, color: "#374151" }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
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
            style={{ color: view === "admin-contribuyentes" ? "#0D1B4B" : "#9CA3AF" }}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
