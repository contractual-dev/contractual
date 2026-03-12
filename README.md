# Contractual

The `contractual` CLI and GitHub Action manage schema contract lifecycle for OpenAPI, JSON Schema, and AsyncAPI.

It provides:
- Linting of specs
- Structural breaking change detection against snapshots
- Changeset generation and versioning
- Changelog generation
- GitHub Action integration for PR checks and release automation

## Installation

### npm

```sh
npm install -g contractual
```

### Other package managers

```sh
pnpm add -g contractual
yarn global add contractual
bun add -g contractual
```

## Usage

The CLI provides command summaries and flags:

```sh
contractual --help
```

For usage details, see the documentation, especially:

- [`contractual breaking`][breaking-docs]
- [`contractual lint`][lint-docs]
- [`contractual changeset`][changeset-docs]
- [`contractual version`][version-docs]
- [GitHub Action setup][action-docs]

## CLI breaking change policy

Breaking changes are documented in release notes for the npm package.

## Goals for schema contracts

Schema contracts are a compatibility boundary between producers and consumers. Contractual standardizes linting, breaking change detection, versioning, and changelog generation across OpenAPI, JSON Schema, and AsyncAPI.

Contractual wraps existing tooling where possible and adds missing lifecycle steps, including built-in JSON Schema diffing where production-grade tooling is limited.

## The Contractual workflow

Contractual uses a repository state directory at `.contractual/` to store versions, snapshots, and pending changesets. The GitHub Action can post diff tables on pull requests and open a Version Contracts PR for release automation.

The GitHub Action is optional. The CLI can run locally or in CI.

## More advanced CLI features

- Custom linters and differs via `contractual.yaml`
- Custom outputs for code generation
- JSON output formats for CI systems
- Base snapshot selection with `--base`
- Monorepo support with multiple configs
- Optional AI explanations with `ANTHROPIC_API_KEY`

## Next steps

After installation, follow the CLI quickstart:

- [Quickstart][quickstart-docs]
- [Configuration reference][config-docs]
- [Breaking change detection][breaking-overview]

## Builds

The CLI is distributed via npm and requires Node.js 18 or later.

| Platform | Support |
|----------|---------|
| macOS | Node.js 18+ |
| Linux | Node.js 18+ |
| Windows | Node.js 18+ |

## Community

Issues and feature requests:
- [GitHub issues][issues]

Documentation:
- [contractual.dev][docs]

License:
- [MIT](LICENSE)

[docs]: https://contractual.dev
[issues]: https://github.com/contractual-dev/contractual/issues
[quickstart-docs]: https://contractual.dev/getting-started/quickstart
[config-docs]: https://contractual.dev/reference/configuration
[breaking-docs]: https://contractual.dev/breaking/usage
[breaking-overview]: https://contractual.dev/breaking/overview
[lint-docs]: https://contractual.dev/linting/usage
[changeset-docs]: https://contractual.dev/versioning/usage
[version-docs]: https://contractual.dev/versioning/usage
[action-docs]: https://contractual.dev/github-action/setup
