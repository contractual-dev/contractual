# Contractual
**Contractual is an open-source, developer-first ecosystem for managing API contracts, versioning, and testing.** By unifying the entire API lifecycle under one tool,
it ensures type safety, consistency, and automation across all projects.

## 🚀 Core Features

Managing APIs is hard. Definitions are scattered, breaking changes sneak into production, and shared types get duplicated across services and projects. Contractual solves these challenges with a unified workflow for defining, versioning, and testing APIs:

- **Unified API Workflows**: Define your API once and generate specs, server contracts, and clients.
- **Client Libraries**: Share ready-to-use, type-safe API clients with your consumers.
- **Server Contracts**: Enforce endpoint implementation with contracts for popular frameworks.
- **E2E Testing**: Generate strictly-typed Playwright tests for end-to-end validation.
- **Version Control**: Automatically detect and manage API changes with snapshots.

## 📋 Getting Started

### Initialize a Project
Set up a new project with boilerplate TypeSpec and configurations:

```bash
npx @contractual/cli init
```

This scaffolds the following structure:
```
my-project/
├── contractual
├──── api.tsp     # The TypeSpec DSL for defining your API
├──── snapshots   # Stores OpenAPI specs for each version
├── client        # Your client / frontend
├── server        # Your server implementation 
└── e2e           # Your API e2e tests
```
> You can decide where to place generated artifacts. Contractual works with any project structure, including monorepos, monoliths, and distributed repos.

### Define Your API
Use TypeSpec to define your API. Example:

```typescript
@route("/users")
model User {
  id: string;
  name: string;
}
```

### Generate Contracts
Generate OpenAPI specs, server stubs, clients, and e2e artifacts with one command:

```bash
contractual generate --framework=express
```

This generates:
- **OpenAPI specs** (e.g., `openapi-v1.0.0.yaml`).
- **Server contracts** for Express, Fastify, or NestJS.
- **Client libraries** with Zod schemas and React Query integration.
- **E2E testing fixtures** for Playwright.

### Snapshot and Validate
Save the current OpenAPI spec for version tracking:

```bash
contractual snapshot
```

Validate API changes for backward compatibility:

```bash
contractual validate
```

## 🖥️ CLI Commands

| Command                | Description                                                                 | Example                              |
|------------------------|-----------------------------------------------------------------------------|--------------------------------------|
| `contractual init`     | Initialize a new project with TypeSpec and boilerplate setup.               | `contractual init`                   |
| `contractual generate` | Generate OpenAPI specs, clients, and server stubs from TypeSpec contracts.  | `contractual generate --framework=express` |
| `contractual snapshot` | Save the current OpenAPI spec version for tracking and validation.          | `contractual snapshot`               |
| `contractual validate` | Validate backward compatibility of API changes.                            | `contractual validate`               |

## 🎯 Use Cases

### Microservice Development
- Define reusable contracts for APIs and ensure consistency across services.
- Generate server stubs for **Express**, **Fastify**, or **NestJS**.

### Frontend-Backend Alignment
- Generate type-safe API clients with **Zod** validation.
- Simplify frontend integration with **React Query hooks**.

### Versioning and Evolution
- Automate version tracking with breaking change detection.
- Enforce backward compatibility with diff-based validation.

### End-to-End Testing
- Use Playwright-ready fixtures generated directly from contracts.
- Ensure e2e tests reflect the latest API state.

## 🌐 Built on Strong Foundations

### **TypeSpec**
> **"A language for defining cloud service APIs and shapes."**
> TypeSpec powers Contractual's API definition capabilities, serving as the single source of truth for your contracts. [Learn More](https://microsoft.github.io/typespec/)

### **ts-rest**
> **"A simple way to define a contract for your API, giving you end-to-end type safety without the hassle of code generation."**
> Contractual leverages ts-rest for generating type-safe client and server contracts, integrating seamlessly into React Query, Express, Fastify, and NestJS. [Learn More](https://ts-rest.com)

## 🛠 How It Works

### 1. TypeSpec: The DSL for API Definitions
At the core of Contractual is **TypeSpec**, a language designed for defining API shapes and services. With its extensibility and reusable patterns, TypeSpec serves as the single source of truth for your API.

> **TypeSpec Highlights**:
> - Describe APIs for REST, gRPC, and other protocols.
> - Generate OpenAPI specs, client/server code, and more.
> - Enforce best practices with built-in linting and guardrails.

### 2. ts-rest: Type-Safe Contract Generation
Contractual integrates **ts-rest** to bring type-safe contracts to your applications. ts-rest simplifies API interactions with:
- **End-to-End Type Safety**: Consistent types across server and client.
- **Zod Validation**: Runtime validation of API inputs and outputs.
- **React Query Integration**: Auto-generated hooks for frontend development.

## 📚 Documentation

Explore the full documentation, including guides, examples, and advanced workflows:

📖 [Read the Documentation](https://contractual.dev/)

## ❤️ Contribute
Help shape the future of Contractual! Check out [our roadmap](https://github.com/contractual/contractual) and contribute today.

## 🔒 License
Licensed under [Apache 2.0](LICENSE).
