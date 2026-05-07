package com.seucalendarioacademico.entity;

import java.util.List;
import java.util.Map;

public enum CursoConfig {

    ADS("ADS", "Análise e Desenvolvimento de Sistemas", Map.of(
        Turno.MANHA, Map.of(
            1, List.of(
                "Inglês I",
                "Algoritmos e Lógica de Programação",
                "Engenharia de Software I",
                "Arquitetura e Organização de Computadores",
                "Projeto Integrador I",
                "Comunicação e Expressão",
                "Sistemas Operacionais"
            ),
            2, List.of(
                "Interação Humano Computador",
                "Linguagem de Programação",
                "Gestão Financeira Empresarial com Tecnologia",
                "Cálculo",
                "Engenharia de Software II",
                "Comunicação e Expressão II",
                "Banco de Dados Relacional",
                "Inglês II"
            ),
            3, List.of(
                "Programação Orientada a Objetos",
                "Inglês III",
                "Gestão de Negócios",
                "Laboratório de Banco de Dados",
                "Estrutura de Dados",
                "Experiência do Usuário",
                "Gestão de Projetos Ágeis"
            ),
            4, List.of(
                "Inglês IV",
                "Eletiva I / Programação Web",
                "Programação Orientada a Objetos",
                "Banco de Dados",
                "Engenharia de Software III",
                "Sistemas Operacionais II",
                "Metodologia de Pesquisa Científica e Tecnológica"
            ),
            5, List.of(
                "Redes de Computadores I",
                "Programação Linear",
                "Inglês V",
                "Laboratório de Engenharia de Software",
                "Escolha I / Laboratório de Banco de Dados",
                "Eletiva II / Programação Script",
                "Segurança da Informação"
            ),
            6, List.of(
                "Escolha III / Inteligência Artificial",
                "Empreendedorismo",
                "Escolha II / Tópicos Especiais",
                "Gestão e Governança de TI",
                "Gestão de Equipes",
                "Gestão de Projetos",
                "Ética e Responsabilidade Profissional",
                "Inglês VI"
            )
        ),
        Turno.NOITE, Map.of(
            1, List.of(
                "Engenharia de Software",
                "Arquitetura e Organização de Computadores",
                "Algoritmos e Lógica de Programação",
                "Projeto Integrador I",
                "Comunicação e Expressão",
                "Sistemas Operacionais",
                "Inglês I"
            ),
            2, List.of(
                "Banco de Dados Relacional",
                "Inglês II",
                "Engenharia de Software",
                "Interação Humano Computador",
                "Linguagem de Programação",
                "Cálculo",
                "Comunicação e Expressão II",
                "Gestão Financeira Empresarial com Tecnologias"
            ),
            3, List.of(
                "Laboratório de Banco de Dados",
                "Gestão de Negócios",
                "Gestão de Projetos Ágeis",
                "Experiência do Usuário",
                "Inglês III",
                "Programação Orientada a Objetos",
                "Estrutura de Dados"
            ),
            4, List.of(
                "Engenharia de Software III",
                "Inglês IV",
                "Banco de Dados",
                "Programação Orientada a Objetos",
                "Sistemas Operacionais II",
                "Eletiva I / Programação Web",
                "Metodologia de Pesquisa Científica e Tecnológica"
            ),
            5, List.of(
                "Inglês V",
                "Eletiva II / Programação Script",
                "Programação Linear",
                "Segurança da Informação",
                "Laboratório de Engenharia de Software",
                "Escolha I / Laboratório de Banco de Dados",
                "Redes de Computadores I"
            ),
            6, List.of(
                "Escolha II / Inteligência Artificial",
                "Gestão e Governança de TI",
                "Gestão de Projetos",
                "Ética e Responsabilidade Profissional",
                "Inglês VI",
                "Gestão de Projetos (optativa)",
                "Empreendedorismo",
                "Gestão de Equipes",
                "Escolha II / Tópicos Especiais"
            )
        )
    )),

    DSM("DSM", "Desenvolvimento de Software Multiplataforma", Map.of(
        Turno.NOITE, Map.of(
            1, List.of(
                "Desenvolvimento Web I",
                "Engenharia de Software I",
                "Algoritmos e Lógica de Programação",
                "Design Digital",
                "Sistemas Operacionais e Redes",
                "Modelagem de Banco de Dados"
            ),
            2, List.of(
                "Engenharia de Software II",
                "Técnicas de Programação I",
                "Estrutura de Dados",
                "Matemática para Computação",
                "Desenvolvimento Web II",
                "Banco de Dados Relacional"
            ),
            3, List.of(
                "Banco de Dados Não Relacional",
                "Inglês I",
                "Desenvolvimento Web III",
                "Gestão Ágil de Projetos",
                "Interação Humano Computador",
                "Técnicas de Programação II",
                "Álgebra Linear"
            ),
            4, List.of(
                "Programação para Dispositivos Móveis I",
                "Experiência do Usuário",
                "Integração e Entrega",
                "Estatística Aplicada",
                "Inglês II",
                "IoT",
                "Laboratório de Desenvolvimento Web"
            ),
            5, List.of(
                "Redação",
                "Inglês III",
                "Computação em Nuvem I",
                "Aprendizagem de Máquinas",
                "Programação para Dispositivos Móveis II",
                "Segurança no Desenvolvimento de Aplicações",
                "Laboratório de Dispositivos Móveis"
            ),
            6, List.of(
                "Qualidade e Testes de Software",
                "Mineração de Dados",
                "Laboratório de Desenvolvimento Multiplataforma",
                "Processamento de Linguagem Natural",
                "Computação em Nuvem II",
                "Ética Profissional e Patente",
                "Inglês IV"
            )
        )
    )),

    GRH("GRH", "Gestão de Recursos Humanos", Map.of(
        Turno.MANHA, Map.of(
            1, List.of(
                "Inglês I",
                "Projeto Integrador I",
                "Matemática Elementar",
                "Administração Geral",
                "Leitura e Produção de Texto",
                "Comportamento Organizacional",
                "Gestão das Relações Interpessoais"
            ),
            2, List.of(
                "Comunicação Empresarial",
                "Estatística",
                "Gestão de Pessoas na Administração Pública",
                "Projeto Integrador II",
                "Espanhol I",
                "Métodos para Produção do Conhecimento",
                "Captação e Seleção de Talentos",
                "Inglês II"
            ),
            3, List.of(
                "Fundamentos de Economia",
                "Educação Corporativa",
                "Inglês III",
                "Informática Aplicada à Gestão de Pessoas",
                "Projeto Integrador III",
                "Legislação Trabalhista e Previdenciária",
                "Espanhol II",
                "Gestão das Rotinas de Pessoal"
            ),
            4, List.of(
                "Gestão da Inclusão Social",
                "Gestão do Clima Organizacional",
                "Inglês IV",
                "Gestão das Rotinas de Pessoal II",
                "Gestão de Carreiras e Benefícios",
                "Gestão Financeira",
                "Projeto Integrador IV",
                "Informática Aplicada à Gestão de Pessoas II"
            ),
            5, List.of(
                "Inglês V",
                "Saúde e Segurança Ocupacional",
                "Empreendedorismo",
                "Endomarketing",
                "Remuneração Estratégica",
                "Gestão de Conflitos e Negociação",
                "Projeto de Recursos Humanos I",
                "Gestão por Competências"
            ),
            6, List.of(
                "Projeto de Recursos Humanos II",
                "Inglês VI",
                "Gestão do Conhecimento",
                "Auditoria e Gestão da Qualidade de Vida no Trabalho",
                "Consultoria em Gestão de Pessoas",
                "Planejamento Estratégico em RH",
                "Tópicos Especiais em Gestão de Talentos Humanos",
                "Ética e Responsabilidade Social Empresarial"
            )
        ),
        Turno.NOITE, Map.of(
            1, List.of(
                "Projeto Integrador I",
                "Leitura e Produção de Textos",
                "Matemática Elementar",
                "Administração Geral",
                "Comportamento Organizacional",
                "Inglês I",
                "Gestão das Relações Interpessoais"
            ),
            2, List.of(
                "Comunicação Empresarial",
                "Métodos para Produção do Conhecimento",
                "Captação e Seleção de Talentos",
                "Gestão de Pessoas na Administração Pública",
                "Projeto Integrador II",
                "Espanhol I",
                "Estatística",
                "Inglês II"
            ),
            3, List.of(
                "Projeto Integrador III",
                "Educação Corporativa",
                "Espanhol II",
                "Gestão das Rotinas de Pessoal",
                "Inglês III",
                "Fundamentos de Economia",
                "Informática Aplicada à Gestão de Pessoas",
                "Legislação Trabalhista e Previdenciária"
            ),
            4, List.of(
                "Gestão da Inclusão Social",
                "Gestão Financeira",
                "Informática Aplicada à Gestão de Pessoas II",
                "Gestão do Clima Organizacional",
                "Gestão de Carreira e Benefícios",
                "Inglês IV",
                "Gestão das Rotinas de Pessoal II",
                "Projeto Integrador IV"
            ),
            5, List.of(
                "Projeto de Recursos Humanos I",
                "Saúde e Segurança Ocupacional",
                "Empreendedorismo",
                "Endomarketing",
                "Inglês V",
                "Gestão de Conflitos e Negociação",
                "Gestão por Competências",
                "Remuneração Estratégica"
            ),
            6, List.of(
                "Projeto de Recursos Humanos II",
                "Planejamento Estratégico em RH",
                "Gestão do Conhecimento",
                "Consultoria em Gestão de Pessoas",
                "Auditoria e Gestão da Qualidade de Vida no Trabalho",
                "Tópicos Especiais em Gestão de Talentos Humanos",
                "Inglês VI",
                "Ética e Responsabilidade Social Empresarial"
            )
        )
    )),

    GPI("GPI", "Gestão da Produção Industrial", Map.of(
        Turno.MANHA, Map.of(
            1, List.of(
                "Informática",
                "Comunicação Empresarial",
                "Metodologia de Pesquisa",
                "Tecnologia de Produção",
                "Administração",
                "Inglês I",
                "Cálculo",
                "Informática / Cálculo",
                "Projeto GPI I"
            ),
            2, List.of(
                "Design/Desenho Técnico",
                "Introdução à Contabilidade",
                "Fundamentos de Matemática Financeira",
                "Inglês II",
                "Materiais e Tratamentos",
                "Projeto Integrado GPI / Projeto GPI II",
                "Estatística",
                "Ergonomia",
                "Ergonomia / Economia"
            ),
            3, List.of(
                "Projeto Integrador GPI III",
                "Economia",
                "Design de Produto",
                "Gestão da Produção Aplicada",
                "Custos Industriais",
                "Projeto de Produto I",
                "Inglês III",
                "Estrutura de Operações",
                "Materiais e Ensaios"
            ),
            4, List.of(
                "Projeto de Produto II",
                "PPCP",
                "Gestão da Qualidade",
                "Higiene e Segurança",
                "Inglês IV",
                "Projeto Integrador GPI III/IV",
                "Processo de Produção",
                "Fundamentos de Automação Industrial"
            ),
            5, List.of(
                "Projeto de Fábrica",
                "Projeto de Graduação I",
                "Gestão da Cadeia de Suprimentos",
                "Gestão Ambiental",
                "Fundamentos de Gestão de Projetos",
                "Gestão Financeira",
                "Ética e Direito Empresarial",
                "Espanhol I"
            ),
            6, List.of(
                "Comércio Exterior",
                "Tecnologia da Informação",
                "Gestão de Pessoas",
                "Espanhol II",
                "Marketing",
                "SAP",
                "Projeto de Graduação II"
            )
        ),
        Turno.NOITE, Map.of(
            1, List.of(
                "Informática",
                "Metodologia de Pesquisa",
                "Tecnologia de Produção",
                "Fundamentos Comuns Empresariais",
                "Cálculo",
                "Administração",
                "Inglês I"
            ),
            2, List.of(
                "Matemática / Materiais e Tratamento I",
                "Projeto Integrador GPI Local",
                "Estatística",
                "Matemática / Tratamento I",
                "Líder e Empresa / Fundamentos Empresariais",
                "Fundamentos de Matemática Financeira",
                "Introdução à Contabilidade",
                "Ergonomia",
                "Design, Moda e Produto I",
                "Inglês II"
            ),
            3, List.of(
                "Estratégia de Produção e Operações",
                "Projeto Integrador GPI II",
                "Gestão da Produção Aplicada",
                "Economia",
                "Materiais e Tratamentos I",
                "Custos Industriais",
                "Projeto de Produto I",
                "Inglês III",
                "Design, Moda e Produto II"
            ),
            4, List.of(
                "Processo de Produção",
                "Fundamentos de Automação Industrial",
                "Higiene e Segurança do Trabalho",
                "PPCP",
                "Projeto de Produto II",
                "Gestão da Qualidade",
                "Inglês IV",
                "Projeto Integrador GPI III/IV"
            ),
            5, List.of(
                "Espanhol I",
                "Projeto de Graduação I",
                "Gestão Ambiental",
                "Projeto de Fábrica",
                "Fundamentos de Gestão de Projetos",
                "Ética e Direito Empresarial",
                "Gestão Financeira",
                "Gestão da Cadeia de Suprimentos"
            ),
            6, List.of(
                "Projeto de Graduação II",
                "Espanhol II",
                "Tecnologia da Informação",
                "Comércio Exterior",
                "SAP",
                "Marketing e Vendas",
                "Gestão de Pessoas"
            )
        )
    ));

    private final String sigla;
    private final String nomeCompleto;
    private final Map<Turno, Map<Integer, List<String>>> materiasPorTurnoESemestre;

    CursoConfig(String sigla, String nomeCompleto, Map<Turno, Map<Integer, List<String>>> materiasPorTurnoESemestre) {
        this.sigla = sigla;
        this.nomeCompleto = nomeCompleto;
        this.materiasPorTurnoESemestre = materiasPorTurnoESemestre;
    }

    public String getSigla() {
        return sigla;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public boolean possuiTurno(Turno turno) {
        return materiasPorTurnoESemestre.containsKey(turno);
    }

    public List<String> getMaterias(Turno turno, int semestre) {
        return materiasPorTurnoESemestre
            .getOrDefault(turno, Map.of())
            .getOrDefault(semestre, List.of());
    }

    public List<String> getMaterias(int semestre) {
        Turno turnoPadrao = possuiTurno(Turno.MANHA) ? Turno.MANHA : Turno.NOITE;
        return getMaterias(turnoPadrao, semestre);
    }
}
