import { useState } from "react";
import { ArrowLeft, Bell, AlertTriangle, CheckCircle, Info, ChevronUp, ChevronDown, X } from "lucide-react";
import type { View } from "../App";

interface Props {
  navigate: (v: View) => void;
}

type NotifType = "vencimiento" | "pago" | "alerta" | "info";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "vencimiento",
    title: "Vencimiento próximo — Arbitrios Q2",
    description: "Tu pago de Arbitrios Municipales Q2 2024 vence en 7 días. Monto: S/ 240.00.",
    date: "Hoy, 9:15 AM",
    read: false,
  },
  {
    id: "2",
    type: "pago",
    title: "Pago registrado exitosamente",
    description: "Tu pago de Impuesto Predial 2024 por S/ 420.00 fue confirmado. Ref: TF-2024-001847.",
    date: "Ayer, 3:42 PM",
    read: false,
  },
  {
    id: "3",
    type: "alerta",
    title: "Deuda vencida — Impuesto Predial",
    description: "Tu Impuesto Predial 2024 venció el 28/02/2024. Se aplicarán recargos por mora.",
    date: "22 Jun 2024",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Nueva funcionalidad disponible",
    description: "Ahora puedes pagar con Plin directamente desde la plataforma. Pruébalo hoy.",
    date: "20 Jun 2024",
    read: true,
  },
  {
    id: "5",
    type: "vencimiento",
    title: "Vencimiento próximo — Licencia Comercial",
    description: "Tu Licencia de Funcionamiento 2025 vence el 31 de julio. Renuévala con anticipación.",
    date: "18 Jun 2024",
    read: true,
  },
  {
    id: "6",
    type: "pago",
    title: "Comprobante disponible",
    description: "El comprobante de tu pago de Arbitrios Q1 2024 está listo para descargar.",
    date: "15 Jun 2024",
    read: true,
  },
  {
    id: "7",
    type: "alerta",
    title: "Intento de acceso no reconocido",
    description: "Detectamos un acceso a tu cuenta desde un dispositivo nuevo. Verifica tu actividad.",
    date: "10 Jun 2024",
    read: true,
  },
];

type Filter = "Todas" | "Vencimientos" | "Pagos" | "Alertas";

const filterMap: Record<Filter, NotifType[]> = {
  Todas: ["vencimiento", "pago", "alerta", "info"],
  Vencimientos: ["vencimiento"],
  Pagos: ["pago"],
  Alertas: ["alerta"],
};

const typeIcon: Record<NotifType, JSX.Element> = {
  vencimiento: <Bell size={18} style={{ color: "#C9A227" }} />,
  pago: <CheckCircle size={18} style={{ color: "#16A34A" }} />,
  alerta: <AlertTriangle size={18} style={{ color: "#DC2626" }} />,
  info: <Info size={18} style={{ color: "#2563EB" }} />,
};

const typeColor: Record<NotifType, string> = {
  vencimiento: "#FEF3C7",
  pago: "#DCFCE7",
  alerta: "#FEE2E2",
  info: "#DBEAFE",
};

function NotifCard({ notif, onClick, active }: { notif: Notification; onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 transition-all"
      style={{
        background: active ? "rgba(13,27,75,0.05)" : notif.read ? "#fff" : "rgba(201,162,39,0.06)",
        borderRadius: 8,
        border: `1px solid ${active ? "#0D1B4B" : "#F3F4F6"}`,
        boxShadow: active ? "0 2px 8px rgba(0,0,0,0.10)" : "none",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: typeColor[notif.type] }}
        >
          {typeIcon[notif.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-sm"
              style={{
                color: "#0D1B4B",
                fontWeight: notif.read ? 400 : 600,
                lineHeight: 1.4,
              }}
            >
              {notif.title}
            </span>
            {!notif.read && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                style={{ background: "#C9A227" }}
              />
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">{notif.date}</div>
          {active && (
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{notif.description}</p>
          )}
        </div>
      </div>
    </button>
  );
}

export function NotificationsPage({ navigate }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todas");
  const [selectedId, setSelectedId] = useState<string>("1");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = notifications.filter((n) =>
    filterMap[activeFilter].includes(n.type)
  );

  const selected = notifications.find((n) => n.id === selectedId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F4F6FC] flex flex-col">
      {/* Header */}
      <header
        className="bg-white sticky top-0 z-50"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("landing")}
            className="p-1.5 text-[#0D1B4B] hover:text-[#C9A227] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "#0D1B4B" }}
            >
              <span style={{ color: "#C9A227", fontSize: 12, fontWeight: 700 }}>TF</span>
            </div>
            <span
              className="text-[#0D1B4B]"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: 18 }}
            >
              Tributa<span style={{ color: "#C9A227" }}>Fácil</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-xs px-2 py-1 rounded-full font-medium"
              style={{ background: "#0D1B4B", color: "#C9A227" }}
            >
              {unreadCount} nuevas
            </span>
          </div>
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          <div>
            <h1
              className="text-[#0D1B4B] mb-1"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: "1.4rem" }}
            >
              Notificaciones
            </h1>
            <p className="text-gray-400 text-sm">{filtered.length} mensajes en esta vista</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {(["Todas", "Vencimientos", "Pagos", "Alertas"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: activeFilter === f ? "#0D1B4B" : "#fff",
                  color: activeFilter === f ? "#C9A227" : "#6B7280",
                  borderRadius: 9999,
                  border: `1px solid ${activeFilter === f ? "#0D1B4B" : "#E5E7EB"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 240px)" }}>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No hay notificaciones en esta categoría
              </div>
            ) : (
              filtered.map((n) => (
                <NotifCard
                  key={n.id}
                  notif={n}
                  onClick={() => setSelectedId(n.id)}
                  active={selectedId === n.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Main Detail Panel */}
        <div className="flex-1">
          {selected ? (
            <div
              className="bg-white p-8 h-full"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)", minHeight: 400 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: typeColor[selected.type] }}
                >
                  {typeIcon[selected.type]}
                </div>
                <div className="flex-1">
                  <h2
                    className="text-[#0D1B4B] mb-1"
                    style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.15rem" }}
                  >
                    {selected.title}
                  </h2>
                  <span className="text-sm text-gray-400">{selected.date}</span>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>

              {selected.type === "vencimiento" && (
                <button
                  onClick={() => navigate("payment")}
                  className="px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-90"
                  style={{ background: "#C9A227", color: "#0D1B4B", borderRadius: 4 }}
                >
                  Pagar ahora
                </button>
              )}
              {selected.type === "pago" && (
                <button
                  className="px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-90 text-white"
                  style={{ background: "#0D1B4B", borderRadius: 4 }}
                >
                  Descargar comprobante
                </button>
              )}
            </div>
          ) : (
            <div
              className="bg-white p-8 flex flex-col items-center justify-center"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)", minHeight: 400 }}
            >
              <Bell size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">Selecciona una notificación para ver los detalles</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1
              className="text-[#0D1B4B]"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: "1.3rem" }}
            >
              Notificaciones
            </h1>
            <p className="text-gray-400 text-xs mt-0.5">{unreadCount} sin leer</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {(["Todas", "Vencimientos", "Pagos", "Alertas"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-3 py-1.5 text-xs font-medium transition-all flex-shrink-0"
              style={{
                background: activeFilter === f ? "#0D1B4B" : "#fff",
                color: activeFilter === f ? "#C9A227" : "#6B7280",
                borderRadius: 9999,
                border: `1px solid ${activeFilter === f ? "#0D1B4B" : "#E5E7EB"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 transition-all"
              style={{
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: `1px solid ${!n.read ? "rgba(201,162,39,0.3)" : "#F3F4F6"}`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: typeColor[n.type] }}
                >
                  {typeIcon[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="text-sm"
                      style={{ color: "#0D1B4B", fontWeight: n.read ? 400 : 600, lineHeight: 1.4 }}
                    >
                      {n.title}
                    </span>
                    {!n.read && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{ background: "#C9A227" }}
                      />
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 mb-2">{n.date}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{n.description}</p>
                  {n.type === "vencimiento" && (
                    <button
                      onClick={() => navigate("payment")}
                      className="mt-3 px-4 py-1.5 text-xs font-semibold"
                      style={{ background: "#C9A227", color: "#0D1B4B", borderRadius: 4 }}
                    >
                      Pagar ahora
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sticky Bottom CTA */}
      <div
        className="md:hidden sticky bottom-0 bg-white px-4 py-3"
        style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.08)" }}
      >
        <button
          onClick={() => navigate("payment")}
          className="w-full py-3 font-semibold text-sm"
          style={{ background: "#C9A227", color: "#0D1B4B", borderRadius: 4 }}
        >
          Ir a pagar mis tributos
        </button>
      </div>
    </div>
  );
}
