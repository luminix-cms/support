# Developing `@luminix/support`

`src/` is the whole product; everything else here is tests, documentation or packaging.

## Two audiences, two trees

| Tree | Written for | Language | Ships |
|---|---|---|---|
| `agents/AGENTS.md` + `agents/references/` | an agent **consuming** the package in an app | English | yes, as `dist/AGENTS.md` + `dist/references/` |
| `AGENTS.md` (this file), `CLAUDE.md` | an agent **developing** the package | English | no |
| `README.md` | a human landing on npm | Portuguese | yes |
| `docs/` | a human reading at tutorial length | Portuguese | no |

`.npmignore` decides what ships, and `postbuild` copies `agents/.` into `dist/`. `npm pack
--dry-run` must list `dist/AGENTS.md` and `dist/references/*.md`, and never this file,
`CLAUDE.md`, `agents/`, `src/` or `tests/`.

Every `.npmignore` entry is **anchored with a leading slash**, and a new one must be too. An
unanchored `AGENTS.md` or `docs/` matches at any depth, `dist/` included, so it would quietly
delete the copy `postbuild` just made and ship a guide-less tarball. The rule costs nothing here
because every entry names a top-level path.

A consuming app reads the guide at `node_modules/@luminix/support/dist/AGENTS.md`, so a fix here
reaches it only through a published version.

## Writing `agents/`

- update it when a change is observable from a consuming app: a method, an argument, a return
  type, an emitted event, a thrown exception, a macro or reducer name, an exported type. Internal
  refactors leave it alone
- an API described there that `src/` does not have is a bug in `agents/`
- it describes the behaviour of this commit. What an older release did belongs to the release
  notes
- every sentence serves the reader's current task and says something the agent could not get from
  a glance at the repository
- describe the package, not the documentation system: no prose about where the guide ships from,
  how skills are found, or what else exists in the ecosystem. Name the neighbouring package when
  the answer lives outside this one

## Working here

```bash
npm test              # jest
npm run lint          # eslint over the repo, zero warnings tolerated
npm run build         # tsc typecheck, then vite lib build -> dist/support.js, dist/support.cjs, types/
```

- there is no `ci` script, and `.github/workflows/latest.yml` only tests and builds before
  publishing — nothing lints on your behalf, so run `npm run lint` before merging
- jest, not vitest, despite the vite build: `jsdom` environment, `ts-jest` for `.ts`, `babel-jest`
  for `.js`. `nanoevents` and `lodash-es` are ESM-only, which is why `transformIgnorePatterns`
  un-ignores them — a new ESM dependency needs the same entry or its import blows up in tests
- `tests/__mocks__/axios.ts` replaces the axios default export with a `jest.fn()`, picked up
  automatically: no test calls `jest.mock('axios')`. Every HTTP test drives it with
  `mockImplementationOnce`, so nothing in the suite exercises real axios behaviour
- the `jsdom` environment is not optional: `Application.create()` dereferences `document` through
  `loadConfiguration()`, `reader` queries the DOM, and `Client.withBasicAuth` calls `btoa`
- `tsconfig.json` sets `noEmit` and excludes `tests/`: `tsc` in the build is a typecheck of `src/`
  alone, and `vite-plugin-dts` is what actually writes `types/`. Test types are never checked
- `vite.config.js` externalizes nothing, so the lib build inlines every import. That is what makes
  `lodash-es` work as a devDependency — adding `rollupOptions.external` would publish a bundle
  with an unresolvable import. `axios` and `immer` are re-exported from `src/index.ts` on purpose
- `Collection` sorts with `toSorted`/`toReversed` (ES2023) and nothing transpiles the bundle, so
  the runtime floor is Node 20 or a 2023 browser. New code should not raise it further
- `package.json` carries an empty `version` on purpose — CI stamps it at publish time

## Git

- `v1.x` is the release branch; work on `feat/`/`fix/` branches and merge into it
- every push to `v1.x` runs `.github/workflows/latest.yml`: test, build, `npm publish` under the
  version computed from the commit subjects, then a GitHub Release. `v1.x-nightly` does the same
  through `nightly.yml`, under the `nightly` dist-tag and a `-nightlyN` prerelease version
- semver comes from the commit subject: `(MAJOR)` -> major, `(MINOR)` -> minor, absence -> patch
- commit messages and branch names in português
