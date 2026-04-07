# Rename Completo para Seu Calendário Acadêmico

## Objetivo

Remover toda referência ativa à marca anterior do projeto e substituir a identidade pública por `Seu Calendário Acadêmico`, preservando o comportamento funcional atual.

## Identidade Final

- Nome público: `Seu Calendário Acadêmico`
- Slug técnico: `seu-calendario-academico`
- Pacote Java base: `com.seucalendarioacademico`

## Escopo

### Branding visível

- Atualizar títulos, cabeçalhos, rodapés, páginas públicas e áreas autenticadas do frontend.
- Garantir consistência entre nome do produto, navegação e cópias principais.

### Identidade técnica

- Renomear o pacote base do backend de `com.seucalendarioacademico` para `com.seucalendarioacademico`.
- Renomear a classe principal da aplicação e os testes associados.
- Atualizar `groupId`, `artifactId`, `name`, `description` e identificadores locais derivados.

### Configuração e operação

- Atualizar nome da aplicação Spring.
- Atualizar nomes locais de banco e containers usados em desenvolvimento.
- Atualizar scripts operacionais e documentação ativa com a nova identidade.

## Decisões

### Nome público vs. nome técnico

O produto deve aparecer para o usuário sempre como `Seu Calendário Acadêmico`. Para código, build e infraestrutura local, a derivação técnica adotada será `seu-calendario-academico`, sem espaços nem acentos, e o pacote Java será `com.seucalendarioacademico`.

### Escopo de remoção

O rename cobre referências ativas em código, configuração, scripts e documentação em uso. Artefatos gerados e logs históricos não fazem parte da identidade operacional do app e não precisam ser preservados como fonte de verdade.

## Validação

- Busca final por referências remanescentes da marca anterior e dos identificadores técnicos legados.
- `./mvnw test`
- `npm run build`

## Riscos

- Rename de pacote pode quebrar imports e caminhos de teste se houver arquivos esquecidos.
- Mudança de identificadores locais de banco e containers pode exigir recriação de ambiente de desenvolvimento.
- Documentação histórica pode continuar citando o nome antigo se não fizer parte do conjunto ativo revisado.
