# Keep-Alive no Render com cron-job.org

## Objetivo

Evitar spin-down por inatividade no Render e reduzir o impacto de cold start usando um endpoint leve e um probe externo.

## Endpoints corretos

Use um destes endpoints:

- `https://fatec-listadeatividades.onrender.com/health`
- `https://fatec-listadeatividades.onrender.com/api/health`

Ambos retornam:

- status `200`
- `Content-Type: text/plain`
- body `OK`

Nao use `https://fatec-listadeatividades.onrender.com/api` como health check. Esse caminho nao e um endpoint de saude e pode responder `403`.

## Configurar no cron-job.org

1. Acesse `https://cron-job.org`.
2. Crie um novo cron job do tipo HTTP.
3. Configure:
   - URL: `https://fatec-listadeatividades.onrender.com/api/health?t=%cjo:unixtime%`
   - Request method: `GET`
   - Schedule: a cada `5 minutes`
4. Salve e habilite o job.

O parametro `t=%cjo:unixtime%` evita reaproveitamento de resposta por cache intermediario e garante que o request bata no origin.

## Configurar no Render

No dashboard do Render, ajuste o `Health Check Path` do web service para:

- `/health`

ou

- `/api/health`

Os dois sao validos. O recomendado para o monitor externo e `/api/health`; para o Render, `/health` e suficiente.

## Como testar

### Local

```bash
curl -i http://localhost:8080/health
curl -i http://localhost:8080/api/health
```

### Producao

```bash
curl -i https://fatec-listadeatividades.onrender.com/health
curl -i https://fatec-listadeatividades.onrender.com/api/health
curl -o /dev/null -s -w 'code=%{http_code} starttransfer=%{time_starttransfer} total=%{time_total}\n' 'https://fatec-listadeatividades.onrender.com/api/health?t='$(date +%s)
```

### Validacao do monitor

No `cron-job.org`, o job deve mostrar respostas `200` de forma continua.

## Observacao importante

Em plano gratuito, o Render ainda pode reiniciar instancias por politicas da plataforma. O keep-alive reduz spin-down por inatividade, mas nao elimina todo tipo de cold start forçado pelo provedor.
