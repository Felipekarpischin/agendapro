export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
};

export type Appointment = {
  id: string;
  day: string;
  time: string;
  client: string;
  phone: string;
  serviceId: string;
  service: string;
  price: number;
  status: "Confirmado" | "Pendente" | "Cancelado";
};

export const services: Service[] = [
  {
    id: "corte-premium",
    name: "Corte premium",
    description: "Atendimento completo com consultoria de estilo, lavagem e finalizacao.",
    price: 90,
    duration: 50
  },
  {
    id: "barba-terapia",
    name: "Barba terapia",
    description: "Toalha quente, modelagem, hidratacao e acabamento com navalha.",
    price: 65,
    duration: 35
  },
  {
    id: "combo-executivo",
    name: "Combo executivo",
    description: "Corte, barba e finalizacao para quem precisa sair pronto da cadeira.",
    price: 140,
    duration: 80
  }
];

export const appointments: Appointment[] = [
  {
    id: "apt-1",
    day: "Seg",
    time: "09:00",
    client: "Lucas Almeida",
    phone: "(11) 98888-1010",
    serviceId: "corte-premium",
    service: "Corte premium",
    price: 90,
    status: "Confirmado"
  },
  {
    id: "apt-2",
    day: "Seg",
    time: "10:30",
    client: "Rafael Costa",
    phone: "(11) 97777-2020",
    serviceId: "combo-executivo",
    service: "Combo executivo",
    price: 140,
    status: "Pendente"
  },
  {
    id: "apt-3",
    day: "Ter",
    time: "14:00",
    client: "Bruno Martins",
    phone: "(11) 96666-3030",
    serviceId: "barba-terapia",
    service: "Barba terapia",
    price: 65,
    status: "Confirmado"
  },
  {
    id: "apt-4",
    day: "Qua",
    time: "16:30",
    client: "Thiago Souza",
    phone: "(11) 95555-4040",
    serviceId: "corte-premium",
    service: "Corte premium",
    price: 90,
    status: "Pendente"
  }
];

export const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];

export const slots = ["08:30", "09:00", "09:30", "10:30", "11:30", "13:30", "14:00", "15:30", "16:30"];
