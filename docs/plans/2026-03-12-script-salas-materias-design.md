# Design: Script de Criação de Salas e Matérias

**Data:** 2026-03-12  
**Status:** Aprovado

## Visão Geral

Criar um script Bash único (`criar_salas_com_materias.sh`) que popula automaticamente o banco de dados com todas as 48 salas de aula e suas respectivas matérias conforme as grades curriculares dos 4 cursos da instituição.

## Objetivos

1. Criar 48 salas de aula (4 cursos × 2 turnos × 6 semestres)
2. Criar ~240 matérias distribuídas entre as salas
3. Automatizar completamente o processo de setup inicial do banco de dados

## Cursos e Estrutura

### Cursos Disponíveis
- **ADS** - Análise e Desenvolvimento de Sistemas
- **DSM** - Desenvolvimento de Software Multiplataforma
- **GRH** - Gestão de Recursos Humanos
- **GPI** - Gestão da Produção Industrial

### Estrutura de Cada Sala
- Nome: `<CURSO> <SEMESTRE> <TURNO>` (ex: "ADS 1° Manhã")
- Semestre: Número do semestre (1° a 6°)
- Turno: "Manhã" ou "Noite"
- Segredo Líder: "lider123" (padrão)

## API Endpoints Utilizados

### POST /api/salas
**Request:**
```json
{
  "nome": "ADS 1° Manhã",
  "semestre": "1°",
  "segredoLider": "lider123"
}
```

**Response:**
```json
{
  "id": 1,
  "nome": "ADS 1° Manhã",
  "semestre": "1°",
  "codigoConvite": "A1B2C3D4",
  "segredoLider": "lider123"
}
```

### POST /api/materias
**Request:**
```json
{
  "nome": "Engenharia de Software I",
  "professor": "Professor",
  "salaId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "nome": "Engenharia de Software I",
  "professor": "Professor",
  "salaId": 1
}
```

## Estrutura de Dados

### Arrays de Matérias por Curso

Cada curso tem um array associativo onde a chave é o número do semestre e o valor é uma string de matérias separadas por `|`.

**Exemplo:**
```bash
declare -A MATERIAS_ADS=(
    [1]="Engenharia de Software I|Algoritmos e Lógica de Programação|..."
    [2]="Banco de Dados Relacional|Engenharia de Software II|..."
    # ... até 6
)
```

### Mapa de IDs de Salas

```bash
declare -A SALA_IDS=(
    ["ADS 1° Manhã"]=1
    ["ADS 1° Noite"]=2
    # ... todas as 48 salas
)
```

## Fluxo de Execução

### 1. Inicialização
- Definir constantes (BASE_URL, SEGREDO_PADRAO, PROFESSOR_PADRAO)
- Carregar arrays de matérias
- Inicializar arrays para armazenar IDs

### 2. Criar Salas
Loop aninhado:
```bash
for curso in ADS DSM GRH GPI; do
    for turno in Manhã Noite; do
        for semestre in 1° 2° 3° 4° 5° 6°; do
            nome="${curso} ${semestre} ${turno}"
            criar_sala "$nome" "$semestre" "$curso"
        done
    done
done
```

### 3. Criar Matérias
Para cada sala criada:
1. Extrair código do curso do nome da sala
2. Extrair número do semestre
3. Buscar array de matérias correspondente
4. Para cada matéria: POST /api/materias

### 4. Relatório Final
- Total de salas criadas
- Total de matérias criadas
- Erros ocorridos (se houver)

## Tratamento de Erros

- **Sem validação de existência:** Script não verifica se sala já existe antes de criar
- **Continua em caso de erro:** Se uma requisição falhar, loga o erro e continua
- **Log detalhado:** Exibe status de cada operação (✓ sucesso, ✗ erro)

## Dependências

### Sistema
- `bash` - Shell padrão Unix
- `curl` - Para requisições HTTP

### Ferramentas Externas
- `jq` - Parser JSON para extrair IDs das respostas

**Instalação do jq (se necessário):**
```bash
# macOS
brew install jq

# Linux (Ubuntu/Debian)
sudo apt-get install jq

# Linux (CentOS/RHEL)
sudo yum install jq
```

## Execução

```bash
# Dar permissão de execução
chmod +x criar_salas_com_materias.sh

# Executar script
./criar_salas_com_materias.sh
```

## Saída Esperada

```
Criando salas e matérias...
✓ Sala criada: ADS 1° Manhã (ID: 1)
✓ Sala criada: ADS 1° Noite (ID: 2)
...
✓ Matéria criada: Engenharia de Software I (Sala: 1)
✓ Matéria criada: Algoritmos e Lógica de Programação (Sala: 1)
...

=== RELATÓRIO FINAL ===
Salas criadas: 48
Matérias criadas: 240
Erros: 0
```

## Cenários de Uso

### Cenário 1: Setup Inicial de Desenvolvimento
Executar script uma vez para popular banco de dados H2 com todas as salas e matérias para testes.

### Cenário 2: Reset de Banco de Dados
Após alterações nas tabelas, reexecutar script para repopular com dados limpos.

### Cenário 3: Validação de Grade Curricular
Executar para verificar se todas as matérias de todos os cursos estão sendo cadastradas corretamente.

## Observações

- As matérias são criadas sem informações detalhadas de professores (valor padrão: "Professor")
- O código de convite é gerado automaticamente pelo backend
- O script não atualiza salas ou matérias existentes, apenas cria novas
- IDs das salas são dinamicamente capturados das respostas da API

## Próximos Passos

Após a implementação do script:
1. Testar execução completa
2. Verificar integridade dos dados no banco via H2 Console
3. Atualizar documentação do projeto com instruções de uso
