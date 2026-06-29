"use client";

import {
  BarChart3,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  DollarSign,
  LayoutDashboard,
  Plus,
  Scissors,
  Search,
  Settings,
  Sparkles,
  UserRound
} from "lucide-react";
import { useMemo, useState } from "react";
import { appointments, services, slots } from "@/lib/data";

type Tab = "dashboard" | "agenda" | "servicos";

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [selectedService, setSelectedService] = useState(services[0].id);
  const [selectedSlot, setSelectedSlot] = useState(slots[1].time);

  const currentService = services.find((service) => service.id === selectedService) ?? services[0];

  const stats = useMemo(
    () => [
      {
        label: "Agendamentos hoje",
        value: "12",
        hint: "+3 em relacao a ontem",
        icon: CalendarClock
      },
      {
        label: "Receita estimada",
        value: "R$ 1.840",
        hint: "76% da meta semanal",
        icon: DollarSign
      },
      {
        label: "Taxa de ocupacao",
        value: "82%",
        hint: "5 horarios livres",
        icon: BarChart3
      }
    ],
    []
  );

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegacao principal">
        <div className="brand">
          <span className="brand-mark">
            <Scissors size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>AgendaPro</strong>
            <small>Studio Felipe</small>
          </div>
        </div>

        <nav className="nav-list">
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}>
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className={tab === "agenda" ? "active" : ""} onClick={() => setTab("agenda")}>
            <CalendarClock size={18} />
            Agenda
          </button>
          <button className={tab === "servicos" ? "active" : ""} onClick={() => setTab("servicos")}>
            <Sparkles size={18} />
            Servicos
          </button>
        </nav>

        <button className="settings-button" aria-label="Abrir configuracoes">
          <Settings size={18} />
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Gestao de horarios</p>
            <h1>{tab === "dashboard" ? "Resumo do dia" : tab === "agenda" ? "Agenda da semana" : "Catalogo de servicos"}</h1>
          </div>
          <div className="topbar-actions">
            <label className="search">
              <Search size={17} />
              <input aria-label="Buscar" placeholder="Buscar cliente, horario ou servico" />
            </label>
            <button className="primary-action">
              <Plus size={18} />
              Novo
            </button>
          </div>
        </header>

        {tab === "dashboard" && (
          <div className="dashboard-grid">
            <section className="stats-row" aria-label="Indicadores">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <article className="metric-card" key={item.label}>
                    <span>
                      <Icon size={20} />
                    </span>
                    <p>{item.label}</p>
                    <strong>{item.value}</strong>
                    <small>{item.hint}</small>
                  </article>
                );
              })}
            </section>

            <section className="schedule-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Proximos atendimentos</p>
                  <h2>Hoje</h2>
                </div>
                <button className="icon-button" aria-label="Ver todos os agendamentos">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="appointment-list">
                {appointments.map((appointment) => (
                  <article className="appointment" key={appointment.id}>
                    <time>{appointment.time}</time>
                    <div>
                      <strong>{appointment.client}</strong>
                      <span>{appointment.service}</span>
                    </div>
                    <em className={appointment.status === "Confirmado" ? "confirmed" : ""}>{appointment.status}</em>
                  </article>
                ))}
              </div>
            </section>

            <BookingPreview
              currentService={currentService}
              selectedService={selectedService}
              selectedSlot={selectedSlot}
              onServiceChange={setSelectedService}
              onSlotChange={setSelectedSlot}
            />
          </div>
        )}

        {tab === "agenda" && (
          <section className="calendar-board">
            {["Seg", "Ter", "Qua", "Qui", "Sex"].map((day, index) => (
              <div className="day-column" key={day}>
                <strong>{day}</strong>
                {slots.slice(index, index + 4).map((slot) => (
                  <button className={slot.available ? "slot available" : "slot"} key={`${day}-${slot.time}`}>
                    <Clock3 size={16} />
                    <span>{slot.time}</span>
                    <small>{slot.available ? "Livre" : "Ocupado"}</small>
                  </button>
                ))}
              </div>
            ))}
          </section>
        )}

        {tab === "servicos" && (
          <section className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.id}>
                <div className="service-icon">
                  <Sparkles size={20} />
                </div>
                <h2>{service.name}</h2>
                <p>{service.description}</p>
                <div>
                  <strong>{service.price}</strong>
                  <span>{service.duration}</span>
                </div>
              </article>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

type BookingPreviewProps = {
  currentService: (typeof services)[number];
  selectedService: string;
  selectedSlot: string;
  onServiceChange: (serviceId: string) => void;
  onSlotChange: (slot: string) => void;
};

function BookingPreview({
  currentService,
  selectedService,
  selectedSlot,
  onServiceChange,
  onSlotChange
}: BookingPreviewProps) {
  return (
    <aside className="booking-panel" aria-label="Previa de agendamento">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Pagina publica</p>
          <h2>Agendar horario</h2>
        </div>
        <span className="avatar">
          <UserRound size={20} />
        </span>
      </div>

      <label className="field">
        Servico
        <select value={selectedService} onChange={(event) => onServiceChange(event.target.value)}>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <div className="slot-picker" aria-label="Horarios disponiveis">
        {slots
          .filter((slot) => slot.available)
          .map((slot) => (
            <button
              className={selectedSlot === slot.time ? "selected" : ""}
              key={slot.time}
              onClick={() => onSlotChange(slot.time)}
            >
              {slot.time}
            </button>
          ))}
      </div>

      <div className="booking-summary">
        <span>
          <Check size={18} />
        </span>
        <div>
          <strong>{currentService.name}</strong>
          <p>
            {selectedSlot} - {currentService.price} - {currentService.duration}
          </p>
        </div>
      </div>

      <button className="confirm-button">Confirmar agendamento</button>
    </aside>
  );
}
