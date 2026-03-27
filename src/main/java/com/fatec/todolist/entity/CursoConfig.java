package com.fatec.todolist.entity;

import java.util.List;
import java.util.Map;

public enum CursoConfig {

    ADS("ADS", "Análise e Desenvolvimento de Sistemas", Map.of(
        1, List.of(
            "Inglês I",
            "Algoritmos e Lógica de Programação",
            "Engenharia de Software I",
            "Comunicação e Expressão",
            "Arquitetura e Organização de Computadores",
            "Projeto Integrador I",
            "Sistemas Operacionais"
        ),
        2, List.of(
            "Interação Humano Computador",
            "Linguagem de Programação",
            "Gestão Financeira Empresarial com Tecnologia",
            "Cálculo",
            "Engenharia de Software II",
            "Banco de Dados Relacional",
            "Comunicação e Expressão II",
            "Inglês II"
        ),
        3, List.of(
            "Programação Orientada a Objetos",
            "Gestão de Negócios",
            "Estrutura de Dados",
            "Gestão de Projetos Ágeis",
            "Laboratório de Banco de Dados",
            "Experiência do Usuário",
            "Inglês III"
        ),
        4, List.of(
            "Inglês IV",
            "Programação Orientada a Objetos",
            "Engenharia de Software III",
            "Sistemas Operacionais II",
            "Banco de Dados",
            "Metodologia de Pesquisa Científica e Tecnológica",
            "Programação Web"
        ),
        5, List.of(
            "Redes de Computadores I",
            "Programação Linear",
            "Inglês V",
            "Laboratório de Engenharia de Software",
            "Segurança da Informação",
            "Programação Script",
            "Laboratório de Banco de Dados"
        ),
        6, List.of(
            "Inteligência Artificial",
            "Tópicos Especiais",
            "Gestão de Equipes",
            "Gestão de Projetos",
            "Gestão e Governança de TI",
            "Empreendedorismo",
            "Ética",
            "Inglês VI"
        )
    )),

    DSM("DSM", "Desenvolvimento de Software Multiplataforma", Map.of(
        1, List.of(
            "Desenvolvimento Web I",
            "Engenharia de Software I",
            "Algoritmos e Lógica de Programação",
            "Design Digital",
            "Sistemas Operacionais e Redes de Computadores",
            "Modelagem de Banco de Dados"
        ),
        2, List.of(
            "Engenharia de Software II",
            "Estrutura de Dados",
            "Desenvolvimento Web II",
            "Técnicas de Programação I",
            "Matemática para Computação",
            "Banco de Dados Relacional"
        ),
        3, List.of(
            "Banco de Dados Não Relacional",
            "Inglês I",
            "Gestão Ágil de Projetos de Software",
            "Interação Humano-Computador",
            "Álgebra Linear",
            "Técnicas de Programação II",
            "Desenvolvimento Web III"
        ),
        4, List.of(
            "Programação para Dispositivos Móveis I",
            "Experiência do Usuário",
            "Estatística Aplicada",
            "Integração e Entrega",
            "Internet das Coisas",
            "Laboratório de Desenvolvimento Web",
            "Inglês II"
        ),
        5, List.of(
            "Redação",
            "Computação em Nuvem I",
            "Programação para Dispositivos Móveis II",
            "Aprendizagem de Máquinas",
            "Laboratório de Dispositivos Móveis",
            "Segurança no Desenvolvimento de Aplicações",
            "Inglês III"
        ),
        6, List.of(
            "Qualidade e Testes de Software",
            "Mineração de Dados",
            "Processamento de Linguagem Natural",
            "Computação em Nuvem II",
            "Ética Profissional e Patente",
            "Laboratório de Desenvolvimento Multiplataforma",
            "Inglês IV"
        )
    )),

    GRH("GRH", "Gestão de Recursos Humanos", Map.of(
        1, List.of(
            "Inglês I",
            "Matemática Elementar",
            "Comportamento Organizacional",
            "Projeto Integrador I",
            "Administração Geral",
            "Gestão das Relações Interpessoais",
            "Leitura e Produção de Texto"
        ),
        2, List.of(
            "Comunicação Empresarial",
            "Gestão de Pessoas na Administração Pública",
            "Projeto Integrador II",
            "Espanhol I",
            "Métodos para Produção do Conhecimento",
            "Captação e Seleção de Talentos",
            "Estatística",
            "Inglês II"
        ),
        3, List.of(
            "Fundamentos de Economia",
            "Educação Corporativa",
            "Legislação Trabalhista e Previdenciária",
            "Informática Aplicada à Gestão de Pessoas",
            "Projeto Integrador III",
            "Espanhol II",
            "Gestão das Rotinas de Pessoal",
            "Inglês III"
        ),
        4, List.of(
            "Gestão da Inclusão Social",
            "Gestão do Clima Organizacional",
            "Gestão das Rotinas de Pessoal II",
            "Gestão de Carreiras e Benefícios",
            "Projeto Integrador IV",
            "Informática Aplicada à Gestão de Pessoas II",
            "Gestão Financeira",
            "Inglês IV"
        ),
        5, List.of(
            "Inglês V",
            "Empreendedorismo",
            "Endomarketing",
            "Gestão de Conflitos e Negociação",
            "Saúde e Segurança Ocupacional",
            "Remuneração Estratégica",
            "Projeto de Recursos Humanos I",
            "Gestão por Competências"
        ),
        6, List.of(
            "Projeto de Recursos Humanos II",
            "Gestão do Conhecimento",
            "Consultoria em Gestão de Pessoas",
            "Gestão de Talentos Humanos",
            "Tópicos Especiais em Gestão de Talentos",
            "Inglês VI",
            "Auditoria e Gestão da Qualidade de Vida no Trabalho",
            "Planejamento Estratégico em RH",
            "Ética e Responsabilidade Social Empresarial"
        )
    )),

    GPI("GPI", "Gestão da Produção Industrial", Map.of(
        1, List.of(
            "Informática",
            "Comunicação Empresarial",
            "Metodologia de Pesquisa",
            "Tecnologia de Produção",
            "Administração",
            "Inglês I",
            "Cálculo",
            "Projeto GPI I"
        ),
        2, List.of(
            "Desenho Técnico",
            "Fundamentos de Matemática Financeira",
            "Inglês II",
            "Matemática",
            "Estatística",
            "Projeto GPI II",
            "Economia",
            "Introdução à Contabilidade"
        ),
        3, List.of(
            "Projeto GPI III",
            "Economia",
            "Design de Produto",
            "Gestão da Produção Aplicada",
            "Custos Industriais",
            "Projeto de Produto I",
            "Inglês III",
            "Materiais e Ensaios",
            "Estrutura de Operações"
        ),
        4, List.of(
            "Projeto de Produto II",
            "Gestão da Qualidade",
            "PPCP",
            "Higiene e Segurança do Trabalho",
            "Processo de Produção",
            "Fundamentos de Automação Industrial",
            "Inglês IV"
        ),
        5, List.of(
            "Projeto de Fábrica",
            "Gestão da Cadeia de Suprimentos",
            "Gestão Ambiental",
            "Gestão Financeira",
            "Ética e Direito Empresarial",
            "Gestão de Projetos",
            "Projeto de Graduação I"
        ),
        6, List.of(
            "Comércio Exterior",
            "Tecnologia da Informação",
            "Gestão de Pessoas",
            "Marketing",
            "Espanhol II",
            "SAP",
            "Projeto de Graduação II"
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
