# @luminix/support

Biblioteca de fundação do stack Luminix. Fornece o service container, sistema de eventos, cliente HTTP, coleção tipada, property bag imutável e utilitários que os pacotes de nível superior (`@luminix/core`, `@luminix/react`, `@luminix/mui-cms`) são construídos sobre.

## Posição no stack

```
@luminix/mui-cms
    └── @luminix/react
            └── @luminix/core
                    └── @luminix/support   ← este pacote
```

## Instalação

```bash
npm install @luminix/support
```

## O que está incluído

| Módulo | Descrição |
|--------|-----------|
| `Application` | Service container com ciclo de vida bootstrap |
| `ServiceProvider` | Classe base para provedores de serviço |
| `EventSource` | Emitter de eventos tipado |
| `Collection` | Coleção fluente com +80 métodos |
| `PropertyBag` | Container de propriedades imutável com dot notation |
| `Client` / `Request` / `Response` | Cliente HTTP fluente baseado em Axios |
| `Macroable` | Mixin para registrar métodos customizados em runtime |
| `Reducible` | Mixin para pipeline de reducers com prioridade |
| `MakeFacade` | Mixin para o padrão facade sobre o container |
| `Str` / `Obj` / `Arr` / `Func` / `Query` / `DateTime` | Utilitários extensíveis |

## Documentação

[Documentação completa →](docs/index.md)
