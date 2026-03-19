# SistemaAgendamento
- Erro de regra de negocio (`400`/`409`): verifique status da consulta e vinculo medico-especialidade

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-brightgreen?style=for-the-badge&logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Uma API REST robusta desenvolvida com **Spring Boot** e **Java 21** para o gerenciamento completo de clínicas médicas. O sistema controla todo o fluxo de atendimento, desde o cadastro de pacientes e médicos até a conclusão de consultas e geração de prontuários, garantindo a integridade dos dados com rigorosas validações de negócio.

---

## 🚀 Principais Funcionalidades

- **Gestão de Pacientes:** Cadastro completo com validação de CPF e controle de histórico.
- **Gestão de Médicos:** Controle de profissionais por CRM (único) e associação a múltiplas especialidades.
- **Agendamento Inteligente:** Criação de consultas com validação automática de disponibilidade de agenda e compatibilidade de especialidade do médico.
- **Máquina de Estados de Consultas:** Transições seguras de status (`PENDENTE` ➔ `CONFIRMADO` ➔ `CONCLUIDO` ou `CANCELADO`).
- **Prontuários Eletrônicos:** Emissão restrita e segura de prontuários, permitida apenas após a conclusão efetiva do atendimento médico.

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagem:** Java 21
- **Framework:** Spring Boot (Web, Data JPA, Validation)
- **Banco de Dados:** PostgreSQL 16
- **Migrations:** Flyway
- **Infraestrutura:** Docker & Docker Compose
- **Build & Dependências:** Maven
- **Utilitários:** Lombok
- **Testes:** JUnit 5 / Mockito

---

## 📐 Regras de Negócio e Domínio

O sistema foi arquitetado para modelar com precisão os processos de uma clínica real:

1. **Competência Médica:** Um médico só pode receber agendamentos para as especialidades atreladas ao seu cadastro.
2. **Prevenção de Conflitos (Overbooking):** O sistema realiza bloqueios automáticos, impedindo que um mesmo médico tenha consultas sobrepostas no mesmo horário.
3. **Segurança de Atendimento:** O registro clínico (Prontuário) é blindado e só pode ser redigido quando a consulta associada atinge o status `CONCLUIDO`.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e Docker Compose instalados em sua máquina.
- *(Opcional)* Java 21 e PostgreSQL caso deseje rodar a aplicação nativamente fora dos containers.

### Opção 1: Via Docker (Recomendado)
A maneira mais rápida de testar o sistema. Suba a aplicação e o banco de dados simultaneamente:

```bash
docker-compose up -d
```
A API estará acessível em: `http://localhost:8080`

### Opção 2: Desenvolvimento Local (Híbrido)
Ideal para desenvolver e debugar na sua IDE favorita, usando o Docker apenas para o banco de dados:

1. Suba o container do PostgreSQL:
```bash
docker-compose up -d postgres
```
2. Execute a aplicação via Maven Wrapper:
```bash
./mvnw spring-boot:run
```

---

## 📡 Endpoints da API

Para facilitar o teste e integração, disponibilizamos na raiz do projeto o arquivo `insomnia_sistema_agendamento.json`. Você pode importá-lo diretamente no [Insomnia](https://insomnia.rest/) para ter todos os requests pré-configurados.

### 🧑‍⚕️ Médicos
- `GET /api/medico/listar` - Lista todos os médicos cadastrados.
- `POST /api/medico/adicionar` - Cadastra um novo médico.
- `POST /api/medico/{id}/especialidade` - Associa uma especialidade existente a um médico.

### 🤒 Pacientes
- `GET /api/paciente/listar` - Lista todos os pacientes.
- `POST /api/paciente/adicionar` - Adiciona um novo paciente.
- `GET /api/paciente/{id}` - Busca os dados detalhados de um paciente específico.

### 📅 Consultas
- `POST /api/consulta/adicionar` - Agenda uma nova consulta.
- `PATCH /api/consulta/{id}/confirmar` - Confirma a presença do paciente.
- `PATCH /api/consulta/{id}/concluir` - Finaliza o atendimento médico.
- `PATCH /api/consulta/{id}/cancelar` - Cancela o agendamento.

### 📋 Prontuários
- `POST /api/prontuario/adicionar` - Gera um prontuário (requer consulta `CONCLUIDO`).
- `GET /api/prontuario/{id}` - Visualiza um prontuário específico.

---

## 🧪 Testes Automatizados

O sistema conta com cobertura de testes para garantir a integridade das regras de negócio. Para executá-los:
```bash
./mvnw test
```

## 🚑 Troubleshooting

- **Connection Refused (Banco de Dados):** Certifique-se de que o container do Postgres está rodando com o comando `docker ps`.
- **Porta 8080 já em uso:** Caso você já tenha outro serviço rodando na 8080, altere a porta da aplicação no arquivo `application.properties` (`server.port=8081`) ou modifique o mapeamento no `docker-compose.yml`.
- **Erro 400 ao Agendar:** Verifique se o médico selecionado realmente possui a especialidade informada e se não há outra consulta marcada para ele no exato horário.
