import { useState } from "react";
import {
  Bell,
  FileText,
  Shield,
  ChevronRight,
  Menu,
  X,
  CheckCircle,
  CreditCard,
  Smartphone,
  TrendingDown,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import type { View } from "../App";

interface Props {
  navigate: (v: View) => void;
}

export function LandingPage({ navigate }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      {/* Navbar */}
      <header
        className="bg-white sticky top-0 z-50"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
              <div
                className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
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

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {[
                { label: "Inicio", view: null },
                { label: "Consultar Deuda", view: "deuda" as View },
                { label: "Pagar", view: "payment" as View },
                { label: "Ayuda", view: null },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.view && navigate(item.view)}
                  className="text-[#0D1B4B] text-sm transition-colors cursor-pointer hover:text-[#C9A227]"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                className="px-4 py-2 text-sm transition-colors hover:bg-[#C9A227]/10 rounded"
                style={{
                  border: "1.5px solid #C9A227",
                  color: "#C9A227",
                  borderRadius: 4,
                }}
              >
                Iniciar sesión
              </button>
              <button
                className="px-4 py-2 text-sm text-white transition-colors hover:opacity-90 rounded"
                style={{ background: "#0D1B4B", borderRadius: 4 }}
              >
                Registrarse
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 text-[#0D1B4B]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
            {[
              { label: "Inicio", view: null },
              { label: "Consultar Deuda", view: "deuda" as View },
              { label: "Pagar", view: "payment" as View },
              { label: "Ayuda", view: null },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.view) navigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-[#0D1B4B] text-sm py-2 hover:text-[#C9A227] transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                className="flex-1 px-4 py-2 text-sm"
                style={{ border: "1.5px solid #C9A227", color: "#C9A227", borderRadius: 4 }}
              >
                Iniciar sesión
              </button>
              <button
                className="flex-1 px-4 py-2 text-white text-sm"
                style={{ background: "#0D1B4B", borderRadius: 4 }}
              >
                Registrarse
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <h1
              className="text-[#0D1B4B] mb-6 leading-tight"
              style={{
                fontFamily: "Lora, Cambria, serif",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.2,
              }}
            >
              Paga tus tributos municipales desde cualquier lugar
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Consulta tu deuda, realiza pagos en línea y descarga tus comprobantes de forma rápida y segura. Sin filas, sin esperas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("deuda")}
                className="px-8 py-3.5 font-semibold text-[#0D1B4B] transition-colors hover:opacity-90"
                style={{
                  background: "#C9A227",
                  borderRadius: 4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
              >
                Consultar mi deuda
              </button>
              <button className="px-8 py-3.5 text-[#0D1B4B] flex items-center gap-2 hover:text-[#C9A227] transition-colors">
                Ver cómo funciona <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Right – Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone frame */}
              <div
                className="w-64 relative"
                style={{
                  height: 500,
                  background: "#0D1B4B",
                  borderRadius: 32,
                  padding: 12,
                  boxShadow: "0 16px 48px rgba(13,27,75,0.30)",
                }}
              >
                {/* Notch */}
                <div
                  className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full z-10"
                  style={{ background: "#0D1B4B" }}
                />
                <div
                  className="w-full h-full flex flex-col overflow-hidden"
                  style={{ background: "#F4F6FC", borderRadius: 24 }}
                >
                  {/* Status bar */}
                  <div
                    className="flex items-center justify-between px-4 py-2 flex-shrink-0"
                    style={{ background: "#0D1B4B" }}
                  >
                    <span className="text-white text-xs">9:41</span>
                    <div className="w-4 h-2.5 rounded-sm border border-white flex items-center px-0.5">
                      <div className="w-full h-1.5 bg-white rounded-sm" />
                    </div>
                  </div>

                  {/* App content */}
                  <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
                    {/* Balance card */}
                    <div
                      className="bg-white p-3 flex flex-col gap-0.5"
                      style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                    >
                      <div className="text-xs font-semibold" style={{ color: "#0D1B4B" }}>
                        Mi Deuda
                      </div>
                      <div
                        className="text-xl font-bold"
                        style={{ color: "#C9A227", fontFamily: "Lora, serif" }}
                      >
                        S/ 847.50
                      </div>
                      <div className="text-gray-400 text-xs">3 tributos pendientes</div>
                    </div>

                    {/* Debt items */}
                    {[
                      { name: "Predial 2024", amount: "S/ 420.00", status: "Vencido", red: true },
                      { name: "Arbitrios Q1", amount: "S/ 187.50", status: "Pendiente", red: false },
                      { name: "Arbitrios Q2", amount: "S/ 240.00", status: "Pendiente", red: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-white flex items-center justify-between p-2.5"
                        style={{ borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                      >
                        <div>
                          <div className="text-xs font-medium" style={{ color: "#0D1B4B" }}>
                            {item.name}
                          </div>
                          <div className="text-gray-500 text-xs">{item.amount}</div>
                        </div>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: item.red ? "#FEE2E2" : "#FEF3C7",
                            color: item.red ? "#B91C1C" : "#92400E",
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}

                    {/* Pay button */}
                    <button
                      className="mt-auto w-full py-2.5 text-sm font-semibold"
                      style={{ background: "#C9A227", color: "#0D1B4B", borderRadius: 8 }}
                    >
                      Pagar todo
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating badge top right */}
              <div
                className="absolute -top-3 -right-3 bg-white rounded-full p-2.5"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
              >
                <CheckCircle size={24} style={{ color: "#16A34A" }} />
              </div>

              {/* Floating toast bottom left */}
              <div
                className="absolute -bottom-2 -left-6 bg-white rounded-lg px-3 py-2"
                style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
              >
                <div className="text-xs text-gray-500">Pago exitoso</div>
                <div className="font-semibold text-sm" style={{ color: "#0D1B4B" }}>
                  S/ 420.00
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-[#0D1B4B] mb-3"
            style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.75rem" }}
          >
            Todo lo que necesitas para pagar tus tributos
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Una plataforma diseñada para hacer el proceso tributario más simple, rápido y transparente.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield size={32} style={{ color: "#C9A227" }} />,
              title: "Pago en línea seguro",
              description:
                "Todos tus pagos están protegidos con cifrado SSL de 256 bits. Tu información financiera está siempre segura.",
            },
            {
              icon: <Bell size={32} style={{ color: "#C9A227" }} />,
              title: "Notificaciones automáticas",
              description:
                "Recibe alertas antes de que venza tu deuda. Nunca más perderás un plazo de pago importante.",
            },
            {
              icon: <FileText size={32} style={{ color: "#C9A227" }} />,
              title: "Comprobante inmediato",
              description:
                "Descarga tu comprobante de pago en segundos. Disponible en formato PDF para tus registros oficiales.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8"
              style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3
                className="text-[#0D1B4B] mb-3"
                style={{ fontFamily: "Lora, Cambria, serif", fontWeight: 600, fontSize: "1.1rem" }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Band */}
      <section style={{ background: "#0D1B4B" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { number: "43%", label: "menos morosidad" },
              { number: "+24%", label: "pagos digitales" },
              { number: "24/7", label: "Disponible siempre" },
            ].map((stat, i) => (
              <div key={i}>
                <div
                  className="mb-2"
                  style={{
                    color: "#C9A227",
                    fontSize: "2.75rem",
                    fontWeight: 700,
                    fontFamily: "Lora, Cambria, serif",
                    lineHeight: 1,
                  }}
                >
                  {stat.number}
                </div>
                <div className="text-white text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
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
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Plataforma digital para la recaudación municipal en Perú. Simplificamos el pago de tributos para ciudadanos y municipalidades.
              </p>
              <div className="flex gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <MapPin size={12} /> Lima, Perú
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Phone size={12} /> 01-800-1234
                </div>
              </div>
            </div>
            <div>
              <h4
                className="text-[#0D1B4B] mb-4 text-xs font-semibold uppercase tracking-wider"
              >
                Plataforma
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Consultar deuda", view: "deuda" as View },
                  { label: "Realizar pago", view: "payment" as View },
                  { label: "Notificaciones", view: "notifications" as View },
                  { label: "Mi cuenta", view: null },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => item.view && navigate(item.view)}
                      className="text-gray-400 text-sm hover:text-[#C9A227] transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[#0D1B4B] mb-4 text-xs font-semibold uppercase tracking-wider">
                Soporte
              </h4>
              <ul className="space-y-2">
                {["Centro de ayuda", "Preguntas frecuentes", "Contacto", "Política de privacidad"].map(
                  (link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 text-sm hover:text-[#C9A227] transition-colors">
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 TributaFácil. Todos los derechos reservados.
            </p>
            <button
              onClick={() => navigate("admin-dashboard")}
              className="text-gray-400 text-xs hover:text-[#0D1B4B] transition-colors"
            >
              Portal Municipalidad →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
