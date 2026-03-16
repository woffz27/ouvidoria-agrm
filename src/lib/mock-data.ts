export type StatusType = "aberto" | "em_andamento" | "respondido" | "finalizado";
export type CategoriaType = "reclamacao" | "sugestao" | "elogio" | "solicitacao";
export type CanalType = "site" | "whatsapp" | "telefone";

export interface Atualizacao {
  id: string;
  atendimento_id: string;
  usuario: string;
  conteudo: string;
  data: string;
  tipo: "comentario" | "status_change";
}

export interface Atendimento {
  id: string;
  protocolo: string;
  solicitante: string;
  email: string;
  telefone: string;
  assunto: string;
  descricao: string;
  categoria: CategoriaType;
  canal: CanalType;
  status: StatusType;
  data_abertura: string;
  data_atualizacao: string;
  arquivos?: string[];
  atualizacoes: Atualizacao[];
}

export const categoriaLabels: Record<CategoriaType, string> = {
  reclamacao: "Reclamação",
  sugestao: "Sugestão",
  elogio: "Elogio",
  solicitacao: "Solicitação",
};

export const statusLabels: Record<StatusType, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  respondido: "Respondido",
  finalizado: "Finalizado",
};

export const canalLabels: Record<CanalType, string> = {
  site: "Site",
  whatsapp: "WhatsApp",
  telefone: "Telefone",
};

export const mockAtendimentos: Atendimento[] = [
  {
    id: "1",
    protocolo: "2025-000001",
    solicitante: "Maria Silva",
    email: "maria@email.com",
    telefone: "(84) 99999-0001",
    assunto: "Falta de água no bairro Alto de São Manoel",
    descricao: "Há 3 dias estamos sem fornecimento de água no bairro. A situação é urgente pois temos idosos e crianças na residência.",
    categoria: "reclamacao",
    canal: "site",
    status: "aberto",
    data_abertura: "2025-03-14T10:30:00",
    data_atualizacao: "2025-03-14T10:30:00",
    atualizacoes: [
      { id: "u1", atendimento_id: "1", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-14T10:30:00", tipo: "status_change" },
    ],
  },
  {
    id: "2",
    protocolo: "2025-000002",
    solicitante: "João Santos",
    email: "joao@email.com",
    telefone: "(84) 99999-0002",
    assunto: "Elogio ao atendimento da equipe técnica",
    descricao: "Gostaria de elogiar o excelente trabalho da equipe técnica que resolveu rapidamente o problema de esgoto na Rua das Flores.",
    categoria: "elogio",
    canal: "whatsapp",
    status: "finalizado",
    data_abertura: "2025-03-12T14:00:00",
    data_atualizacao: "2025-03-13T09:00:00",
    atualizacoes: [
      { id: "u2", atendimento_id: "2", usuario: "Sistema", conteudo: "Atendimento criado via WhatsApp", data: "2025-03-12T14:00:00", tipo: "status_change" },
      { id: "u3", atendimento_id: "2", usuario: "Atendente Carlos", conteudo: "Agradecemos o elogio! Encaminhamos para a equipe técnica.", data: "2025-03-13T09:00:00", tipo: "comentario" },
    ],
  },
  {
    id: "3",
    protocolo: "2025-000003",
    solicitante: "Ana Oliveira",
    email: "ana@email.com",
    telefone: "(84) 99999-0003",
    assunto: "Solicitação de informações sobre tarifa",
    descricao: "Preciso de informações detalhadas sobre os critérios de cálculo da tarifa de água para consumidores residenciais.",
    categoria: "solicitacao",
    canal: "telefone",
    status: "em_andamento",
    data_abertura: "2025-03-13T08:45:00",
    data_atualizacao: "2025-03-14T16:00:00",
    atualizacoes: [
      { id: "u4", atendimento_id: "3", usuario: "Sistema", conteudo: "Atendimento criado via Telefone", data: "2025-03-13T08:45:00", tipo: "status_change" },
      { id: "u5", atendimento_id: "3", usuario: "Atendente Mariana", conteudo: "Estamos levantando as informações solicitadas junto ao setor tarifário.", data: "2025-03-14T16:00:00", tipo: "comentario" },
    ],
  },
  {
    id: "4",
    protocolo: "2025-000004",
    solicitante: "Pedro Costa",
    email: "pedro@email.com",
    telefone: "(84) 99999-0004",
    assunto: "Sugestão de melhoria no app de segunda via",
    descricao: "Sugiro que o aplicativo de segunda via de conta permita também o parcelamento de débitos diretamente pela plataforma.",
    categoria: "sugestao",
    canal: "site",
    status: "respondido",
    data_abertura: "2025-03-10T11:20:00",
    data_atualizacao: "2025-03-12T10:30:00",
    atualizacoes: [
      { id: "u6", atendimento_id: "4", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-10T11:20:00", tipo: "status_change" },
      { id: "u7", atendimento_id: "4", usuario: "Atendente Carlos", conteudo: "Sugestão encaminhada ao setor de TI para análise de viabilidade.", data: "2025-03-11T14:00:00", tipo: "comentario" },
      { id: "u8", atendimento_id: "4", usuario: "Supervisor Ana", conteudo: "A sugestão foi aceita e será implementada na próxima atualização do sistema.", data: "2025-03-12T10:30:00", tipo: "comentario" },
    ],
  },
  {
    id: "5",
    protocolo: "2025-000005",
    solicitante: "Carla Mendes",
    email: "carla@email.com",
    telefone: "(84) 99999-0005",
    assunto: "Vazamento na rede de esgoto",
    descricao: "Existe um grande vazamento de esgoto na esquina da Av. Presidente Dutra com a Rua Coronel Gurgel, causando mau cheiro e risco sanitário.",
    categoria: "reclamacao",
    canal: "whatsapp",
    status: "em_andamento",
    data_abertura: "2025-03-15T07:00:00",
    data_atualizacao: "2025-03-15T09:30:00",
    atualizacoes: [
      { id: "u9", atendimento_id: "5", usuario: "Sistema", conteudo: "Atendimento criado via WhatsApp", data: "2025-03-15T07:00:00", tipo: "status_change" },
      { id: "u10", atendimento_id: "5", usuario: "Atendente Mariana", conteudo: "Equipe técnica já foi acionada e está a caminho do local.", data: "2025-03-15T09:30:00", tipo: "comentario" },
    ],
  },
  {
    id: "6",
    protocolo: "2025-000006",
    solicitante: "Roberto Almeida",
    email: "roberto@email.com",
    telefone: "(84) 99999-0006",
    assunto: "Reclamação sobre qualidade da água",
    descricao: "A água que chega na minha residência no bairro Nova Betânia está com coloração amarelada há uma semana.",
    categoria: "reclamacao",
    canal: "telefone",
    status: "aberto",
    data_abertura: "2025-03-16T09:15:00",
    data_atualizacao: "2025-03-16T09:15:00",
    atualizacoes: [
      { id: "u11", atendimento_id: "6", usuario: "Sistema", conteudo: "Atendimento criado via Telefone", data: "2025-03-16T09:15:00", tipo: "status_change" },
    ],
  },
  {
    id: "7",
    protocolo: "2025-000007",
    solicitante: "Francisca Lima",
    email: "francisca@email.com",
    telefone: "(84) 99999-0007",
    assunto: "Elogio à transparência nas contas",
    descricao: "Parabenizo a AGRM pela clareza e transparência nas informações das faturas de água e esgoto.",
    categoria: "elogio",
    canal: "site",
    status: "finalizado",
    data_abertura: "2025-03-08T16:40:00",
    data_atualizacao: "2025-03-09T10:00:00",
    atualizacoes: [
      { id: "u12", atendimento_id: "7", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-08T16:40:00", tipo: "status_change" },
      { id: "u13", atendimento_id: "7", usuario: "Atendente Carlos", conteudo: "Muito obrigado pelo feedback positivo!", data: "2025-03-09T10:00:00", tipo: "comentario" },
    ],
  },
  {
    id: "8",
    protocolo: "2025-000008",
    solicitante: "Lucas Ferreira",
    email: "lucas@email.com",
    telefone: "(84) 99999-0008",
    assunto: "Solicitação de ligação de água",
    descricao: "Solicito informações sobre o procedimento para nova ligação de água no loteamento Cidade Oeste, lote 45, quadra B.",
    categoria: "solicitacao",
    canal: "site",
    status: "aberto",
    data_abertura: "2025-03-16T08:00:00",
    data_atualizacao: "2025-03-16T08:00:00",
    atualizacoes: [
      { id: "u14", atendimento_id: "8", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-16T08:00:00", tipo: "status_change" },
    ],
  },
];

export function gerarProtocolo(): string {
  const ano = new Date().getFullYear();
  const num = Math.floor(Math.random() * 999999) + 1;
  return `${ano}-${String(num).padStart(6, "0")}`;
}

export function getEstatisticas() {
  const total = mockAtendimentos.length;
  const abertos = mockAtendimentos.filter((a) => a.status === "aberto").length;
  const emAndamento = mockAtendimentos.filter((a) => a.status === "em_andamento").length;
  const respondidos = mockAtendimentos.filter((a) => a.status === "respondido").length;
  const finalizados = mockAtendimentos.filter((a) => a.status === "finalizado").length;

  const porCategoria = {
    reclamacao: mockAtendimentos.filter((a) => a.categoria === "reclamacao").length,
    sugestao: mockAtendimentos.filter((a) => a.categoria === "sugestao").length,
    elogio: mockAtendimentos.filter((a) => a.categoria === "elogio").length,
    solicitacao: mockAtendimentos.filter((a) => a.categoria === "solicitacao").length,
  };

  const porCanal = {
    site: mockAtendimentos.filter((a) => a.canal === "site").length,
    whatsapp: mockAtendimentos.filter((a) => a.canal === "whatsapp").length,
    telefone: mockAtendimentos.filter((a) => a.canal === "telefone").length,
  };

  return { total, abertos, emAndamento, respondidos, finalizados, porCategoria, porCanal };
}
