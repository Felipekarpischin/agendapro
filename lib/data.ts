export const services = [
  {
    id: "corte-premium",
    name: "Corte premium",
    description: "Atendimento completo com consultoria de estilo, lavagem e finalizacao.",
    price: "R$ 90",
    duration: "50 min"
  },
  {
    id: "barba-terapia",
    name: "Barba terapia",
    description: "Toalha quente, modelagem, hidratacao e acabamento com navalha.",
    price: "R$ 65",
    duration: "35 min"
  },
  {
    id: "combo-executivo",
    name: "Combo executivo",
    description: "Corte, barba e finalizacao para quem precisa sair pronto da cadeira.",
    price: "R$ 140",
    duration: "80 min"
  }
];

export const appointments = [
  {
    id: "apt-1",
    time: "09:00",
    client: "Lucas Almeida",
    service: "Corte premium",
    status: "Confirmado"
  },
  {
    id: "apt-2",
    time: "10:30",
    client: "Rafael Costa",
    service: "Combo executivo",
    status: "Pendente"
  },
  {
    id: "apt-3",
    time: "14:00",
    client: "Bruno Martins",
    service: "Barba terapia",
    status: "Confirmado"
  },
  {
    id: "apt-4",
    time: "16:20",
    client: "Thiago Souza",
    service: "Corte premium",
    status: "Pendente"
  }
];

export const slots = [
  { time: "08:30", available: true },
  { time: "09:30", available: true },
  { time: "10:30", available: false },
  { time: "11:30", available: true },
  { time: "13:30", available: true },
  { time: "14:30", available: false },
  { time: "15:30", available: true },
  { time: "16:30", available: true }
];
