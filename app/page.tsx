"use client";

import {
  BarChart3,
  CalendarClock,
  Check,
  Clock3,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Plus,
  Scissors,
  Search,
  Settings,
  Sparkles,
  UserRound,
  UsersRound
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Appointment,
  Service,
  appointments as defaultAppointments,
  days,
  services as defaultServices,
  slots
} from "@/lib/data";

type Tab = "dashboard" | "agenda" | "servicos";

type User = {
  name: string;
  email: string;
  business: string;
};

type ServiceForm = {
  name: string;
  description: string;
  price: string;
  duration: string;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const storageKeys = {
  user: "agendapro:user",
  services: "agendapro:services",
  appointments: "agendapro:appointments"
};

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [appointments, setAppointments] = useState<Appointment[]>(defaultAppointments);
  const [selectedService, setSelectedService] = useState(defaultServices[0].id);
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedSlot, setSelectedSlot] = useState(slots[1]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    name: "",
    description: "",
    price: "",
    duration: ""
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedUser = window.localStorage.getItem(storageKeys.user);
    const savedServices = window.localStorage.getItem(storageKeys.services);
    const savedAppointments = window.localStorage.getItem(storageKeys.appointments);

    if (savedUser) {
      setUser(JSON.parse(savedUser) as User);
    }

    if (savedServices) {
      const parsedServices = JSON.parse(savedServices) as Service[];
      setServices(parsedServices);
      setSelectedService(parsedServices[0]?.id ?? defaultServices[0].id);
    }

    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments) as Appointment[]);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(storageKeys.services, JSON.stringify(services));
  }, [isLoaded, services]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(storageKeys.appointments, JSON.stringify(appointments));
  }, [appointments, isLoaded]);

  const currentService = services.find((service) => service.id === selectedService) ?? services[0];
  const filteredAppointments = appointments.filter((appointment) => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return true;
    }

    return [appointment.client, appointment.service, appointment.time, appointment.day, appointment.phone]
      .join(" ")
      .toLowerCase()
      .includes(term);
  });

  const availableSlots = slots.filter(
    (slot) => !appointments.some((appointment) => appointment.day === selectedDay && appointment.time === slot)
  );

  useEffect(() => {
    if (!availableSlots.includes(selectedSlot)) {
      setSelectedSlot(availableSlots[0] ?? "");
    }
  }, [availableSlots, selectedSlot]);

  const stats = useMemo(() => {
    const confirmed = appointments.filter((appointment) => appointment.status === "Confirmado");
    const revenue = confirmed.reduce((total, appointment) => total + appointment.price, 0);
    const totalSlots = days.length * slots.length;
    const occupation = Math.round((appointments.length / totalSlots) * 100);

    return [
      {
        label: "Agendamentos",
        value: String(appointments.length),
        hint: `${confirmed.length} confirmados`,
        icon: CalendarClock
      },
      {
        label: "Receita estimada",
        value: currency.format(revenue),
        hint: "Com base nos confirmados",
        icon: DollarSign
      },
      {
        label: "Taxa de ocupacao",
        value: `${occupation}%`,
        hint: `${totalSlots - appointments.length} horarios livres`,
        icon: BarChart3
      }
    ];
  }, [appointments]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextUser = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      business: String(formData.get("business") ?? "")
    };

    setUser(nextUser);
    window.localStorage.setItem(storageKeys.user, JSON.stringify(nextUser));
  }

  function handleLogout() {
    setUser(null);
    window.localStorage.removeItem(storageKeys.user);
  }

  function handleCreateService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextService: Service = {
      id: serviceForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`,
      name: serviceForm.name,
      description: serviceForm.description,
      price: Number(serviceForm.price),
      duration: Number(serviceForm.duration)
    };

    setServices((current) => [...current, nextService]);
    setSelectedService(nextService.id);
    setServiceForm({ name: "", description: "", price: "", duration: "" });
  }

  function handleCreateAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentService) {
      return;
    }

    const nextAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      day: selectedDay,
      time: selectedSlot,
      client: clientName,
      phone: clientPhone,
      serviceId: currentService.id,
      service: currentService.name,
      price: currentService.price,
      status: "Pendente"
    };

    setAppointments((current) => [nextAppointment, ...current]);
    setClientName("");
    setClientPhone("");

    const nextAvailableSlot = slots.find(
      (slot) => slot !== selectedSlot && !appointments.some((appointment) => appointment.day === selectedDay && appointment.time === slot)
    );

    if (nextAvailableSlot) {
      setSelectedSlot(nextAvailableSlot);
    }
  }

  function updateStatus(id: string, status: Appointment["status"]) {
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment))
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Navegacao principal">
        <div className="brand">
          <span className="brand-mark">
            <Scissors size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>AgendaPro</strong>
            <small>{user.business}</small>
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

        <div className="sidebar-footer">
          <button className="settings-button" aria-label="Abrir configuracoes">
            <Settings size={18} />
          </button>
          <button className="settings-button" aria-label="Sair" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Ola, {user.name}</p>
            <h1>{tab === "dashboard" ? "Resumo do dia" : tab === "agenda" ? "Agenda da semana" : "Catalogo de servicos"}</h1>
          </div>
          <div className="topbar-actions">
            <label className="search">
              <Search size={17} />
              <input
                aria-label="Buscar"
                placeholder="Buscar cliente, horario ou servico"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <button className="primary-action" onClick={() => setTab("servicos")}>
              <Plus size={18} />
              Servico
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

            <AppointmentList appointments={filteredAppointments} onStatusChange={updateStatus} />

            <BookingPreview
              availableSlots={availableSlots}
              clientName={clientName}
              clientPhone={clientPhone}
              currentService={currentService}
              selectedDay={selectedDay}
              selectedService={selectedService}
              selectedSlot={selectedSlot}
              services={services}
              onClientNameChange={setClientName}
              onClientPhoneChange={setClientPhone}
              onCreateAppointment={handleCreateAppointment}
              onDayChange={setSelectedDay}
              onServiceChange={setSelectedService}
              onSlotChange={setSelectedSlot}
            />
          </div>
        )}

        {tab === "agenda" && <CalendarBoard appointments={appointments} onStatusChange={updateStatus} />}

        {tab === "servicos" && (
          <section className="services-layout">
            <form className="form-panel" onSubmit={handleCreateService}>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Novo servico</p>
                  <h2>Adicionar ao catalogo</h2>
                </div>
                <span className="avatar">
                  <Sparkles size={20} />
                </span>
              </div>

              <label className="field">
                Nome
                <input
                  required
                  value={serviceForm.name}
                  onChange={(event) => setServiceForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Ex: Sobrancelha"
                />
              </label>
              <label className="field">
                Descricao
                <textarea
                  required
                  value={serviceForm.description}
                  onChange={(event) => setServiceForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Descreva o que esta incluso"
                />
              </label>
              <div className="form-row">
                <label className="field">
                  Preco
                  <input
                    min="1"
                    required
                    type="number"
                    value={serviceForm.price}
                    onChange={(event) => setServiceForm((current) => ({ ...current, price: event.target.value }))}
                    placeholder="80"
                  />
                </label>
                <label className="field">
                  Minutos
                  <input
                    min="1"
                    required
                    type="number"
                    value={serviceForm.duration}
                    onChange={(event) => setServiceForm((current) => ({ ...current, duration: event.target.value }))}
                    placeholder="45"
                  />
                </label>
              </div>
              <button className="confirm-button">Salvar servico</button>
            </form>

            <section className="service-grid">
              {services.map((service) => (
                <article className="service-card" key={service.id}>
                  <div className="service-icon">
                    <Sparkles size={20} />
                  </div>
                  <h2>{service.name}</h2>
                  <p>{service.description}</p>
                  <div>
                    <strong>{currency.format(service.price)}</strong>
                    <span>{service.duration} min</span>
                  </div>
                </article>
              ))}
            </section>
          </section>
        )}
      </section>
    </main>
  );
}

type LoginScreenProps = {
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
};

function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <main className="auth-screen">
      <section className="auth-copy">
        <span className="brand-mark">
          <Scissors size={22} />
        </span>
        <p className="eyebrow">AgendaPro</p>
        <h1>Controle sua agenda sem perder tempo entre mensagens.</h1>
        <p>
          MVP com login local, catalogo de servicos e agendamentos persistidos no navegador para demonstrar fluxo real de
          produto.
        </p>
      </section>

      <form className="auth-card" onSubmit={onLogin}>
        <div>
          <p className="eyebrow">Entrar</p>
          <h2>Crie seu acesso demo</h2>
        </div>
        <label className="field">
          Nome
          <input name="name" required placeholder="Felipe" />
        </label>
        <label className="field">
          E-mail
          <input name="email" required type="email" placeholder="voce@email.com" />
        </label>
        <label className="field">
          Nome do negocio
          <input name="business" required placeholder="Studio Felipe" />
        </label>
        <button className="confirm-button">Entrar no painel</button>
      </form>
    </main>
  );
}

type AppointmentListProps = {
  appointments: Appointment[];
  onStatusChange: (id: string, status: Appointment["status"]) => void;
};

function AppointmentList({ appointments, onStatusChange }: AppointmentListProps) {
  return (
    <section className="schedule-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Proximos atendimentos</p>
          <h2>Agenda</h2>
        </div>
        <span className="avatar">
          <UsersRound size={20} />
        </span>
      </div>
      <div className="appointment-list">
        {appointments.map((appointment) => (
          <article className="appointment" key={appointment.id}>
            <time>
              {appointment.day}
              <br />
              {appointment.time}
            </time>
            <div>
              <strong>{appointment.client}</strong>
              <span>
                {appointment.service} - {appointment.phone}
              </span>
            </div>
            <select
              className="status-select"
              value={appointment.status}
              onChange={(event) => onStatusChange(appointment.id, event.target.value as Appointment["status"])}
            >
              <option>Confirmado</option>
              <option>Pendente</option>
              <option>Cancelado</option>
            </select>
          </article>
        ))}
      </div>
    </section>
  );
}

type BookingPreviewProps = {
  availableSlots: string[];
  clientName: string;
  clientPhone: string;
  currentService: Service;
  selectedDay: string;
  selectedService: string;
  selectedSlot: string;
  services: Service[];
  onClientNameChange: (name: string) => void;
  onClientPhoneChange: (phone: string) => void;
  onCreateAppointment: (event: FormEvent<HTMLFormElement>) => void;
  onDayChange: (day: string) => void;
  onServiceChange: (serviceId: string) => void;
  onSlotChange: (slot: string) => void;
};

function BookingPreview({
  availableSlots,
  clientName,
  clientPhone,
  currentService,
  selectedDay,
  selectedService,
  selectedSlot,
  services,
  onClientNameChange,
  onClientPhoneChange,
  onCreateAppointment,
  onDayChange,
  onServiceChange,
  onSlotChange
}: BookingPreviewProps) {
  return (
    <form className="booking-panel" aria-label="Criar agendamento" onSubmit={onCreateAppointment}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Novo horario</p>
          <h2>Agendar cliente</h2>
        </div>
        <span className="avatar">
          <UserRound size={20} />
        </span>
      </div>

      <label className="field">
        Cliente
        <input required value={clientName} onChange={(event) => onClientNameChange(event.target.value)} placeholder="Nome do cliente" />
      </label>
      <label className="field">
        Telefone
        <input required value={clientPhone} onChange={(event) => onClientPhoneChange(event.target.value)} placeholder="(11) 99999-9999" />
      </label>
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

      <div className="day-picker" aria-label="Dias disponiveis">
        {days.map((day) => (
          <button className={selectedDay === day ? "selected" : ""} key={day} type="button" onClick={() => onDayChange(day)}>
            {day}
          </button>
        ))}
      </div>

      <div className="slot-picker" aria-label="Horarios disponiveis">
        {availableSlots.map((slot) => (
          <button className={selectedSlot === slot ? "selected" : ""} key={slot} type="button" onClick={() => onSlotChange(slot)}>
            {slot}
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
            {selectedDay}, {selectedSlot} - {currency.format(currentService.price)} - {currentService.duration} min
          </p>
        </div>
      </div>

      <button className="confirm-button" disabled={availableSlots.length === 0}>
        Confirmar agendamento
      </button>
    </form>
  );
}

type CalendarBoardProps = {
  appointments: Appointment[];
  onStatusChange: (id: string, status: Appointment["status"]) => void;
};

function CalendarBoard({ appointments, onStatusChange }: CalendarBoardProps) {
  return (
    <section className="calendar-board">
      {days.map((day) => (
        <div className="day-column" key={day}>
          <strong>{day}</strong>
          {slots.map((slot) => {
            const appointment = appointments.find((item) => item.day === day && item.time === slot);

            return (
              <button
                className={appointment ? "slot" : "slot available"}
                key={`${day}-${slot}`}
                onClick={() => appointment && onStatusChange(appointment.id, "Confirmado")}
              >
                <Clock3 size={16} />
                <span>{slot}</span>
                <small>{appointment ? appointment.client : "Livre"}</small>
              </button>
            );
          })}
        </div>
      ))}
    </section>
  );
}
