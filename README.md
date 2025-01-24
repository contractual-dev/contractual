# Contractual

**Contractual** provides a unified way to manage APIs as **contracts** across the development stack, streamlining workflows and ensuring consistency. By centralizing API definitions with a **contract-first approach** using **TypeSpec**, Contractual empowers teams to define, version, and test their APIs with ease.

## 🌟 Why Contractual?

Managing APIs is hard. Definitions are scattered, types get duplicated across services, and breaking changes can sneak into production. Contractual solves these pains by:

- 📜 **Centralizing API Definitions**: Use TypeSpec as the single source of truth to eliminate inconsistencies.
- 🛠️ **Streamlined Workflow**: Automatically generate type-safe clients, server stubs, and OpenAPI specs.
- 🔍 **Version Control and Diffing**: Track API changes, detect breaking changes, and manage versions (major, minor, patch) with ease.
- ✅ **Type Safety Across the Stack**: Ensure alignment between client and server with type-safe contracts and validation.
- 🤝 **Frontend-Backend Collaboration**: Seamlessly integrate with tools like React Query, Vue, and Next.js to ensure smooth workflows for modern development.

## 🚀 Key Features

- **Contract-First API Management**: Define APIs with TypeSpec, a powerful DSL developed by Microsoft, as the single source of truth.
- **OpenAPI Integration**: Outputs OpenAPI (Swagger) specs that are versioned and tracked with clear diffs for every update.
- **Type-Safe Client Generation**: Generate clients with **ts-rest** and **Zod** for both compile-time and runtime validation.
- **Server Stubs**: Automatically generate server contracts for frameworks like **Express**, **Fastify**, and **NestJS**.
- **Versioning Made Simple**: Automatically bump versions and detect breaking changes with built-in tools.
- **End-to-End Type Safety**: Maintain consistency from definition to runtime, ensuring alignment between client, server, and API behavior.

## 🛠️ Getting Started

### Install Contractual

```bash
npm install -g contractual
```

### Initialize Your Project

```bash
contractual init
```

This scaffolds the following project structure:

```
contractual/
├── api.tsp        # TypeSpec API definition
├── snapshots/     # OpenAPI spec snapshots
├── client/        # Generated API clients
├── server/        # Server contracts
└── e2e/           # Type-safe API-driven tests
```

> Contractual works seamlessly with **monorepos**, **monoliths**, and distributed repositories.

### Define Your API

Start by defining your API in the `api.tsp` file. For example:

```tsp
@route("/users")
model User {
  id: string;
  name: string;
}
```

### Generate Contracts

Run the `generate` command to produce the client, server, and OpenAPI specs:

```bash
contractual generate
```

### Track API Changes

Use the `snapshot` command to save the current API state and track changes over time:

```bash
contractual snapshot
```

To compare versions and detect breaking changes:

```bash
contractual diff
```

## 📘 Roadmap

Want to contribute? Check out the alpha version [Roadmap](https://github.com/contractual-dev/contractual/issues/8) and join the journey! 🚀

## ❤️ Join the Community

Contractual is an open-source project, and we’re looking for contributors from day one. Whether you’re passionate about solving API challenges, improving developer workflows, or sharing ideas, we’d love to have you onboard.

📩 **Feedback or Questions?** Reach out via [GitHub Discussions](https://github.com/contractual-dev/contractual/discussions).

---

### Built With
- **TypeSpec**: A DSL for defining APIs (developed by Microsoft).
- **ts-rest**: For type-safe client and server contract generation.
- **Zod**: Runtime validation and compile-time type safety.

---

Let’s build the future of API lifecycle management, together. 🌍

## 🔒 License
Licensed under [Apache 2.0](LICENSE).
