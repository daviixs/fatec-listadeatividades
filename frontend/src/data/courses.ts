export type Activity = {
  id: string;
  title: string;
  deadline: string;
  status: 'pending' | 'completed' | 'late';
};

export type Subject = {
  id: string;
  name: string;
  activities?: Activity[];
};

export type Semester = {
  id: string;
  name: string;
  subjects: Subject[];
};

export type Course = {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  icon?: string;
  semesters: Semester[];
};

export const courses: Course[] = [
  {
    id: 'ads',
    name: 'ADS',
    fullName: 'Análise e Desenvolvimento de Sistemas',
    description: 'Criação e organização de sistemas e programas.',
    semesters: [
      {
        id: '1',
        name: '1º semestre',
        subjects: [
          { id: 'es1', name: 'Engenharia de Software I' },
          { id: 'alp', name: 'Algoritmos e Lógica de Programação' },
          { id: 'so', name: 'Sistemas Operacionais' },
          { id: 'aoc', name: 'Arquitetura e Organização de Computadores' },
          { id: 'ce1', name: 'Comunicação e Expressão' },
          { id: 'ing1', name: 'Inglês I' },
          { id: 'pi1', name: 'Projeto Integrador I' },
        ],
      },
      {
        id: '2',
        name: '2º semestre',
        subjects: [
          { id: 'bdr', name: 'Banco de Dados Relacional' },
          { id: 'es2', name: 'Engenharia de Software II' },
          { id: 'lp', name: 'Linguagem de Programação' },
          { id: 'calc', name: 'Cálculo' },
          { id: 'ihc', name: 'Interação Humano Computador' },
          { id: 'ce2', name: 'Comunicação e Expressão II' },
          { id: 'ing2', name: 'Inglês II' },
          { id: 'gfet', name: 'Gestão Financeira Empresarial com Tecnologias' },
        ],
      },
      {
        id: '3',
        name: '3º semestre',
        subjects: [
          { id: 'lbd', name: 'Laboratório de Banco de Dados' },
          { id: 'gn', name: 'Gestão de Negócios' },
          { id: 'ux', name: 'Experiência do Usuário' },
          { id: 'poo1', name: 'Programação Orientada a Objetos' },
          { id: 'ed', name: 'Estrutura de Dados' },
          { id: 'gpa', name: 'Gestão de Projetos Ágeis' },
          { id: 'ing3', name: 'Inglês III' },
        ],
      },
      {
        id: '4',
        name: '4º semestre',
        subjects: [
          { id: 'es3', name: 'Engenharia de Software III' },
          { id: 'poo2', name: 'Programação Orientada a Objetos' },
          { id: 'bd', name: 'Banco de Dados' },
          { id: 'so2', name: 'Sistemas Operacionais II' },
          { id: 'pw', name: 'Programação Web' },
          { id: 'mptc', name: 'Metodologia da Pesquisa Tecnológica Científica' },
          { id: 'ing4', name: 'Inglês IV' },
        ],
      },
      {
        id: '5',
        name: '5º semestre',
        subjects: [
          { id: 'rc1', name: 'Redes de Computadores I' },
          { id: 'pl', name: 'Programação Linear' },
          { id: 'les', name: 'Laboratório de Engenharia de Software' },
          { id: 'si', name: 'Segurança da Informação' },
          { id: 'ps', name: 'Programação Script' },
          { id: 'lbd5', name: 'Laboratório de Banco de Dados' },
          { id: 'ing5', name: 'Inglês V' },
        ],
      },
      {
        id: '6',
        name: '6º semestre',
        subjects: [
          { id: 'ia', name: 'Inteligência Artificial' },
          { id: 'gp', name: 'Gestão de Projetos' },
          { id: 'emp', name: 'Empreendedorismo' },
          { id: 'ge', name: 'Gestão de Equipes' },
          { id: 'ggti', name: 'Gestão e Governança de TI' },
          { id: 'er', name: 'Ética e Responsabilidade' },
          { id: 'ing6', name: 'Inglês VI' },
          { id: 'te', name: 'Tópicos Especiais' },
        ],
      },
    ],
  },
  {
    id: 'dsm',
    name: 'DSM',
    fullName: 'Desenvolvimento de Software Multiplataforma',
    description: 'Criação de aplicativos para web, celular e outros dispositivos.',
    semesters: [
      {
        id: '1',
        name: '1º semestre',
        subjects: [
          { id: 'mbd', name: 'Modelagem de Banco de Dados' },
          { id: 'dw1', name: 'Desenvolvimento Web I' },
          { id: 'alp', name: 'Algoritmos e Lógica de Programação' },
          { id: 'es1', name: 'Engenharia de Software I' },
          { id: 'dd', name: 'Design Digital' },
          { id: 'sor', name: 'Sistemas Operacionais e Redes' },
          { id: 'ing1', name: 'Inglês I' },
        ],
      },
      {
        id: '2',
        name: '2º semestre',
        subjects: [
          { id: 'bdr', name: 'Banco de Dados Relacional' },
          { id: 'dw2', name: 'Desenvolvimento Web II' },
          { id: 'tp1', name: 'Técnicas de Programação I' },
          { id: 'es2', name: 'Engenharia de Software II' },
          { id: 'ed', name: 'Estrutura de Dados' },
          { id: 'mc', name: 'Matemática para Computação' },
          { id: 'ing2', name: 'Inglês II' },
        ],
      },
      {
        id: '3',
        name: '3º semestre',
        subjects: [
          { id: 'bdnr', name: 'Banco de Dados Não Relacional' },
          { id: 'dw3', name: 'Desenvolvimento Web III' },
          { id: 'tp2', name: 'Técnicas de Programação II' },
          { id: 'gap', name: 'Gestão Ágil de Projetos' },
          { id: 'al', name: 'Álgebra Linear' },
          { id: 'ihc', name: 'Interação Humano Computador' },
          { id: 'ing3', name: 'Inglês III' },
        ],
      },
      {
        id: '4',
        name: '4º semestre',
        subjects: [
          { id: 'iec', name: 'Integração e Entrega Contínua' },
          { id: 'ldw', name: 'Laboratório de Desenvolvimento Web' },
          { id: 'pdm1', name: 'Programação para Dispositivos Móveis I' },
          { id: 'iots', name: 'Internet das Coisas e Aplicações' },
          { id: 'ea', name: 'Estatística Aplicada' },
          { id: 'ux', name: 'Experiência do Usuário' },
          { id: 'ing4', name: 'Inglês IV' },
        ],
      },
      {
        id: '5',
        name: '5º semestre',
        subjects: [
          { id: 'sda', name: 'Segurança no Desenvolvimento de Aplicações' },
          { id: 'lddm', name: 'Lab. de Desenvolvimento para Dispositivos Móveis' },
          { id: 'pdm2', name: 'Programação para Dispositivos Móveis II' },
          { id: 'am', name: 'Aprendizagem de Máquina' },
          { id: 'cn1', name: 'Computação em Nuvem I' },
        ],
      },
      {
        id: '6',
        name: '6º semestre',
        subjects: [
          { id: 'md', name: 'Mineração de Dados' },
          { id: 'ldm', name: 'Lab. de Desenvolvimento Multiplataforma' },
          { id: 'qts', name: 'Qualidade e Testes de Software' },
          { id: 'pln', name: 'Processamento de Linguagem Natural' },
          { id: 'cn2', name: 'Computação em Nuvem II' },
          { id: 'epp', name: 'Ética Profissional e Patente' },
        ],
      },
    ],
  },
  {
    id: 'gpi',
    name: 'GPI',
    fullName: 'Gestão da Produção Industrial',
    description: 'Organização e melhoria de processos industriais.',
    semesters: [
      {
        id: '1',
        name: '1º Semestre',
        subjects: [
          { id: 'info', name: 'Informática' },
          { id: 'tp', name: 'Tecnologia da Produção' },
          { id: 'fce', name: 'Fundamentos de Comunicação Empresarial' },
          { id: 'calc', name: 'Cálculo' },
          { id: 'adm', name: 'Administração' },
          { id: 'mp', name: 'Métodos de Pesquisa' },
          { id: 'ing1', name: 'Inglês I' },
          { id: 'pigpi1', name: 'Projeto Integrador GPI I' },
        ],
      },
      {
        id: '2',
        name: '2º Semestre',
        subjects: [
          { id: 'mt1', name: 'Materiais e Tratamentos I' },
          { id: 'est', name: 'Estatística' },
          { id: 'fmf', name: 'Fundamentos de Matemática Financeira' },
          { id: 'erg', name: 'Ergonomia' },
          { id: 'ic', name: 'Introdução à Contabilidade' },
          { id: 'le', name: 'Liderança e Empreendedorismo' },
          { id: 'ing2', name: 'Inglês II' },
          { id: 'pigpi2', name: 'Projeto Integrador GPI II' },
        ],
      },
      {
        id: '3',
        name: '3º Semestre',
        subjects: [
          { id: 'epo', name: 'Estratégia de Produção e Operações' },
          { id: 'gpa', name: 'Gestão da Produção Aplicada' },
          { id: 'eco', name: 'Economia' },
          { id: 'ci', name: 'Custos Industriais' },
          { id: 'mt2', name: 'Materiais e Tratamentos II' },
          { id: 'pp1', name: 'Projeto de Produto I' },
          { id: 'ing3', name: 'Inglês III' },
        ],
      },
      {
        id: '4',
        name: '4º Semestre',
        subjects: [
          { id: 'pp', name: 'Processo de Produção' },
          { id: 'hst', name: 'Higiene e Segurança do Trabalho' },
          { id: 'pp2', name: 'Projeto de Produto II' },
          { id: 'gq', name: 'Gestão da Qualidade' },
          { id: 'ppcp', name: 'PPCP (Planejamento e Controle da Produção)' },
          { id: 'ai', name: 'Automação Industrial' },
          { id: 'pigpi3', name: 'Projeto Integrador GPI III' },
          { id: 'ing4', name: 'Inglês IV' },
        ],
      },
      {
        id: '5',
        name: '5º Semestre',
        subjects: [
          { id: 'esp1', name: 'Espanhol I' },
          { id: 'ga', name: 'Gestão Ambiental' },
          { id: 'fgp', name: 'Fundamentos de Gestão de Projetos' },
          { id: 'gf', name: 'Gestão Financeira' },
          { id: 'gcs', name: 'Gestão da Cadeia de Suprimentos' },
          { id: 'pf', name: 'Projeto de Fábrica' },
          { id: 'pg1', name: 'Projeto de Graduação I' },
        ],
      },
      {
        id: '6',
        name: '6º Semestre',
        subjects: [
          { id: 'ti', name: 'Tecnologia da Informação' },
          { id: 'ce', name: 'Comércio Exterior' },
          { id: 'sap', name: 'SAP' },
          { id: 'mv', name: 'Marketing e Vendas' },
          { id: 'gp', name: 'Gestão de Pessoas' },
          { id: 'esp2', name: 'Espanhol II' },
          { id: 'pg2', name: 'Projeto de Graduação II' },
        ],
      },
    ],
  },
  {
    id: 'grh',
    name: 'GRH',
    fullName: 'Gestão de Recursos Humanos',
    description: 'Cuidado com pessoas, equipes e desenvolvimento profissional.',
    semesters: [
      {
        id: '1',
        name: '1º Semestre',
        subjects: [
          { id: 'pi1', name: 'Projeto Integrador I' },
          { id: 'me', name: 'Matemática Elementar' },
          { id: 'co', name: 'Comportamento Organizacional' },
          { id: 'lpt', name: 'Leitura e Produção de Textos' },
          { id: 'gri', name: 'Gestão das Relações Interpessoais' },
          { id: 'ag', name: 'Administração Geral' },
          { id: 'ing1', name: 'Inglês I' },
        ],
      },
      {
        id: '2',
        name: '2º Semestre',
        subjects: [
          { id: 'ce', name: 'Comunicação Empresarial' },
          { id: 'mpc', name: 'Métodos para Produção do Conhecimento' },
          { id: 'gpap', name: 'Gestão de Pessoas na Administração Pública' },
          { id: 'esp1', name: 'Espanhol I' },
          { id: 'cst', name: 'Captação e Seleção de Talentos' },
          { id: 'est', name: 'Estatística' },
          { id: 'ing2', name: 'Inglês II' },
          { id: 'pi2', name: 'Projeto Integrador II' },
        ],
      },
      {
        id: '3',
        name: '3º Semestre',
        subjects: [
          { id: 'pi3', name: 'Projeto Integrador III' },
          { id: 'esp2', name: 'Espanhol II' },
          { id: 'ing3', name: 'Inglês III' },
          { id: 'iagp1', name: 'Informática Aplicada à Gestão de Pessoas I' },
          { id: 'ltp', name: 'Legislação Trabalhista e Previdenciária' },
          { id: 'ec', name: 'Educação Corporativa' },
          { id: 'grp1', name: 'Gestão das Rotinas de Pessoal I' },
          { id: 'fe', name: 'Fundamentos de Economia' },
        ],
      },
      {
        id: '4',
        name: '4º Semestre',
        subjects: [
          { id: 'gis', name: 'Gestão da Inclusão Social' },
          { id: 'gf', name: 'Gestão Financeira' },
          { id: 'gcb', name: 'Gestão de Carreira e Benefícios' },
          { id: 'grp2', name: 'Gestão das Rotinas de Pessoal II' },
          { id: 'iagp2', name: 'Informática Aplicada à Gestão de Pessoas II' },
          { id: 'gco', name: 'Gestão do Clima Organizacional' },
          { id: 'ing4', name: 'Inglês IV' },
          { id: 'pi4', name: 'Projeto Integrador IV' },
        ],
      },
      {
        id: '5',
        name: '5º Semestre',
        subjects: [
          { id: 'prh1', name: 'Projeto de Recursos Humanos I' },
          { id: 'emp', name: 'Empreendedorismo' },
          { id: 'egci', name: 'Endomarketing e Gestão de Clientes Internos' },
          { id: 'gpc', name: 'Gestão por Competências' },
          { id: 'sso', name: 'Saúde e Segurança Ocupacional' },
          { id: 'gcn', name: 'Gestão de Conflitos e Negociação' },
          { id: 're', name: 'Remuneração Estratégica' },
          { id: 'ing5', name: 'Inglês V' },
        ],
      },
      {
        id: '6',
        name: '6º Semestre',
        subjects: [
          { id: 'prh2', name: 'Projeto de Recursos Humanos II' },
          { id: 'gc', name: 'Gestão do Conhecimento' },
          { id: 'agvt', name: 'Auditoria e Gestão da Qualidade de Vida no Trabalho' },
          { id: 'tegth', name: 'Tópicos Especiais em Gestão de Talentos Humanos' },
          { id: 'perh', name: 'Planejamento Estratégico em RH' },
          { id: 'cgp', name: 'Consultoria em Gestão de Pessoas' },
          { id: 'erse', name: 'Ética e Responsabilidade Social Empresarial' },
          { id: 'ing6', name: 'Inglês VI' },
        ],
      },
    ],
  },
];

export const getCourseById = (id: string) => courses.find((course) => course.id === id);

export const getSemesterById = (courseId: string, semesterId: string) => {
  const course = getCourseById(courseId);
  return course?.semesters.find((semester) => semester.id === semesterId);
};

export const getSubjectById = (courseId: string, semesterId: string, subjectId: string) => {
  const semester = getSemesterById(courseId, semesterId);
  return semester?.subjects.find((subject) => subject.id === subjectId);
};
