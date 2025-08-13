⚠️ **Aviso:** Este documento ainda está em construção.

# 🛠️ BUILD.md — Guia de build do AcadIA

Este documento descreve como configurar, construir e executar o projeto AcadIA localmente.

---

## 🧰 Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## Teste

Caso queira usar a aplicação ela já foi levantada na seguinte url podendo testar o fluxo completo http://24.199.115.89

No momento ele está limitado a perguntas sobre estagio como:

"Quantas horas preciso para estagio"
"A partir de qual periodo posso estagio em engenharia da computaçaõ"

## 🚀 Subindo com Docker

Este é o método recomendado.
Você pode clonar e iniciar a aplicação da seguinte maneira

É necessario o node >= 22 para configurar o front os demais funcionam a partir do docker.

Também é preciso ter o docker configurado na maquina.

```bash
git clone <link do repositorio>
cd <nome do repositorio>

cd front-end/
npm i
npm run build
cd ..
docker-compose up --build -d
```

**OBS**: O Rag não é possivel de ser levantado com a aplicação
