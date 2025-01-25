<h1 align="center">Contractual</h1>

**Contractual is an open-source, developer-first ecosystem for managing API contracts, versioning, and testing. It is designed to streamline the development process across the entire stack by ensuring type safety and consistency in frontend, client libraries, server contracts, and end-to-end interactions. It is ideal for teams working with microservices, RESTful architectures, or API-driven development.**

## Why Contractual?

**Building and maintaining APIs involves complexities across the development stack and lifecycle.**

Definitions often become scattered across teams, creating inconsistencies and duplication.
Types frequently diverge between client and server, leading to runtime errors. Breaking changes sneak into production
unnoticed, disrupting downstream consumers. Versioning APIs and tracking changes further add to these challenges.

Contractual addresses these issues with a comprehensive, contract-first approach:

- 📜 **Contract-First API Management:** [Define APIs with TypeSpec](https://typespec.io/), a DSL developed by Microsoft, as the single source of truth.
- 🔄 **OpenAPI Integration:** Outputs OpenAPI (Swagger) specs that are versioned and tracked with clear diffs.
- 🛠️ **Type-Safe Client Generation:** Generate lightweight clients using [ts-rest](https://ts-rest.com/). Contracts are validated at runtime with Zod, ensuring type safety without manual validation.
- 🖥️ **Server Stubs:** Generate server contracts for frameworks like Express, Fastify, and NestJS.
- 🔍 **Versioning and Change Detection:** Automatically bump versions and detect breaking changes with built-in CLI.
- ✅ **End-to-End Type Safety:** Maintain consistency across the development lifecycle, ensuring every component aligns with the API contract.

## How It Works?

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

> You can experiment and validate your API definitions [using the **TypeSpec playground**.](https://typespec.io/playground/)

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
  <img src="video.gif" width="75%" />
</div>

### Generate Contracts

Run the `contract generate` command to generate type-safe clients, server contracts, and updated OpenAPI specs:

```bash
contractual contract generate
```

This command creates:
- **Type-safe client libraries** using **ts-rest**, integrated with **Zod** for runtime validation.
- **Server contracts** for frameworks like **Express**, **Fastify**, and **NestJS**.
- **Updated OpenAPI specs**.

Here’s a short video showing contract generation in action:

<div align="center">
  <img src="video.gif" />
</div>
```

## 📘 Roadmap

Want to contribute? Check out the alpha version [Roadmap](https://github.com/contractual-dev/contractual/issues/8) and join the journey! 🚀

## ❤️ Join the Community

Contractual is an open-source project, and we’re looking for contributors from day one. Whether you’re passionate about solving API challenges or improving workflows, we’d love to have you onboard.

📩 **Feedback or Questions?** Reach out via [GitHub Discussions](https://github.com/contractual-dev/contractual/discussions).

Let’s shape the future of API lifecycle management together.

## 🔒 License
Licensed under [MIT](LICENSE).