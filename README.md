<h1 align="center">Contractual</h1>

**Contractual is a tool for managing API and data schemas as structured contracts. It ensures that schemas
are defined, versioned, and enforced across teams, whether for REST APIs, event-driven systems, or structured data
exchanges.** Built on **TypeSpec**, it provides a contract-first approach that helps teams track changes, prevent schema
drifts, and generate type-safe clients and server contracts.

By treating schemas as first-class entities, Contractual eliminates uncertainty at integration points, enabling backend,
frontend, and data engineering teams to maintain predictable and enforceable APIs and structured data across the entire
stack.

Common use cases include: \
🔹 Keeping API Contracts in Sync Between Backend and Frontend \
🔹 Generating Type-Safe Clients and Server Contracts \
🔹 Preventing Breaking Changes and Detecting Schema Drift \
🔹 Ensuring Consistency Between Backend and Data Teams \
🔹 Generating Language-Specific Types from a Shared Contract

> Initially built for the **Node.js and TypeScript ecosystem**, Contractual is planned to support additional
> languages.

## 🔍 Why Contractual?

Maintaining the consistency of schemas across various services presents significant challenges. As systems evolve,
type-definitions and schemas drift, unnoticed breaking changes occur, and different teams find it challenging to
synchronize. APIs, event schemas, and structured data formats often become disconnected from their original intent,
leading to brittle integrations, manual fixes, and unexpected failures.

**Some of the biggest pain points teams face include:**

- **Schema Drift & Misalignment:** APIs and data contracts become inconsistent across teams, leading to mismatches, 
broken integrations, and regressions.

- **Code Sharing**: Teams struggle to share and reuse schemas across services, leading to duplicated efforts and
  inconsistent data structures.

- **Untracked & Breaking Changes:** Without tracking modifications, updates can unexpectedly break consumers, causing
downtime and costly debugging.

- **Scattered Schemas & Code Maintenance:** Outdated documentation and manually managed type definitions create 
unreliable integrations and make maintaining entity models error-prone.

#### How Spec-First Works

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

- **API-Driven Applications**:
  - Create consistent and versioned REST APIs with type-safe clients and server contracts.
  - Ensure changes to your APIs don’t break downstream systems or clients.

- **Data Validation Workflows**:
  - Leverage **JSON Schemas** for validating complex data structures across services and teams.
  - Seamlessly integrate validation into pipelines for ETL processes or data ingestion workflows.

- **Microservices and Distributed Systems**:
  - Maintain uniform contracts across services, reducing integration bugs.
  - Use diffing tools to communicate API changes across teams.

- **Frontend-Backend Synchronization**:
  - Use generated type-safe clients to keep your frontend perfectly aligned with backend APIs.
  - Integrate tools like React Query or Vue for a seamless developer experience.

## 🔑 The Contract-First Approach

Most teams take a code-first approach to API development, where schemas are generated after implementation. This leads
to misalignment between services, outdated documentation, and accidental breaking changes. Backend teams define APIs,
frontend teams consume them, and data engineers rely on structured data formats—all of which can drift over time when
schemas are an afterthought.

A contract-first approach flips this process: schemas are designed before any implementation begins, ensuring that API
structures, event definitions, and data formats remain stable and predictable. This approach allows teams to:

- Define schemas upfront and enforce them as the single source of truth.

- Track changes and prevent breaking updates before they impact consumers.

- Generate type-safe clients and server contracts in multiple languages, reducing friction between teams.

- Distribute schemas efficiently across backend services, frontend applications, and data pipelines.

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
