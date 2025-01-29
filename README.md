<h1 align="center">Contractual</h1>

**Contractual is an open-source project intended to unify the entire lifecycle of API definitions, schemas, and data
contracts across diverse systems to ensure clarity, consistency, and control. Contractual adopts a **spec-first
approach**, with **TypeSpec** as the single source of truth to make sure that definitions and schemas stay consistent,
versioned, and are type-safe across the entire stack.

Contractual starts with **OpenAPI** and **JSON Schemas** as its core, intended to improve processes for backend teams,
frontend developers, and data engineers.

## 🚨 Why Contractual?

Handling APIs, schemas, and data contracts in modern systems can be complex and frequently fragmented, resulting in
inefficiencies and misaligned workflows across teams. In addition to traditional REST APIs, teams encounter difficulties
in managing structured data for uses such as validation, communication, and integrations across services.

- **Scattered Definitions:** Duplicating schemas and contracts across backend, frontend, and data workflows often
  results in potential regressions.

- **Breaking Changes:** Without proper tracking, changes to contracts or schemas can unintentionally break downstream
  systems or clients, causing regressions.

- **Fragmented Tooling:** Teams depend on a variety of disconnected tools for client generation, schema validation, and
  version management, leading to interruptions in developer workflows.

- **Collaboration Gaps:** Misaligned definitions between teams—whether backend, frontend, or data engineers—lead to
  mismatches, bugs, and wasted time.

Contractual solves these problems by putting the specs first and using TypeSpec as the only source of truth. This
makes teams better at managing APIs and structured data processes.

## 🌟 Spec-First Approach and Use Cases

A **spec-first approach** puts the definition of APIs and schemas at the center of the workflow, treating the
specification as the **single source of truth**. This ensures alignment across frontend, backend, and data teams while
streamlining development workflows.

### How Spec-First Works

1. **Define Once**:
   - Use **TypeSpec**, a declarative DSL, to define your API or schema in a centralized file.
   - This becomes the authoritative source for your API’s structure, endpoints, and data contracts.

2. **Generate Everything**:
   - From the spec, Contractual generates:
     - **OpenAPI specifications** for REST documentation and tooling.
     - **Type-safe clients** with **ts-rest** and **Zod** for runtime validation.
     - **Server contracts** for Express, Fastify, and NestJS.
     - **JSON Schemas** for validation or data workflows.

3. **Version and Diff**:
   - Track changes to your APIs or schemas.
   - Use versioning and diffing tools to detect and prevent breaking changes.

4. **Enforce Consistency**:
   - Use the spec to drive all API-related workflows, ensuring backend, frontend, and data teams are in sync.

## 🚀 In Practice

### Install Contractual

To get started, install the Contractual CLI globally:

```bash
npm i -g @contractual/cli
```

### Initialize Your Project

Run the `init` command to scaffold a new project:

```bash
contractual init
```

This command creates the following project structure:

```
frontend/          # Your frontend application
server/            # Your server application
contractual/       # Contractual files
├── api.tsp        # TypeSpec API definition
├── specs/         # OpenAPI auto-generated specs
```

> Contractual works seamlessly with **monorepos**, **monoliths**, and distributed repositories.

### Define Your API

Write your API definition in the `api.tsp` file. For example:

```tsp
import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";

using TypeSpec.Http;

@service({
  title: "Petstore API",
})
namespace PetstoreAPI;

model Pet {
  id: string;
  name: string;
}

@route("/pet")
@post
op addPet(@body body: Pet): Pet;
```

> You can experiment and validate your API definitions [using the TypeSpec playground](https://typespec.io/playground/)

### Manage API Changes

#### Save the Current State of Your API

Run the `spec graduate` command to save the current state of your OpenAPI spec:

```bash
contractual spec graduate
```

This will generate a new OpenAPI (3.1.0) YAML file with versioning, enabling to track API changes over time. The
updated structure will look like this:

```
contractual/
├── api.tsp                  # TypeSpec API definition
├── specs/                   # OpenAPI auto-generated specs
│   ├── openapi-v1.0.0.yaml
client/                      # Generated API clients
server/                      # Server contracts
e2e/                         # Type-safe API-driven tests
```

> You can track API evolution and changes easily with clear, versioned OpenAPI specs.

Here’s a quick video showing how this works:

<div align="center">
  <img src="spec-graduate.gif" />
</div>

### Generate Contracts

Run the `contract generate` command to generate type-safe clients, server contracts, and updated OpenAPI specs:

```bash
contractual contract generate
```

This command creates:

- **Type-safe client libraries** [using **ts-rest**](https://ts-rest.com), integrated with **Zod** for runtime
  validation.
- **Server contracts** for frameworks like **Express**, **Fastify**, and **NestJS**.
- **Updated OpenAPI specs**.

Here’s a short video showing contract generation in action:

<div align="center">
  <img src="contract-generate.gif" />
</div>
```

### Use Cases

1. **API-Driven Applications**:
   - Create consistent and versioned REST APIs with type-safe clients and server contracts.
   - Ensure changes to your APIs don’t break downstream systems or clients.

2. **Data Validation Workflows**:
   - Leverage **JSON Schemas** for validating complex data structures across services and teams.
   - Seamlessly integrate validation into pipelines for ETL processes or data ingestion workflows.

3. **Microservices and Distributed Systems**:
   - Maintain uniform contracts across services, reducing integration bugs.
   - Use diffing tools to communicate API changes across teams.

4. **Frontend-Backend Synchronization**:
   - Use generated type-safe clients to keep your frontend perfectly aligned with backend APIs.
   - Integrate tools like React Query or Vue for a seamless developer experience.

## 📃 Goals

* Provide a centralized tool for managing OpenAPI and JSON Schema lifecycles.

* Simplify API workflows with type-safe client/server generation.

* Offer robust versioning and diffing tools to prevent breaking changes.

* Lay the foundation for multi-language support, starting with Python.

* Enable language-agnostic workflows, allowing developers to generate code and contracts across multiple languages (
  e.g., TypeScript to Python).

* Introduce "contractual pack" to prepare contracts and generated clients/servers into distributable packages for
  publication.

## 🚫 Non-Goals

* Contractual does not currently support gRPC, ProtoBufs, or GraphQL. While these protocols may be considered in the
  future, the initial focus is on REST APIs and JSON Schemas.

## 📘 Roadmap

Want to contribute? Check out the alpha version [Roadmap](https://github.com/contractual-dev/contractual/issues/8) and
join the journey! 🚀

## ❤️ Join the Community

Contractual is open-source, and we’re looking for contributors to help shape its future, if you’re interested in
collaborating, please reach out.

📩 **Feedback or Questions?** Reach out
via [GitHub Discussions](https://github.com/contractual-dev/contractual/discussions).

## 🔒 License

Licensed under [MIT](LICENSE).
