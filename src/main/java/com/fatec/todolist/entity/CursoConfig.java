package com.fatec.todolist.entity;

import java.util.List;
import java.util.Map;

public enum CursoConfig {

    ADS("ADS", "Análise e Desenvolvimento de Sistemas", Map.of(
        1, List.of(
            "Arquitetura de Computadores",
            "Desenvolvimento de Interface Web",
            "Engenharia de Requisitos",
            "Estrutura de Dados",
            "Lógica de Programação",
            "Matemática Aplicada",
            "Programação Modular"
        ),
        2, List.of(
            "Algoritmos e Estruturas de Dados",
            "Banco de Dados I",
            "Design de Software",
            "Engenharia de Software",
            "Interação Humano-Computador",
            "Marketing Digital",
            "Paradigmas de Programação",
            "Tópicos em Computação"
        ),
        3, List.of(
            "Banco de Dados II",
            "Desenvolvimento de Aplicações Corporativas",
            "Empreendedorismo",
            "Gestão de Projetos de Software",
            "Linguagens de Programação",
            "Modelagem de Sistemas",
            "Sistemas Operacionais"
        ),
        4, List.of(
            "Computação em Nuvem",
            "Desenvolvimento Móvel",
            "Gestão de TI",
            "Programação para Web",
            "Qualidade de Software",
            "Segurança da Informação",
            "Tópicos Especiais"
        ),
        5, List.of(
            "Arquitetura de Software",
            "Banco de Dados III",
            "Data Science",
            "DevOps",
            "Integração de Sistemas",
            "Processos de Software",
            "Tópicos Avançados"
        ),
        6, List.of(
            "Business Intelligence",
            "Computação Gráfica",
            "Desenvolvimento de Jogos",
            "Internet das Coisas",
            "Machine Learning",
            "Redes de Computadores",
            "Sistemas Distribuídos",
            "TCC I e II"
        )
    )),

    DSM("DSM", "Desenvolvimento de Software Multiplataforma", Map.of(
        1, List.of(
            "Análise e Projeto de Sistemas",
            "Arquitetura de Computadores",
            "Desenvolvimento de Interface Web",
            "Estrutura de Dados",
            "Lógica de Programação",
            "Matemática Aplicada",
            "Programação Modular"
        ),
        2, List.of(
            "Algoritmos e Estruturas de Dados",
            "Banco de Dados I",
            "Design de Software",
            "Engenharia de Software",
            "Interação Humano-Computador",
            "Paradigmas de Programação",
            "Tópicos em Computação"
        ),
        3, List.of(
            "Banco de Dados II",
            "Desenvolvimento de Aplicações Corporativas",
            "Empreendedorismo",
            "Gestão de Projetos de Software",
            "Linguagens de Programação",
            "Modelagem de Sistemas",
            "Sistemas Operacionais"
        ),
        4, List.of(
            "Computação em Nuvem",
            "Desenvolvimento Móvel",
            "Gestão de TI",
            "Programação para Web",
            "Qualidade de Software",
            "Segurança da Informação",
            "Tópicos Especiais"
        ),
        5, List.of(
            "DevOps",
            "Integração de Sistemas",
            "Processos de Software",
            "Segurança Avançada",
            "Tópicos Avançados"
        ),
        6, List.of(
            "Business Intelligence",
            "Data Science",
            "Internet das Coisas",
            "Machine Learning",
            "Redes de Computadores",
            "TCC I e II"
        )
    )),

    GRH("GRH", "Gestão de Recursos Humanos", Map.of(
        1, List.of(
            "Administração de Recursos Humanos",
            "Análise Organizacional",
            "Contabilidade Básica",
            "Direito do Trabalho",
            "Ética e Responsabilidade Social",
            "Fundamentos de Administração",
            "Psicologia Organizacional"
        ),
        2, List.of(
            "Cálculo Financeiro",
            "Gestão da Qualidade",
            "Gestão de Custos",
            "Gestão Estratégica de Pessoas",
            "Legislação Trabalhista",
            "Planejamento Estratégico",
            "Relações Trabalhistas",
            "Treinamento e Desenvolvimento"
        ),
        3, List.of(
            "Gestão de Benefícios",
            "Gestão de Carreiras",
            "Gestão de Desempenho",
            "Gestão do Clima Organizacional",
            "Gestão por Competências",
            "Psicologia Social",
            "Saúde e Segurança do Trabalho"
        ),
        4, List.of(
            "Comunicação Empresarial",
            "Gestão de Talentos",
            "Marketing Pessoal",
            "Negociação e Mediação",
            "Planejamento de Carreira",
            "Processos de Recrutamento e Seleção",
            "Teoria das Organizações",
            "Trabalho em Equipe"
        ),
        5, List.of(
            "Auditoria de RH",
            "Consultoria em RH",
            "Gestão de Crises",
            "Gestão da Mudança Organizacional",
            "Liderança",
            "Planejamento de RH",
            "Tecnologias em RH",
            "Terceirização"
        ),
        6, List.of(
            "Comportamento Organizacional",
            "Cultura Organizacional",
            "Gestão do Conhecimento",
            "Inteligência Emocional",
            "Tendências em RH",
            "TCC I e II",
            "Trabalho Remoto"
        )
    )),

    GPI("GPI", "Gestão de Projetos e Inovação", Map.of(
        1, List.of(
            "Administração de Projetos",
            "Análise de Viabilidade",
            "Engenharia de Requisitos",
            "Fundamentos de PMO",
            "Gerenciamento de Riscos",
            "Metodologias de Projetos",
            "Planejamento de Projetos",
            "Programação de Projetos"
        ),
        2, List.of(
            "Análise de Cenários",
            "Compras e Contratos",
            "Gestão da Comunicação",
            "Gestão de Escopo",
            "Gestão de Tempo",
            "MS Project",
            "Planejamento Estratégico de Projetos",
            "PMBOK Aplicado"
        ),
        3, List.of(
            "Agile e Scrum",
            "Gestão da Qualidade",
            "Gestão de Custos",
            "Gestão de Integração",
            "Gestão de Stakeholders",
            "Kaizen",
            "Lean Six Sigma"
        ),
        4, List.of(
            "Escritório de Projetos",
            "Gestão de Mudanças",
            "Gestão de Portfólios",
            "Governança de TI",
            "Indicadores de Desempenho",
            "Maturidade em Projetos",
            "Office 365",
            "Project Server"
        ),
        5, List.of(
            "Analytics em Projetos",
            "Business Intelligence",
            "Design Thinking",
            "Inovação",
            "Metodologias Híbridas",
            "TCC I e II",
            "Técnicas de Negociação"
        ),
        6, List.of(
            "Consultoria em Projetos",
            "Gestão Ágil de Portfólios",
            "Gestão de Programas",
            "Modelagem de Processos",
            "PMO Digital",
            "Transformação Digital",
            "TCC I e II"
        )
    ));

    private final String sigla;
    private final String nomeCompleto;
    private final Map<Integer, List<String>> materiasPorSemestre;

    CursoConfig(String sigla, String nomeCompleto, Map<Integer, List<String>> materiasPorSemestre) {
        this.sigla = sigla;
        this.nomeCompleto = nomeCompleto;
        this.materiasPorSemestre = materiasPorSemestre;
    }

    public String getSigla() {
        return sigla;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public List<String> getMaterias(int semestre) {
        return materiasPorSemestre.getOrDefault(semestre, List.of());
    }
}
