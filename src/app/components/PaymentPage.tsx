import { useState } from "react";
import { ArrowLeft, Check, CheckCircle, Download, Copy } from "lucide-react";
import type { View } from "../App";

interface Props {
  navigate: (v: View) => void;
}

const allDebts = [
  { id: "1", tipo: "Impuesto Predial", periodo: "2024", monto: 420.0, estado: "Vencido" as const },
  { id: "2", tipo: "Arbitrios Municipales Q1", periodo: "2024 Q1", monto: 187.5, estado: "Pendiente" as const },
  { id: "3", tipo: "Arbitrios Municipales Q2", periodo: "2024 Q2", monto: 240.0, estado: "Pendiente" as const },
];

const paymentMethods = [
  { id: "visa", label: "Visa / Mastercard", sublabel: "Tarjeta de crédito/débito", emoji: "💳" },
  { id: "yape", label: "Yape", sublabel: "Pago móvil", emoji: "📱" },
  { id: "plin", label: "Plin", sublabel: "Pago móvil", emoji: "📲" },
];

function StepDot({ num, label, status }: { num: number; label: string; status: "done" | "active" | "pending" }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
        style={{
          background: status === "done" ? "#16A34A" : status === "active" ? "#0D1B4B" : "#E5E7EB",
          color: status === "pending" ? "#9CA3AF" : "#fff",
          transition: "all 0.2s",
        }}
      >
        {status === "done" ? <Check size={16} /> : num}
      </div>
      <span
        className="mt-1.5 text-xs whitespace-nowrap"
        style={{
          color: status === "active" ? "#0D1B4B" : "#9CA3AF",
          fontWeight: status === "active" ? 600 : 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function PaymentPage({ navigate }: Props) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>(["1", "2", "3"]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [copied, setCopied] = useState(false);

  const refNumber = "TF-2024-001847";

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const total = allDebts
    .filter((d) => selected.includes(d.id))
    .reduce((sum, d) => sum + d.monto, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(refNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stepStatus = (n: number): "done" | "active" | "pending" =>
    step > n ? "done" : step === n ? "active" : "pending";

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      {/* Header */}
      <header
        className="bg-white sticky top-0 z-50"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => (step === 1 ? navigate("deuda") : setStep(step - 1))}
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
          <span className="text-gray-400 text-sm ml-auto">Pago seguro</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10">
          {[
            { n: 1, label: "Selección" },
            { n: 2, label: "Confirmar" },
            { n: 3, label: "Comprobante" },
          ].map(({ n, label }, idx) => (
            <div key={n} className="flex items-center">
              <StepDot num={n} label={label} status={stepStatus(n)} />
              {idx < 2 && (
                <div
                  className="w-20 sm:w-28 h-0.5 mb-5 mx-2"
                  style={{ background: step > n ? "#16A34A" : "#E5E7EB", transition: "all 0.3s" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 – Selection */}
        {step === 1 && (
          <div
            className="bg-white p-6 sm:p-8"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
          >
            <h2
              className="text-[#0D1B4B] mb-6"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.35rem" }}
            >
              Selecciona los tributos a pagar
            </h2>

            <div className="space-y-3 mb-6">
              {allDebts.map((debt) => {
                const checked = selected.includes(debt.id);
                return (
                  <label
                    key={debt.id}
                    className="flex items-center gap-4 p-4 cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${checked ? "#0D1B4B" : "#F3F4F6"}`,
                      borderRadius: 8,
                      background: checked ? "rgba(13,27,75,0.04)" : "#fff",
                    }}
                  >
                    <div
                      className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                      style={{
                        border: `2px solid ${checked ? "#0D1B4B" : "#D1D5DB"}`,
                        borderRadius: 4,
                        background: checked ? "#0D1B4B" : "#fff",
                        transition: "all 0.15s",
                      }}
                      onClick={() => toggle(debt.id)}
                    >
                      {checked && <Check size={12} color="#C9A227" strokeWidth={3} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(debt.id)}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                        {debt.tipo}
                      </div>
                      <div className="text-xs text-gray-400">{debt.periodo}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold" style={{ color: "#0D1B4B" }}>
                        S/ {debt.monto.toFixed(2)}
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: debt.estado === "Vencido" ? "#FEE2E2" : "#FEF3C7",
                          color: debt.estado === "Vencido" ? "#991B1B" : "#92400E",
                        }}
                      >
                        {debt.estado}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div
              className="pt-4 flex items-center justify-between mb-6"
              style={{ borderTop: "1px solid #F3F4F6" }}
            >
              <div>
                <span className="text-sm text-gray-400">Total a pagar:</span>
                <div
                  className="font-bold"
                  style={{ color: "#0D1B4B", fontSize: "1.6rem", fontFamily: "Lora, serif" }}
                >
                  S/ {total.toFixed(2)}
                </div>
              </div>
              <span className="text-xs text-gray-400">{selected.length} tributo(s)</span>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={selected.length === 0}
              className="w-full py-3.5 font-semibold transition-colors"
              style={{
                background: selected.length === 0 ? "#9CA3AF" : "#0D1B4B",
                color: selected.length === 0 ? "#fff" : "#C9A227",
                borderRadius: 4,
                cursor: selected.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Continuar al pago
            </button>
          </div>
        )}

        {/* Step 2 – Confirm */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Summary */}
            <div
              className="bg-white p-6 sm:p-8"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
            >
              <h2
                className="text-[#0D1B4B] mb-5"
                style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.35rem" }}
              >
                Resumen del pago
              </h2>
              <div className="space-y-0">
                {allDebts
                  .filter((d) => selected.includes(d.id))
                  .map((debt, idx, arr) => (
                    <div
                      key={debt.id}
                      className="flex justify-between items-center py-3"
                      style={{ borderBottom: idx < arr.length - 1 ? "1px solid #F9FAFB" : "none" }}
                    >
                      <div>
                        <div className="text-sm text-gray-700">{debt.tipo}</div>
                        <div className="text-xs text-gray-400">{debt.periodo}</div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                        S/ {debt.monto.toFixed(2)}
                      </span>
                    </div>
                  ))}
                <div
                  className="flex justify-between items-center pt-3 mt-1"
                  style={{ borderTop: "2px solid #F3F4F6" }}
                >
                  <span className="text-sm font-semibold text-gray-600">Total</span>
                  <span
                    className="font-bold"
                    style={{ color: "#0D1B4B", fontSize: "1.2rem", fontFamily: "Lora, serif" }}
                  >
                    S/ {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className="bg-white p-6 sm:p-8"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
            >
              <h3
                className="text-[#0D1B4B] mb-4"
                style={{ fontWeight: 600, fontSize: "1rem" }}
              >
                Método de pago
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => {
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className="flex flex-col items-center gap-2 p-4 transition-all"
                      style={{
                        border: `2px solid ${active ? "#0D1B4B" : "#F3F4F6"}`,
                        borderRadius: 8,
                        background: active ? "rgba(13,27,75,0.04)" : "#fff",
                      }}
                    >
                      <span style={{ fontSize: 28 }}>{method.emoji}</span>
                      <span className="text-sm font-semibold" style={{ color: "#0D1B4B" }}>
                        {method.label}
                      </span>
                      <span className="text-xs text-gray-400">{method.sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3.5 text-sm text-gray-500 transition-colors hover:bg-gray-50"
                style={{ border: "1.5px solid #E5E7EB", borderRadius: 4 }}
              >
                Volver
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!paymentMethod}
                className="flex-1 py-3.5 font-bold transition-colors"
                style={{
                  background: paymentMethod ? "#C9A227" : "#E5E7EB",
                  color: paymentMethod ? "#0D1B4B" : "#9CA3AF",
                  borderRadius: 4,
                  cursor: paymentMethod ? "pointer" : "not-allowed",
                }}
              >
                Pagar S/ {total.toFixed(2)}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 – Success */}
        {step === 3 && (
          <div
            className="bg-white p-10 sm:p-14 text-center"
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#DCFCE7" }}
            >
              <CheckCircle size={40} style={{ color: "#16A34A" }} />
            </div>
            <h2
              className="text-[#0D1B4B] mb-2"
              style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 700, fontSize: "1.75rem" }}
            >
              Pago exitoso
            </h2>
            <p className="text-gray-400 mb-2">
              Tu pago de <strong style={{ color: "#0D1B4B" }}>S/ {total.toFixed(2)}</strong> ha sido procesado correctamente.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Recibirás una confirmación en tu correo electrónico registrado.
            </p>

            {/* Reference */}
            <div
              className="inline-flex items-center gap-3 px-6 py-3 mb-8"
              style={{ background: "#F4F6FC", borderRadius: 4 }}
            >
              <div className="text-left">
                <div className="text-xs text-gray-400 mb-0.5">Número de referencia</div>
                <div
                  className="font-mono font-bold tracking-wide"
                  style={{ color: "#0D1B4B", fontSize: "1rem" }}
                >
                  {refNumber}
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="p-1.5 text-gray-400 hover:text-[#0D1B4B] transition-colors"
                title="Copiar"
              >
                <Copy size={16} />
              </button>
              {copied && (
                <span className="text-xs" style={{ color: "#16A34A" }}>
                  ¡Copiado!
                </span>
              )}
            </div>

            <div className="space-y-3">
              <button
                className="w-full py-3.5 flex items-center justify-center gap-2 font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "#0D1B4B", borderRadius: 4 }}
              >
                <Download size={18} />
                Descargar comprobante
              </button>
              <button
                onClick={() => navigate("landing")}
                className="w-full py-3.5 text-sm transition-colors hover:text-[#C9A227]"
                style={{ color: "#0D1B4B" }}
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
