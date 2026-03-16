export type StatusType = "aberto" | "em_andamento" | "respondido" | "finalizado";
export type CategoriaType = "reclamacao" | "sugestao" | "elogio" | "solicitacao";
export type CanalType = "site" | "whatsapp" | "telefone";
export type TipoProblemaType = "extravasamento_esgoto" | "vazamento_agua" | "pavimentacao" | "outros";

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
  tipo_problema: TipoProblemaType;
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

export const tipoProblemaLabels: Record<TipoProblemaType, string> = {
  extravasamento_esgoto: "Extravasamento de Esgoto",
  vazamento_agua: "Vazamento de Água",
  pavimentacao: "Pavimentação",
  outros: "Outros",
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
    tipo_problema: "vazamento_agua",
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
    tipo_problema: "outros",
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
    tipo_problema: "outros",
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
    tipo_problema: "outros",
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
    tipo_problema: "extravasamento_esgoto",
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
    tipo_problema: "vazamento_agua",
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
    tipo_problema: "outros",
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
    tipo_problema: "outros",
    status: "aberto",
    data_abertura: "2025-03-16T08:00:00",
    data_atualizacao: "2025-03-16T08:00:00",
    atualizacoes: [
      { id: "u14", atendimento_id: "8", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-16T08:00:00", tipo: "status_change" },
    ],
  },
  // Novos registros simulados
  {
    id: "9",
    protocolo: "2025-000009",
    solicitante: "Antônia Rodrigues",
    email: "antonia@email.com",
    telefone: "(84) 99988-1234",
    assunto: "Extravasamento de esgoto na Av. Presidente Dutra",
    descricao: "Esgoto transbordando na calçada em frente ao nº 450 da Av. Presidente Dutra, próximo ao cruzamento com a Rua Frei Miguelinho. O esgoto está escorrendo para a via pública e causando mau cheiro intenso. Moradores relatam o problema há 5 dias sem solução.",
    categoria: "reclamacao",
    canal: "whatsapp",
    tipo_problema: "extravasamento_esgoto",
    status: "aberto",
    data_abertura: "2025-03-15T14:20:00",
    data_atualizacao: "2025-03-15T14:20:00",
    atualizacoes: [
      { id: "u15", atendimento_id: "9", usuario: "Sistema", conteudo: "Atendimento criado via WhatsApp", data: "2025-03-15T14:20:00", tipo: "status_change" },
    ],
  },
  {
    id: "10",
    protocolo: "2025-000010",
    solicitante: "Francisco Barbosa",
    email: "francisco.b@email.com",
    telefone: "(84) 99977-5678",
    assunto: "Vazamento de água na Rua Jerônimo Rosado",
    descricao: "Grande vazamento de água potável na Rua Jerônimo Rosado, nº 220, bairro Centro. A água está jorrando há 2 dias, causando desperdício e alagamento na calçada. O vazamento parece ser na tubulação principal.",
    categoria: "reclamacao",
    canal: "telefone",
    tipo_problema: "vazamento_agua",
    status: "em_andamento",
    data_abertura: "2025-03-14T07:30:00",
    data_atualizacao: "2025-03-15T11:00:00",
    atualizacoes: [
      { id: "u16", atendimento_id: "10", usuario: "Sistema", conteudo: "Atendimento criado via Telefone", data: "2025-03-14T07:30:00", tipo: "status_change" },
      { id: "u17", atendimento_id: "10", usuario: "Atendente Mariana", conteudo: "Ordem de serviço emitida. Equipe de manutenção programada para vistoria no local.", data: "2025-03-14T10:00:00", tipo: "comentario" },
      { id: "u18", atendimento_id: "10", usuario: "Técnico José", conteudo: "Vistoria realizada. Identificado rompimento na tubulação de 100mm. Reparo programado para amanhã.", data: "2025-03-15T11:00:00", tipo: "comentario" },
    ],
  },
  {
    id: "11",
    protocolo: "2025-000011",
    solicitante: "Raimunda Souza",
    email: "raimunda.s@email.com",
    telefone: "(84) 99966-9012",
    assunto: "Buraco na pavimentação da Rua Coronel Gurgel",
    descricao: "Buraco enorme na pavimentação da Rua Coronel Gurgel, próximo ao nº 180, bairro Centro. O buraco surgiu após obras de reparo na rede de esgoto e não foi feita a recomposição do asfalto. Veículos e pedestres estão em risco.",
    categoria: "reclamacao",
    canal: "site",
    tipo_problema: "pavimentacao",
    status: "respondido",
    data_abertura: "2025-03-11T09:00:00",
    data_atualizacao: "2025-03-14T15:00:00",
    atualizacoes: [
      { id: "u19", atendimento_id: "11", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-11T09:00:00", tipo: "status_change" },
      { id: "u20", atendimento_id: "11", usuario: "Atendente Carlos", conteudo: "Encaminhado ao setor de infraestrutura para providências.", data: "2025-03-12T08:30:00", tipo: "comentario" },
      { id: "u21", atendimento_id: "11", usuario: "Supervisor Ana", conteudo: "Equipe de pavimentação agendada para recomposição do asfalto na próxima segunda-feira.", data: "2025-03-14T15:00:00", tipo: "comentario" },
    ],
  },
  {
    id: "12",
    protocolo: "2025-000012",
    solicitante: "José Pereira Neto",
    email: "jose.neto@email.com",
    telefone: "(84) 99955-3456",
    assunto: "Extravasamento de esgoto no bairro Abolição",
    descricao: "Esgoto transbordando no cruzamento da Rua Felipe Camarão com a Travessa São José, bairro Abolição. O problema ocorre sempre que chove e afeta várias residências. Crianças brincam próximo ao local contaminado.",
    categoria: "reclamacao",
    canal: "telefone",
    tipo_problema: "extravasamento_esgoto",
    status: "em_andamento",
    data_abertura: "2025-03-13T16:45:00",
    data_atualizacao: "2025-03-15T08:00:00",
    atualizacoes: [
      { id: "u22", atendimento_id: "12", usuario: "Sistema", conteudo: "Atendimento criado via Telefone", data: "2025-03-13T16:45:00", tipo: "status_change" },
      { id: "u23", atendimento_id: "12", usuario: "Atendente Mariana", conteudo: "Situação classificada como urgente. Equipe técnica acionada.", data: "2025-03-14T08:00:00", tipo: "comentario" },
      { id: "u24", atendimento_id: "12", usuario: "Técnico José", conteudo: "Identificado entupimento na rede coletora. Limpeza e desobstrução em andamento.", data: "2025-03-15T08:00:00", tipo: "comentario" },
    ],
  },
  {
    id: "13",
    protocolo: "2025-000013",
    solicitante: "Sandra Gomes",
    email: "sandra.g@email.com",
    telefone: "(84) 99944-7890",
    assunto: "Pavimentação danificada na Rua Augusto Severo",
    descricao: "Após reparo de vazamento de água realizado há 2 meses na Rua Augusto Severo, nº 95, bairro Nova Betânia, a pavimentação não foi recomposta adequadamente. O remendo está afundando e acumulando água da chuva.",
    categoria: "reclamacao",
    canal: "whatsapp",
    tipo_problema: "pavimentacao",
    status: "aberto",
    data_abertura: "2025-03-16T10:00:00",
    data_atualizacao: "2025-03-16T10:00:00",
    atualizacoes: [
      { id: "u25", atendimento_id: "13", usuario: "Sistema", conteudo: "Atendimento criado via WhatsApp", data: "2025-03-16T10:00:00", tipo: "status_change" },
    ],
  },
  {
    id: "14",
    protocolo: "2025-000014",
    solicitante: "Marcos Vinícius Lima",
    email: "marcos.v@email.com",
    telefone: "(84) 99933-2345",
    assunto: "Vazamento de água no bairro Belo Horizonte",
    descricao: "Vazamento constante na tubulação de água na Rua Dix-Sept Rosado, próximo ao nº 300, bairro Belo Horizonte. A água está minando pelo asfalto há mais de uma semana, causando erosão na via.",
    categoria: "reclamacao",
    canal: "site",
    tipo_problema: "vazamento_agua",
    status: "finalizado",
    data_abertura: "2025-03-07T13:00:00",
    data_atualizacao: "2025-03-12T17:00:00",
    atualizacoes: [
      { id: "u26", atendimento_id: "14", usuario: "Sistema", conteudo: "Atendimento criado via Site", data: "2025-03-07T13:00:00", tipo: "status_change" },
      { id: "u27", atendimento_id: "14", usuario: "Atendente Carlos", conteudo: "Ordem de serviço emitida para equipe de manutenção.", data: "2025-03-08T09:00:00", tipo: "comentario" },
      { id: "u28", atendimento_id: "14", usuario: "Técnico José", conteudo: "Reparo concluído. Tubulação substituída em trecho de 5 metros.", data: "2025-03-10T16:00:00", tipo: "comentario" },
      { id: "u29", atendimento_id: "14", usuario: "Supervisor Ana", conteudo: "Atendimento finalizado. Recomposição do asfalto agendada.", data: "2025-03-12T17:00:00", tipo: "comentario" },
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

  const porTipoProblema = {
    extravasamento_esgoto: mockAtendimentos.filter((a) => a.tipo_problema === "extravasamento_esgoto").length,
    vazamento_agua: mockAtendimentos.filter((a) => a.tipo_problema === "vazamento_agua").length,
    pavimentacao: mockAtendimentos.filter((a) => a.tipo_problema === "pavimentacao").length,
    outros: mockAtendimentos.filter((a) => a.tipo_problema === "outros").length,
  };

  return { total, abertos, emAndamento, respondidos, finalizados, porCategoria, porCanal, porTipoProblema };
}
