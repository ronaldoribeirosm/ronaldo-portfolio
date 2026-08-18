/**
 * Conteúdo central do portfolio (PT / EN).
 * Tudo que é texto visível ao usuário vive aqui, para facilitar edição e tradução.
 */

export type Lang = 'pt' | 'en';

export interface Localized {
  pt: string;
  en: string;
}

/* ------------------------------------------------------------------ */
/* Perfil                                                              */
/* ------------------------------------------------------------------ */

export const profile = {
  name: 'Ronaldo Ribeiro',
  handle: 'ronaldo.dev',
  role: {
    pt: 'Desenvolvedor Full Stack',
    en: 'Full Stack Developer',
  },
  tagline: {
    pt: 'Construo sistemas, automações e interfaces — hoteleiro de dia, dev sempre.',
    en: 'I build systems, automations and interfaces — hotelier by day, developer always.',
  },
  location: {
    pt: 'Vale do Paraíba, São Paulo — BR',
    en: 'Vale do Paraíba, São Paulo — Brazil',
  },
  level: 20,
  class: {
    pt: 'Full Stack',
    en: 'Full Stack',
  },
  links: {
    github: 'https://github.com/ronaldoribeirosm',
    linkedin: 'https://www.linkedin.com/in/ronaldo-mendonca',
    email: 'ronaldoribeirosm@gmail.com',
  },
  bio: {
    pt: 'Desenvolvedor full stack com base sólida em automação e integração de sistemas. Atuo no dia a dia de um hotel resolvendo problemas reais com código — de rotinas que economizam horas de trabalho manual a integrações com plataformas de reserva. Formado como Técnico em TI pelo IFSP e cursando Análise e Desenvolvimento de Sistemas.',
    en: 'Full stack developer with a strong foundation in automation and systems integration. I spend my days solving real hotel-operations problems with code — from routines that save hours of manual work to integrations with booking platforms. Certified IT Technician (IFSP), currently studying Systems Analysis & Development.',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Stats (estilo ficha de RPG) — valor 0..100                          */
/* ------------------------------------------------------------------ */

export interface Stat {
  key: string;
  label: Localized;
  value: number;
}

export const heroStats: Stat[] = [
  { key: 'logic', label: { pt: 'Lógica', en: 'Logic' }, value: 90 },
  { key: 'grit', label: { pt: 'Persistência', en: 'Grit' }, value: 88 },
  { key: 'craft', label: { pt: 'Acabamento', en: 'Craft' }, value: 82 },
  { key: 'speed', label: { pt: 'Velocidade', en: 'Speed' }, value: 85 },
];

/* ------------------------------------------------------------------ */
/* Projetos                                                            */
/* ------------------------------------------------------------------ */

export type ProjectCategory = 'automation' | 'backend' | 'frontend' | 'fullstack' | 'data';

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  element: Localized; // "classe" temática exibida no card
  tagline: Localized;
  description: Localized;
  stack: string[];
  year: string;
  power: number; // 0..100, barra de "poder" do card
  links: { repo?: string; demo?: string };
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: 'hotel-automaton',
    name: 'Hotel Automaton',
    category: 'automation',
    element: { pt: 'Automação', en: 'Automation' },
    tagline: {
      pt: 'Robô que automatiza a operação de um hotel.',
      en: 'A bot that automates hotel operations.',
    },
    description: {
      pt: 'Conjunto de automações que cuidam de rotinas hoteleiras: cálculo de ocupação, geração de FNRH e sincronização com a plataforma Cloudbeds. Transforma planilhas manuais em fluxos que rodam sozinhos.',
      en: 'A set of automations that handle hotel routines: occupancy calculation, guest registration forms and synchronization with the Cloudbeds platform. Turns manual spreadsheets into flows that run on their own.',
    },
    stack: ['Python', 'Google Apps Script', 'Cloudbeds API', 'Sheets'],
    year: '2025',
    power: 92,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
    featured: true,
  },
  {
    id: 'cloudbeds-bridge',
    name: 'Cloudbeds Bridge',
    category: 'backend',
    element: { pt: 'Integração', en: 'Integration' },
    tagline: {
      pt: 'Ponte que expõe os dados do Cloudbeds via protocolo MCP.',
      en: 'A bridge that exposes Cloudbeds data over the MCP protocol.',
    },
    description: {
      pt: 'Servidor que conecta os dados operacionais do Cloudbeds a assistentes e automações externas usando o protocolo MCP. Consultas de reservas, ocupação e faturamento ficam acessíveis de forma padronizada e segura.',
      en: 'A server that connects Cloudbeds operational data to external assistants and automations using the MCP protocol. Bookings, occupancy and revenue queries become available in a standard, secure way.',
    },
    stack: ['Python', 'MCP', 'REST APIs'],
    year: '2025',
    power: 85,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
    featured: true,
  },
  {
    id: 'rival-scanner',
    name: 'Rival Scanner',
    category: 'fullstack',
    element: { pt: 'Inteligência', en: 'Intelligence' },
    tagline: {
      pt: 'Dashboard que monitora a concorrência hoteleira em Campos do Jordão.',
      en: 'A dashboard that watches the hotel competition in Campos do Jordão.',
    },
    description: {
      pt: 'Coleta e organiza preços e disponibilidade de hotéis concorrentes a partir de portais de reserva, apresentando tudo em um painel comparativo. Ajuda a precificar diárias com dados, não achismo.',
      en: 'Collects and organizes competitor prices and availability from booking portals, presenting everything in a comparison panel. Helps price rooms with data instead of guesswork.',
    },
    stack: ['React', 'Node.js', 'Web Scraping', 'PostgreSQL'],
    year: '2024',
    power: 80,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
  },
  {
    id: 'adventure-hub',
    name: 'Adventure Hub',
    category: 'fullstack',
    element: { pt: 'Plataforma', en: 'Platform' },
    tagline: {
      pt: 'Plataforma de reservas para passeios de aventura na Mantiqueira.',
      en: 'A booking platform for adventure tours in the Mantiqueira range.',
    },
    description: {
      pt: 'Sistema que conecta turistas a passeios e guias locais: catálogo, agenda, reservas e pagamento. Pensado para escalar para várias operadoras da região.',
      en: 'A system that connects tourists with tours and local guides: catalog, scheduling, bookings and payment. Designed to scale across several regional operators.',
    },
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind'],
    year: '2024',
    power: 78,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
  },
  {
    id: 'chalet-boutique',
    name: 'Chalet Boutique',
    category: 'frontend',
    element: { pt: 'Interface', en: 'Interface' },
    tagline: {
      pt: 'Landing page e reservas para uma pousada boutique.',
      en: 'Landing page and bookings for a boutique inn.',
    },
    description: {
      pt: 'Site vitrine com identidade sofisticada e fluxo de reserva integrado. Foco em performance, responsividade e uma primeira impressão memorável.',
      en: 'A showcase site with a refined identity and an integrated booking flow. Focused on performance, responsiveness and a memorable first impression.',
    },
    stack: ['React', 'TypeScript', 'Tailwind', 'Vite'],
    year: '2024',
    power: 76,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
  },
  {
    id: 'lodge-nexus',
    name: 'Lodge Nexus',
    category: 'frontend',
    element: { pt: 'Interface', en: 'Interface' },
    tagline: {
      pt: 'Site moderno com CMS para uma rede de pousadas.',
      en: 'A modern site with a CMS for a lodge network.',
    },
    description: {
      pt: 'Proposta de site institucional com conteúdo gerenciável, blog e SEO. Arquitetura organizada para a equipe atualizar o conteúdo sem depender de dev.',
      en: 'A proposal for an institutional site with manageable content, blog and SEO. A tidy architecture so the team can update content without a developer.',
    },
    stack: ['Next.js', 'React', 'CMS'],
    year: '2024',
    power: 74,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
  },
  {
    id: 'forest-haven',
    name: 'Forest Haven',
    category: 'frontend',
    element: { pt: 'Interface', en: 'Interface' },
    tagline: {
      pt: 'Demo elegante para um grupo de pousadas.',
      en: 'An elegant demo for a group of inns.',
    },
    description: {
      pt: 'Protótipo de alta fidelidade explorando aconchego e natureza como linguagem visual, com animações sutis e carregamento rápido.',
      en: 'A high-fidelity prototype exploring warmth and nature as a visual language, with subtle animations and fast loading.',
    },
    stack: ['React', 'Vite', 'CSS'],
    year: '2024',
    power: 70,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
  },
  {
    id: 'travels-guild',
    name: 'Travels Guild',
    category: 'data',
    element: { pt: 'Marketplace', en: 'Marketplace' },
    tagline: {
      pt: 'Marketplace que conecta turistas a guias locais.',
      en: 'A marketplace connecting tourists with local guides.',
    },
    description: {
      pt: 'Rede de dois lados com perfis de guias, avaliações, busca por interesse e reservas. Modelo de dados robusto para lidar com disponibilidade e reputação.',
      en: 'A two-sided network with guide profiles, reviews, interest-based search and bookings. A robust data model to handle availability and reputation.',
    },
    stack: ['React', 'Node.js', 'PostgreSQL'],
    year: '2024',
    power: 73,
    links: { repo: 'https://github.com/ronaldoribeirosm' },
  },
];

export const projectFilters: { key: ProjectCategory | 'all'; label: Localized }[] = [
  { key: 'all', label: { pt: 'Todos', en: 'All' } },
  { key: 'automation', label: { pt: 'Automação', en: 'Automation' } },
  { key: 'backend', label: { pt: 'Backend', en: 'Backend' } },
  { key: 'frontend', label: { pt: 'Frontend', en: 'Frontend' } },
  { key: 'fullstack', label: { pt: 'Full Stack', en: 'Full Stack' } },
  { key: 'data', label: { pt: 'Dados', en: 'Data' } },
];

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export interface SkillGroup {
  key: string;
  label: Localized;
  color: 'primary' | 'secondary' | 'accent' | 'violet' | 'grass';
  skills: { name: string; value: number }[];
}

export const skillGroups: SkillGroup[] = [
  {
    key: 'frontend',
    label: { pt: 'Frontend & UI', en: 'Frontend & UI' },
    color: 'primary',
    skills: [
      { name: 'React', value: 85 },
      { name: 'TypeScript', value: 80 },
      { name: 'Tailwind CSS', value: 85 },
      { name: 'Next.js', value: 80 },
      { name: 'Vue.js', value: 70 },
    ],
  },
  {
    key: 'backend',
    label: { pt: 'Backend', en: 'Backend' },
    color: 'secondary',
    skills: [
      { name: 'Python', value: 88 },
      { name: 'Node.js', value: 85 },
      { name: 'Express', value: 80 },
      { name: 'Django', value: 78 },
      { name: 'FastAPI', value: 78 },
    ],
  },
  {
    key: 'data',
    label: { pt: 'Dados', en: 'Data' },
    color: 'violet',
    skills: [
      { name: 'PostgreSQL', value: 85 },
      { name: 'MySQL', value: 82 },
      { name: 'MongoDB', value: 75 },
      { name: 'Supabase', value: 80 },
    ],
  },
  {
    key: 'automation',
    label: { pt: 'Automação & APIs', en: 'Automation & APIs' },
    color: 'accent',
    skills: [
      { name: 'REST APIs', value: 88 },
      { name: 'Google Apps Script', value: 85 },
      { name: 'Automação', value: 85 },
      { name: 'Web Scraping', value: 75 },
    ],
  },
  {
    key: 'devops',
    label: { pt: 'DevOps & Ferramentas', en: 'DevOps & Tooling' },
    color: 'grass',
    skills: [
      { name: 'Git & GitHub', value: 95 },
      { name: 'Linux', value: 85 },
      { name: 'Docker', value: 75 },
      { name: 'AWS (base)', value: 65 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Experiência                                                         */
/* ------------------------------------------------------------------ */

export interface ExperienceEntry {
  id: string;
  period: Localized;
  role: Localized;
  place: string;
  summary: Localized;
  highlights: Localized[];
  current?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    id: 'quebra-noz',
    period: { pt: '04/2025 — Atual', en: '04/2025 — Present' },
    role: { pt: 'Suporte Técnico & Automação', en: 'Technical Support & Automation' },
    place: 'Hotel Quebra-Noz',
    summary: {
      pt: 'Resolvo problemas reais de operação com código e mantenho os sistemas do hotel funcionando.',
      en: 'I solve real operational problems with code and keep the hotel systems running.',
    },
    highlights: [
      { pt: 'Automação de rotinas de recepção e ocupação', en: 'Automation of front-desk and occupancy routines' },
      { pt: 'Integração com a plataforma Cloudbeds', en: 'Integration with the Cloudbeds platform' },
      { pt: 'Suporte técnico presencial e a sistemas', en: 'In-person and systems technical support' },
    ],
    current: true,
  },
  {
    id: 'freelance',
    period: { pt: '03/2024 — 03/2025', en: '03/2024 — 03/2025' },
    role: { pt: 'Desenvolvedor Full Stack Freelancer', en: 'Freelance Full Stack Developer' },
    place: 'Freelancer',
    summary: {
      pt: 'Sites, sistemas de reserva e automações sob medida para clientes do setor de turismo.',
      en: 'Websites, booking systems and tailored automations for tourism-sector clients.',
    },
    highlights: [
      { pt: 'Sites de hotéis em React e Node.js', en: 'Hotel websites in React and Node.js' },
      { pt: 'Sistemas de reserva ponta a ponta', en: 'End-to-end booking systems' },
      { pt: 'Automações personalizadas', en: 'Custom automations' },
    ],
  },
  {
    id: 'student',
    period: { pt: '2023 — Em andamento', en: '2023 — Ongoing' },
    role: { pt: 'Estudante & Builder', en: 'Student & Builder' },
    place: 'IFSP',
    summary: {
      pt: 'Base sólida em fundamentos, muitos projetos práticos e um portfolio em constante evolução.',
      en: 'A solid grounding in fundamentals, plenty of hands-on projects and an ever-evolving portfolio.',
    },
    highlights: [
      { pt: 'Técnico em TI (IFSP)', en: 'IT Technician (IFSP)' },
      { pt: 'Cursando Análise e Desenvolvimento de Sistemas', en: 'Studying Systems Analysis & Development' },
      { pt: 'Primeiros projetos reais e portfolio', en: 'First real projects and portfolio' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Conquistas (gamificação)                                            */
/* ------------------------------------------------------------------ */

export type AchievementId =
  | 'first-boot'
  | 'explorer'
  | 'collector'
  | 'linked'
  | 'challenger'
  | 'sender'
  | 'secret'
  | 'maxed';

export interface Achievement {
  id: AchievementId;
  icon: string; // caractere/símbolo simples renderizado com a fonte pixel
  title: Localized;
  desc: Localized;
  xp: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first-boot',
    icon: '▶',
    title: { pt: 'Insira a Ficha', en: 'Insert Coin' },
    desc: { pt: 'Iniciou a aventura.', en: 'Started the adventure.' },
    xp: 50,
  },
  {
    id: 'explorer',
    icon: '✦',
    title: { pt: 'Explorador', en: 'Explorer' },
    desc: { pt: 'Visitou todas as áreas.', en: 'Visited every area.' },
    xp: 200,
  },
  {
    id: 'collector',
    icon: '◈',
    title: { pt: 'Colecionador', en: 'Collector' },
    desc: { pt: 'Abriu todos os projetos.', en: 'Opened every project.' },
    xp: 300,
  },
  {
    id: 'linked',
    icon: '↗',
    title: { pt: 'Conectado', en: 'Connected' },
    desc: { pt: 'Seguiu um link externo.', en: 'Followed an external link.' },
    xp: 100,
  },
  {
    id: 'challenger',
    icon: '✉',
    title: { pt: 'Desafiante', en: 'Challenger' },
    desc: { pt: 'Chegou à área de contato.', en: 'Reached the contact area.' },
    xp: 150,
  },
  {
    id: 'sender',
    icon: '★',
    title: { pt: 'Mensagem Enviada', en: 'Message Sent' },
    desc: { pt: 'Enviou uma mensagem.', en: 'Sent a message.' },
    xp: 1000,
  },
  {
    id: 'secret',
    icon: '❖',
    title: { pt: 'Código Secreto', en: 'Secret Code' },
    desc: { pt: 'Descobriu o código clássico.', en: 'Found the classic code.' },
    xp: 500,
  },
  {
    id: 'maxed',
    icon: '♛',
    title: { pt: 'Nível Máximo', en: 'Max Level' },
    desc: { pt: 'Alcançou o topo.', en: 'Reached the top.' },
    xp: 999,
  },
];

/* ------------------------------------------------------------------ */
/* Strings da interface                                                */
/* ------------------------------------------------------------------ */

export const ui = {
  nav: {
    about: { pt: 'Perfil', en: 'Profile' },
    projects: { pt: 'Projetos', en: 'Projects' },
    skills: { pt: 'Skills', en: 'Skills' },
    experience: { pt: 'Jornada', en: 'Journey' },
    contact: { pt: 'Contato', en: 'Contact' },
  },
  openToWork: { pt: 'Disponível para trabalho', en: 'Open to work' },
  soundOn: { pt: 'Som ligado', en: 'Sound on' },
  soundOff: { pt: 'Som desligado', en: 'Sound off' },
  themeToggle: { pt: 'Trocar tema', en: 'Switch theme' },
  langToggle: { pt: 'Idioma', en: 'Language' },

  hero: {
    kicker: { pt: 'Pressione START', en: 'Press START' },
    ctaProjects: { pt: 'Ver projetos', en: 'View projects' },
    ctaContact: { pt: 'Entrar em contato', en: 'Get in touch' },
    scroll: { pt: 'role para explorar', en: 'scroll to explore' },
  },

  about: {
    title: { pt: 'Perfil do Jogador', en: 'Player Profile' },
    stats: { pt: 'Atributos', en: 'Attributes' },
    ready: { pt: 'Pronto para o próximo desafio', en: 'Ready for the next challenge' },
  },

  projects: {
    title: { pt: 'Codex de Projetos', en: 'Project Codex' },
    subtitle: {
      pt: 'Um projeto selvagem apareceu! Capture cada um para ler a ficha completa.',
      en: 'A wild project appeared! Capture each one to read its full entry.',
    },
    open: { pt: 'Capturar', en: 'Capture' },
    gotcha: { pt: 'CAPTURADO!', en: 'GOTCHA!' },
    viewCode: { pt: 'Código', en: 'Code' },
    viewDemo: { pt: 'Demo', en: 'Demo' },
    stack: { pt: 'Stack', en: 'Stack' },
    power: { pt: 'Poder', en: 'Power' },
    close: { pt: 'Fechar', en: 'Close' },
    empty: { pt: 'Nenhum projeto nessa categoria.', en: 'No projects in this category.' },
  },

  skills: {
    title: { pt: 'Skills & Stack', en: 'Skills & Stack' },
    subtitle: {
      pt: 'Ferramentas que uso para transformar ideias em software.',
      en: 'The tools I use to turn ideas into software.',
    },
  },

  experience: {
    title: { pt: 'A Jornada', en: 'The Journey' },
    subtitle: {
      pt: 'De estudante a resolvedor de problemas em produção.',
      en: 'From student to production problem-solver.',
    },
    now: { pt: 'AGORA', en: 'NOW' },
  },

  contact: {
    title: { pt: 'Enviar Mensagem', en: 'Send a Message' },
    subtitle: {
      pt: 'Tem um projeto ou uma vaga? Manda ver.',
      en: 'Have a project or a role in mind? Let’s talk.',
    },
    name: { pt: 'Nome', en: 'Name' },
    email: { pt: 'E-mail', en: 'Email' },
    subject: { pt: 'Assunto', en: 'Subject' },
    message: { pt: 'Mensagem', en: 'Message' },
    send: { pt: 'Enviar', en: 'Send' },
    sending: { pt: 'Enviando…', en: 'Sending…' },
    clear: { pt: 'Limpar', en: 'Clear' },
    orReach: { pt: 'Ou me encontre em', en: 'Or find me at' },
    successTitle: { pt: 'Mensagem enviada!', en: 'Message sent!' },
    successBody: {
      pt: 'Valeu por chegar até aqui. Respondo o mais rápido possível.',
      en: 'Thanks for reaching the end. I’ll reply as soon as I can.',
    },
    again: { pt: 'Enviar outra', en: 'Send another' },
    errName: { pt: 'Diz seu nome.', en: 'Please enter your name.' },
    errEmail: { pt: 'E-mail inválido.', en: 'Invalid email.' },
    errMessage: { pt: 'Escreve uma mensagem (mín. 10 caracteres).', en: 'Write a message (min. 10 chars).' },
  },

  hud: {
    level: { pt: 'NÍVEL', en: 'LEVEL' },
    xp: { pt: 'XP', en: 'XP' },
    achievements: { pt: 'Conquistas', en: 'Achievements' },
    unlocked: { pt: 'desbloqueada', en: 'unlocked' },
    progress: { pt: 'Progresso', en: 'Progress' },
  },

  minigame: {
    title: { pt: 'Caça-Bugs', en: 'Bug Hunt' },
    intro: {
      pt: 'Mova com o mouse ou ← → e capture os bugs antes que escapem. Você tem 30s!',
      en: 'Move with the mouse or ← → and catch the bugs before they escape. You have 30s!',
    },
    start: { pt: 'Começar', en: 'Start' },
    replay: { pt: 'Jogar de novo', en: 'Play again' },
    close: { pt: 'Sair', en: 'Quit' },
    score: { pt: 'Pontos', en: 'Score' },
    time: { pt: 'Tempo', en: 'Time' },
    result: { pt: 'Bugs capturados', en: 'Bugs caught' },
    reward: { pt: 'Recompensa', en: 'Reward' },
    hintFound: { pt: 'Você encontrou o mini-game!', en: 'You found the mini-game!' },
  },

  footer: {
    madeWith: { pt: 'Feito com café e muito código', en: 'Made with coffee and a lot of code' },
    hint: {
      pt: 'Dica: existe um código clássico escondido por aqui.',
      en: 'Hint: there’s a classic code hidden around here.',
    },
    rights: { pt: 'Todos os direitos reservados.', en: 'All rights reserved.' },
    backToTop: { pt: 'Voltar ao topo', en: 'Back to top' },
  },
} as const;
