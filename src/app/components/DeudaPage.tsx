import { useState } from "react";
import { Search, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import type { View } from "../App";

interface Props {
  navigate: (v: View) => void;
}

type DebtStatus = "Pendiente" | "Vencido" | "Pagado";

interface Debt {
  id: string;
  tipo: string;
  periodo: string;
  monto: number;
  vencimiento: string;
  estado: DebtStatus;
}

const mockDebts: Debt[] = [
  { id: "1", tipo: "Impuesto Predial", periodo: "2024", monto: 420.0, vencimiento: "28/02/2024", estado: "Vencido" },
  { id: "2", tipo: "Arbitrios Municipales", periodo: "2024 Q1", monto: 187.5, vencimiento: "31/03/2024", estado: "Pendiente" },
  { id: "3", tipo: "Arbitrios Municipales", periodo: "2024 Q2", monto: 240.0, vencimiento: "30/06/2024", estado: "Pendiente" },
  { id: "4", tipo: "Licencia de Funcionamiento", periodo: "2023", monto: 350.0, vencimiento: "31/12/2023", estado: "Pagado" },
];

const municipalidades = [
  "Municipalidad de Lima",
  "Municipalidad de Miraflores",
  "Municipalidad de San Isidro",
  "Municipalidad de Surco",
  "Municipalidad de La Molina",
  "Municipalidad del Callao",
];

const statusStyles: Record<DebtStatus, { bg: string; text: string }> = {
  Pendiente: { bg: "#FEF3C7", text: "#92400E" },
  Vencido: { bg: "#FEE2E2", text: "#991B1B" },
  Pagado: { bg: "#DCFCE7", text: "#166534" },
};

function StatusBadge({ estado }: { estado: DebtStatus }) {
  const s = statusStyles[estado];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text, borderRadius: 9999 }}
    >
      {estado}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div
      className="bg-white p-4 animate-pulse"
      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

export function DeudaPage({ navigate }: Props) {
  const [dni, setDni] = useState("");
  const [municipalidad, setMunicipalidad] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [debts, setDebts] = useState<Debt[]>([]);

  const handleSearch = () => {
    if (!dni || !municipalidad) return;
    setLoading(true);
    setSearched(false);
    setTimeout(() => {
      setDebts(mockDebts);
      setLoading(false);
      setSearched(true);
    }, 1500);
  };

  const pending = debts.filter((d) => d.estado !== "Pagado");
  const totalPending = pending.reduce((sum, d) => sum + d.monto, 0);

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
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
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Search Card */}
        <div
          className="bg-white p-8 max-w-[560px] mx-auto"
          style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
        >
          <h1
            className="text-[#0D1B4B] mb-2 text-center"
            style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: "1.75rem" }}
          >
            Consulta tu deuda tributaria
          </h1>
          <p className="text-gray-400 text-sm text-center mb-8">
            Ingresa tu DNI y selecciona tu municipalidad para ver tus tributos pendientes.
          </p>

          <div className="space-y-4">
            {/* DNI Input */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="DNI o Código de Contribuyente"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-3.5 text-[#0D1B4B] placeholder-gray-400 focus:outline-none transition-all"
                style={{
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 4,
                  background: "#F4F6FC",
                  fontSize: 15,
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0D1B4B")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>

            {/* Municipalidad Select */}
            <div className="relative">
              <select
                value={municipalidad}
                onChange={(e) => setMunicipalidad(e.target.value)}
                className="w-full px-4 py-3.5 text-[#0D1B4B] focus:outline-none appearance-none cursor-pointer transition-all"
                style={{
                  border: "1.5px solid #E5E7EB",
                  borderRadius: 4,
                  background: "#F4F6FC",
                  fontSize: 15,
                  color: municipalidad ? "#0D1B4B" : "#9CA3AF",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#0D1B4B")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              >
                <option value="">Selecciona tu municipalidad</option>
                {municipalidades.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0D1B4B"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={!dni || !municipalidad || loading}
              className="w-full py-3.5 font-semibold transition-colors"
              style={{
                background: !dni || !municipalidad || loading ? "#9CA3AF" : "#0D1B4B",
                color: !dni || !municipalidad || loading ? "#fff" : "#C9A227",
                borderRadius: 4,
                cursor: !dni || !municipalidad || loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Buscando..." : "Buscar deuda"}
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-8 space-y-3 max-w-[560px] mx-auto">
            {[1, 2, 3].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* Results */}
        {searched && !loading && debts.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4 max-w-[560px] mx-auto md:max-w-none">
              <h2
                className="text-[#0D1B4B]"
                style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.25rem" }}
              >
                Resultado de búsqueda
              </h2>
              <span className="text-sm text-gray-400">{pending.length} tributo(s) pendiente(s)</span>
            </div>

            {/* Desktop Table */}
            <div
              className="hidden md:block bg-white overflow-hidden"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
            >
              <table className="w-full">
                <thead>
                  <tr style={{ background: "#F4F6FC", borderBottom: "1px solid #F3F4F6" }}>
                    {["Tipo de tributo", "Periodo", "Monto", "Vencimiento", "Estado"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "#0D1B4B" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt, idx) => (
                    <tr
                      key={debt.id}
                      className="transition-colors hover:bg-[#F4F6FC]"
                      style={{ borderBottom: idx < debts.length - 1 ? "1px solid #F9FAFB" : "none" }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-800">{debt.tipo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{debt.periodo}</td>
                      <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                        S/ {debt.monto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{debt.vencimiento}</td>
                      <td className="px-6 py-4">
                        <StatusBadge estado={debt.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 max-w-[560px] mx-auto">
              {debts.map((debt) => (
                <div
                  key={debt.id}
                  className="bg-white p-4"
                  style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                      {debt.tipo}
                    </span>
                    <StatusBadge estado={debt.estado} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Periodo", value: debt.periodo },
                      { label: "Monto", value: `S/ ${debt.monto.toFixed(2)}` },
                      { label: "Vencimiento", value: debt.vencimiento },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: item.label === "Monto" ? "#0D1B4B" : "#374151" }}
                        >
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Total & CTA */}
            <div
              className="mt-6 bg-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-[560px] mx-auto md:max-w-none"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
            >
              <div>
                <span className="text-sm text-gray-400">Total pendiente:</span>
                <div
                  className="font-bold"
                  style={{ color: "#0D1B4B", fontSize: "1.5rem", fontFamily: "Lora, serif" }}
                >
                  S/ {totalPending.toFixed(2)}
                </div>
              </div>
              <button
                onClick={() => navigate("payment")}
                className="px-8 py-3 font-semibold transition-colors hover:opacity-90"
                style={{ background: "#C9A227", color: "#0D1B4B", borderRadius: 4 }}
              >
                Pagar ahora
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searched && !loading && debts.length === 0 && (
          <div
            className="mt-8 max-w-[560px] mx-auto bg-white p-12 text-center"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#DCFCE7" }}
            >
              <CheckCircle size={32} style={{ color: "#16A34A" }} />
            </div>
            <h3
              className="text-[#0D1B4B] mb-2"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600 }}
            >
              Sin deudas pendientes
            </h3>
            <p className="text-gray-400 text-sm">
              No encontramos tributos pendientes para el contribuyente consultado. ¡Estás al día!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
