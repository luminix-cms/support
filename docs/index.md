# Documentação — @luminix/support

## Sumário

- [Application](#application)
  - [Bootstrap](#bootstrap)
  - [Registro de serviços](#registro-de-serviços)
  - [Container tipado](#container-tipado)
  - [Configuração](#configuração)
  - [Eventos de ciclo de vida](#eventos-de-ciclo-de-vida)
  - [Flush](#flush)
- [ServiceProvider](#serviceprovider)
- [EventSource](#eventsource)
- [Collection](#collection)
  - [Iteração](#iteração)
  - [Consulta](#consulta)
  - [Filtragem](#filtragem)
  - [Transformação](#transformação)
  - [Agregados](#agregados)
  - [Mutação](#mutação)
  - [Pipeline e condicionais](#pipeline-e-condicionais)
  - [Saída](#saída)
  - [Eventos de mudança](#eventos-de-mudança)
- [PropertyBag](#propertybag)
  - [Leitura](#leitura)
  - [Escrita](#escrita)
  - [Bloqueio de caminhos](#bloqueio-de-caminhos)
  - [Clone](#clone)
  - [Eventos de mudança](#eventos-de-mudança-1)
- [HTTP Client](#http-client)
  - [Client](#client)
  - [Request](#request)
  - [Response](#response)
- [Mixins](#mixins)
  - [Macroable](#macroable)
  - [Reducible](#reducible)
  - [MakeFacade](#makefacade)
- [Utilitários](#utilitários)
  - [Str](#str)
  - [Obj](#obj)
  - [Arr](#arr)
  - [Func](#func)
  - [Query](#query)
  - [DateTime](#datetime)
- [reader()](#reader)
- [isValidationError()](#isvalidationerror)
- [Re-exports](#re-exports)
- [Referência de tipos](#referência-de-tipos)

---

## Application

Service container com ciclo de vida de bootstrap em duas fases (`register` → `boot`) e bus de eventos integrado.

### Bootstrap

```typescript
import { Application, ServiceProvider } from '@luminix/support';

class AuthProvider extends ServiceProvider {
    register() {
        this.app.singleton('auth', () => new AuthService());
    }
    boot() {
        this.app.make('auth').initialize();
    }
}

const app = new Application([AuthProvider]);

app.withConfiguration({ debug: true });
app.create();
```

`create()` executa o ciclo completo:

| Etapa | Evento emitido | O que acontece |
|-------|----------------|----------------|
| 1 | `init` | Provedores instanciados; evento recebe a lista de provedores |
| 2 | — | `register()` chamado em cada provedor |
| 3 | `booting` | — |
| 4 | — | `boot()` chamado em cada provedor |
| 5 | `booted` | — |
| 6 | `ready` | Aplicação completamente inicializada |

### Registro de serviços

```typescript
// Nova instância a cada make()
app.bind('http', () => new Client());

// Instância compartilhada (singleton)
app.singleton('http', () => new Client());

// Instância pré-construída
app.instance('http', clientExistente);

// Resolução
const http = app.make('http');
```

### Container tipado

Passe um mapa de tipos para obter chamadas `make()` completamente tipadas:

```typescript
type Services = {
    http: Client;
    auth: AuthService;
};

const app = new Application<Services>();
app.singleton('http', () => new Client());

const http = app.make('http'); // tipo: Client
```

### Configuração

```typescript
app.withConfiguration({ api: { url: 'https://api.example.com' } });

// Carregada automaticamente de <script id="luminix-data::config"> se presente
app.loadConfiguration();

const url = app.configuration.api.url;
```

### Eventos de ciclo de vida

```typescript
app.on('ready',   () => console.log('App pronta'));
app.on('booting', () => console.log('Inicializando...'));
app.on('flushing', () => console.log('Limpando...'));
```

### Flush

Destrói todos os serviços, configuração e listeners registrados. Dispara `flushing` → `flush()` dos provedores → `flushed`, depois limpa o bus de eventos.

```typescript
app.flush();
```

---

## ServiceProvider

Classe base para agrupar registros e lógica de boot relacionados.

```typescript
import { ServiceProvider } from '@luminix/support';

export default class MeuProvider extends ServiceProvider {
    register() {
        // Registra serviços no container
        this.app.singleton('meuServico', () => new MeuServico());
    }

    boot() {
        // Serviços de outros providers já estão disponíveis aqui
        this.app.make('meuServico').setup();
    }

    flush() {
        // Limpeza opcional quando app.flush() é chamado
    }
}
```

---

## EventSource

Emitter de eventos tipado baseado em [nanoevents](https://github.com/ai/nanoevents). Toda subclasse de `EventSource` declara seu mapa de eventos como parâmetro genérico.

```typescript
import { EventSource } from '@luminix/support';

type MeusEventos = {
    change: (e: { source: MinhaClasse; value: string }) => void;
    reset:  (e: { source: MinhaClasse }) => void;
};

class MinhaClasse extends EventSource<MeusEventos> {
    update(value: string) {
        this.emit('change', { source: this, value });
    }
}

const obj = new MinhaClasse();

// Assinar — retorna função de cancelamento
const off = obj.on('change', (e) => console.log(e.value));

// Assinar uma única vez
obj.once('reset', (e) => console.log('resetado'));

// Cancelar assinatura
off();

// Limpar todos os listeners
obj.flushEvents();
```

O helper de tipo `Event<TData, TSource>` mescla o payload com um campo `source` apontando para o emissor:

```typescript
import type { Event } from '@luminix/support';

type ChangeEvent = Event<{ value: string }, MinhaClasse>;
// { value: string; source: MinhaClasse }
```

---

## Collection

Coleção fluente e fortemente tipada inspirada na `Collection` do Laravel. Estende `EventSource` e emite um evento `change` a cada mutação.

```typescript
import { Collection } from '@luminix/support';

const usuarios = new Collection([
    { id: 1, nome: 'Alice', idade: 30, perfil: 'admin' },
    { id: 2, nome: 'Bob',   idade: 25, perfil: 'user'  },
    { id: 3, nome: 'Carol', idade: 30, perfil: 'user'  },
]);
```

### Iteração

```typescript
// Iterável nativo
for (const usuario of usuarios) { ... }

usuarios.each((usuario, index) => {
    if (usuario.perfil === 'admin') return false; // interrompe a iteração
});

usuarios.eachSpread((...args) => { ... }); // itens devem ser arrays ou coleções
```

### Consulta

```typescript
usuarios.where('perfil', 'admin');               // igualdade fraca
usuarios.where('idade', '>=', 25);               // operadores: = != > >= < <=
usuarios.whereStrict('perfil', 'admin');          // igualdade estrita
usuarios.whereIn('perfil', ['admin', 'moderador']);
usuarios.whereNotIn('perfil', ['banido']);
usuarios.whereNull('deletedAt');
usuarios.whereNotNull('email');
usuarios.whereBetween('idade', [20, 35]);
usuarios.whereNotBetween('idade', [20, 35]);
usuarios.whereInstanceOf(AdminUser);

usuarios.first();                                // primeiro item ou null
usuarios.first(u => u.idade > 28);              // primeiro correspondente
usuarios.firstOrFail(u => u.idade > 28);        // lança exceção se não encontrar
usuarios.firstWhere('perfil', 'admin');
usuarios.firstWhere('idade', '>=', 28);

usuarios.last();
usuarios.last(u => u.idade > 28);

usuarios.sole();                                 // null se não for exatamente um item
usuarios.sole('perfil', 'admin');               // null se não for exatamente um match

usuarios.search('valor');                        // índice ou false
usuarios.search(u => u.nome === 'Alice');
usuarios.contains('valor');
usuarios.contains('perfil', 'admin');
usuarios.contains(u => u.idade > 28);
usuarios.containsStrict(/* ... */);
usuarios.doesntContain(/* ... */);
```

### Filtragem

```typescript
usuarios.filter(u => u.idade > 25);
usuarios.reject(u => u.idade > 25);
usuarios.skip(1);
usuarios.skipUntil(u => u.perfil === 'admin');
usuarios.skipWhile(u => u.perfil !== 'admin');
usuarios.take(2);
usuarios.takeUntil(u => u.perfil === 'admin');
usuarios.takeWhile(u => u.perfil !== 'admin');
usuarios.only([0, 2]);        // por índice
usuarios.except([1]);         // excluir por índice
usuarios.forPage(1, 10);      // paginação
usuarios.slice(1, 2);
usuarios.unique();
usuarios.unique('perfil');
usuarios.uniqueStrict('perfil');
usuarios.diff(outraColecao);
usuarios.intersect(outraColecao);
usuarios.ensure('object');    // lança exceção se algum item não for do tipo esperado
```

### Transformação

```typescript
usuarios.map(u => u.nome);
usuarios.flatMap(u => [u.nome, u.perfil]);
usuarios.pluck('nome');                          // Collection<string>
usuarios.select(['id', 'nome']);                 // seleciona apenas as chaves
usuarios.groupBy('perfil');                      // Record<string, Usuario[]>
usuarios.groupBy(u => u.perfil);
usuarios.keyBy('id');                            // Record<string, Usuario>
usuarios.keyBy(u => String(u.id));
usuarios.mapInto(AdminUser);                     // new AdminUser(item) para cada item
usuarios.mapSpread((a, b) => /* ... */);
usuarios.mapToGroups(u => ({ [u.perfil]: u.nome }));
usuarios.mapWithKeys(u => ({ [u.id]: u }));
usuarios.chunk(2);                               // Collection<Collection<Usuario>>
usuarios.split(3);
usuarios.splitIn(3);
usuarios.sliding(3, 1);
usuarios.chunkWhile((item, index, chunk) => /* ... */);
usuarios.collapse();
usuarios.combine(['a', 'b']);                    // chaves → valores como objeto simples
usuarios.crossJoin(outroArray);
usuarios.zip(outroArray);
usuarios.concat(outroArray);
usuarios.merge(outraColecao);
usuarios.reverse();
usuarios.shuffle();
usuarios.sort();
usuarios.sortBy('nome');
usuarios.sortBy('nome', 'desc');
usuarios.sortBy([['nome', 'asc'], ['idade', 'desc']]);
usuarios.sortDesc();
usuarios.nth(2);                                 // cada 2º item
usuarios.nth(2, 1);                              // cada 2º item a partir do índice 1
usuarios.pad(5, null);
```

### Agregados

```typescript
usuarios.count();
usuarios.countBy('perfil');
usuarios.sum('idade');
usuarios.avg('idade');
usuarios.average('idade');
usuarios.min('idade');
usuarios.max('idade');
usuarios.median('idade');
usuarios.mode('idade');
usuarios.percentage(u => u.perfil === 'admin');
```

### Mutação

Todos os métodos abaixo emitem o evento `change`.

```typescript
usuarios.push({ id: 4, nome: 'Dave', idade: 28, perfil: 'user' });
usuarios.prepend({ id: 0, nome: 'Root', idade: 40, perfil: 'admin' });
usuarios.pop();               // remove e retorna o último
usuarios.pop(2);              // remove e retorna os 2 últimos como Collection
usuarios.shift();             // remove e retorna o primeiro
usuarios.shift(2);            // remove e retorna os 2 primeiros como Collection
usuarios.pull(1);             // remove por índice, retorna o item
usuarios.forget(0);           // remove por índice, retorna this
usuarios.put(0, novoUsuario); // substitui no índice
usuarios.splice(1, 2);        // remove e retorna uma fatia
usuarios.splice(1, 1, novoUsuario); // substitui
usuarios.transform(u => ({ ...u, nome: u.nome.toUpperCase() })); // map in-place
```

### Pipeline e condicionais

```typescript
usuarios
    .when(isAdmin, col => col.where('perfil', 'admin'))
    .unless(ocultarInativos, col => col.whereNotNull('active'))
    .whenEmpty(col => col.push(usuarioPadrao))
    .whenNotEmpty(col => col.sortBy('nome'))
    .tap(col => console.log('total:', col.count()))
    .pipe(col => col.pluck('nome').toArray());

const resultado = usuarios.pipeThrough([
    col => col.where('perfil', 'admin'),
    col => col.pluck('nome'),
]);

const instancia = usuarios.pipeInto(AdminCollection);
```

### Saída

```typescript
usuarios.all();          // T[] (cópia)
usuarios.toArray();      // chama toArray()/toJson() recursivamente em itens aninhados
usuarios.toJson();       // string JSON
usuarios.implode(', ');
usuarios.implode('nome', ', ');
usuarios.join(', ');
usuarios.join(', ', ' e ');
usuarios.value('nome');  // valor da chave no primeiro item, ou null
usuarios.dump();         // console.log, retorna void
```

### Eventos de mudança

```typescript
usuarios.on('change', (e) => {
    console.log('coleção atualizada', e.items);
});
```

---

## PropertyBag

Container de propriedades imutável com acesso por dot notation, compartilhamento estrutural via Immer, bloqueio de caminhos e evento `change` a cada escrita.

```typescript
import { PropertyBag } from '@luminix/support';

const config = new PropertyBag({
    app: { nome: 'Luminix', debug: false },
    api: { url: 'https://api.example.com', timeout: 5000 },
});
```

### Leitura

```typescript
config.get('app.nome');                       // 'Luminix'
config.get('app.ausente', 'padrão');          // 'padrão'
config.has('api.url');                        // true
config.all();                                 // objeto completo (congelado)
config.isEmpty();                             // false
```

### Escrita

```typescript
config.set('app.debug', true);
config.set('.', { app: { nome: 'Novo' }, api: { url: '...' } }); // substitui a raiz

config.merge('api', { timeout: 10000 });      // merge profundo no caminho
config.merge('.', { extra: true });           // merge raso na raiz

config.delete('api.timeout');
```

### Bloqueio de caminhos

Caminhos bloqueados lançam exceção em qualquer tentativa de escrita ou deleção (inclusive em filhos).

```typescript
config.lock('app.nome');

config.set('app.nome', 'Outro'); // lança: Cannot set a locked path
```

### Clone

```typescript
const copia = config.clone(); // PropertyBag independente com os mesmos dados
```

### Eventos de mudança

```typescript
config.on('change', (e) => {
    // e.path   — caminho dot-notation que foi alterado
    // e.value  — novo valor (null em deleções)
    // e.type   — 'set' | 'merge' | 'delete'
    // e.source — a instância do PropertyBag
    console.log(e.type, e.path, e.value);
});
```

---

## HTTP Client

Cliente HTTP fluente baseado em Axios, inspirado na facade `Http` do Laravel.

### Client

Construa um cliente pré-configurado e reutilizável:

```typescript
import { Client } from '@luminix/support';

const http = new Client()
    .baseUrl('https://api.example.com')
    .acceptJson()
    .withToken('meu-token')
    .withHeaders({ 'X-App': 'Luminix' });
```

#### Métodos de configuração (todos retornam `this`)

| Método | Descrição |
|--------|-----------|
| `baseUrl(url)` | Define a URL base |
| `acceptJson()` | Define `Accept: application/json` |
| `accept(type)` | Define o header `Accept` |
| `asForm()` | Define `Content-Type: application/x-www-form-urlencoded`; dados são serializados automaticamente |
| `withToken(token)` | Define `Authorization: Bearer <token>` |
| `withBasicAuth(user, pass)` | Define `Authorization: Basic <base64>` |
| `withHeaders(headers)` | Mescla headers |
| `replaceHeaders(headers)` | Substitui headers |
| `withData(data)` | Mescla o corpo da requisição |
| `replaceData(data)` | Substitui o corpo da requisição |
| `withQueryParameters(params)` | Mescla query params (objeto, string ou `URLSearchParams`) |
| `replaceQueryParameters(params)` | Substitui query params |
| `withOptions(options)` | Mescla opções brutas do Axios |
| `replaceOptions(options)` | Substitui opções brutas do Axios |

#### Métodos de requisição

```typescript
http.get('/usuarios');
http.get('/usuarios', { pagina: 2 });

http.post('/usuarios', { nome: 'Alice' });
http.put('/usuarios/1', { nome: 'Alice' });
http.patch('/usuarios/1', { nome: 'Alice' });
http.delete('/usuarios/1');
```

Todos retornam uma instância de `Request`.

### Request

Wrapper compatível com `Promise` em torno da chamada Axios. Use diretamente como promise ou encadeie `.then()` / `.catch()` / `.finally()`.

```typescript
const response = await http.get<Usuario[]>('/usuarios');
```

### Response

```typescript
const res = await http.post('/usuarios', { nome: 'Alice' });

// Acesso aos dados
res.json();                   // corpo completo da resposta
res.json('data.id');          // caminho aninhado
res.has('data');              // true/false
res.body();                   // corpo como string
res.status();                 // status HTTP numérico
res.header('x-token');
res.headers();

// Verificações de status
res.successful()              // 2xx
res.redirect()                // 3xx
res.clientError()             // 4xx
res.serverError()             // 5xx
res.failed()                  // 4xx ou 5xx
res.ok()                      // 200
res.created()                 // 201
res.accepted()                // 202
res.noContent()               // 204
res.badRequest()              // 400
res.unauthorized()            // 401
res.forbidden()               // 403
res.notFound()                // 404
res.conflict()                // 409
res.unprocessableEntity()     // 422
res.tooManyRequests()         // 429

// Lançamento de exceções
res.throw();                                // lança se failed()
res.throwIf(true);
res.throwIf(r => r.status() === 404);
res.throwUnless(res.ok());
res.throwIfStatus(422);
res.throwUnlessStatus(201);
res.throwIfClientError();
res.throwIfServerError();

// Erro
res.error();  // o objeto Error se a requisição falhou, undefined caso contrário
```

---

## Mixins

### Macroable

Adiciona um método `macro()` a qualquer classe, permitindo que código de terceiros a estenda com métodos customizados em runtime. Usa `Proxy` para que macros sejam acessíveis como métodos nativos.

```typescript
import { Macroable } from '@luminix/support';

// Declare o mapa de tipos dos macros
declare class MeusMacros {
    gritar(): string;
}

class MinhaBase {
    cumprimentar() { return 'olá'; }
}

const MinhaClasse = Macroable<MeusMacros, typeof MinhaBase>(MinhaBase);
const obj = new MinhaClasse();

obj.macro('gritar', function() {
    return this.cumprimentar().toUpperCase() + '!';
});

obj.gritar();             // 'OLÁ!'
obj.hasMacro('gritar');   // true
obj.flushMacros();
```

Todos os utilitários singleton integrados (`Str`, `Obj`, `Arr`, `Func`, `Query`, `DateTime`) já são instâncias com `Macroable`.

### Reducible

Adiciona um pipeline de reducers nomeados a qualquer classe. Um reducer é uma função `(valor, ...params) => valor`. Múltiplos reducers para o mesmo nome são executados em ordem de prioridade. Apoia-se no Immer — se o valor for draftable, mutações dentro dos reducers funcionam naturalmente.

```typescript
import { Reducible } from '@luminix/support';

type MeusReducers = {
    processarTitulo: (valor: string, sufixo: string) => string;
};

class Base {}
const MinhaClasse = Reducible<MeusReducers, typeof Base>(Base);
const obj = new MinhaClasse();

// Registrar — retorna função de cancelamento
const off = obj.reducer('processarTitulo', (valor, sufixo) => {
    return valor + sufixo;
}, /* prioridade = */ 10);

// Executar o pipeline
const resultado = obj.processarTitulo('Olá', '!'); // 'Olá!'

// Introspecção
obj.hasReducer('processarTitulo');  // true
obj.getReducer('processarTitulo'); // Collection de { callback, priority }

// Cancelar assinatura
off();

// Operações em lote
obj.clearReducer('processarTitulo');
obj.flushReducers();
```

### MakeFacade

Implementa o padrão facade: cria um objeto proxy que delega chamadas de método a um serviço do container `Application`.

```typescript
import { MakeFacade } from '@luminix/support';

class HttpFacadeBase {
    getFacadeAccessor() { return 'http'; }
}

// app.singleton('http', () => new Client().baseUrl('...'))
const Http = MakeFacade<Client, typeof HttpFacadeBase>(HttpFacadeBase, app);

// Todos os métodos de Client estão disponíveis em Http diretamente
Http.get('/usuarios');
Http.post('/usuarios', { nome: 'Alice' });
```

---

## Utilitários

Todas as classes utilitárias são instâncias singleton com suporte a `Macroable`, podendo ser estendidas via `.macro()`.

### Str

Transformações de string.

```typescript
import { Str } from '@luminix/support';

Str.camel('hello_world')             // 'helloWorld'
Str.snake('helloWorld')              // 'hello_world'
Str.kebab('helloWorld')              // 'hello-world'
Str.studly('hello_world')            // 'HelloWorld'
Str.title('hello world')             // 'Hello World'
Str.human('helloWorld')              // 'Hello world'
Str.upper('hello')                   // 'HELLO'
Str.lower('HELLO')                   // 'hello'
Str.ucfirst('hello world')           // 'Hello world'
Str.lcfirst('Hello World')           // 'hello World'
Str.trim('  hello  ')                // 'hello'
Str.trim('--hello--', '-')           // 'hello'
Str.padLeft('5', 3, '0')             // '005'
Str.padRight('5', 3, '0')            // '500'
Str.padBoth('5', 3, '0')             // '050'
Str.before('foo@bar.com', '@')       // 'foo'
Str.after('foo@bar.com', '@')        // 'bar.com'
Str.beforeLast('a.b.c', '.')         // 'a.b'
Str.afterLast('a.b.c', '.')          // 'c'

// Macro customizado
Str.macro('slug', (str) => Str.kebab(str).toLowerCase());
Str.slug('Hello World'); // 'hello-world'
```

### Obj

Utilitários de objeto com suporte a caminhos dot notation profundos, baseado em lodash.

```typescript
import { Obj } from '@luminix/support';

const dados = { usuario: { nome: 'Alice', idade: 30 } };

Obj.get(dados, 'usuario.nome')               // 'Alice'
Obj.get(dados, 'usuario.ausente', 'N/A')     // 'N/A'
Obj.has(dados, 'usuario.nome')               // true
Obj.set(dados, 'usuario.perfil', 'admin')    // muta dados
Obj.unset(dados, 'usuario.idade')            // muta dados
Obj.pick(dados, 'usuario.nome')              // { usuario: { nome: 'Alice' } }
Obj.omit(dados, 'usuario.idade')             // { usuario: { nome: 'Alice' } }
Obj.merge({ a: 1 }, { b: 2 })               // merge profundo, NÃO muta
Obj.isEmpty({})                              // true
Obj.isEqual(dados, outrosDados)

// Conversão URLSearchParams / FormData
Obj.fromQuery(new URLSearchParams('pagina=1&ordem=nome')) // { pagina: 1, ordem: 'nome' }
Obj.toQuery({ pagina: 1, ordem: 'nome' })    // URLSearchParams
Obj.fromFormData(formData)
Obj.toFormData({ arquivo: blob })            // FormData
```

### Arr

Utilitários de array.

```typescript
import { Arr } from '@luminix/support';

Arr.cartesian([1, 2], ['a', 'b'])
// [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]

Arr.shuffle([1, 2, 3, 4, 5])      // cópia embaralhada
Arr.sampleSize([1, 2, 3, 4], 2)   // 2 elementos aleatórios
```

### Func

Controle de fluxo de funções.

```typescript
import { Func } from '@luminix/support';

const salvarDebounced = Func.debounce(salvar, 300);
salvarDebounced();
salvarDebounced.cancel();
salvarDebounced.flush();

const scrollThrottled = Func.throttle(aoScrollar, 100);
```

### Query

Utilitários para query strings de URL.

```typescript
import { Query } from '@luminix/support';

const params = Query.fromObject({ pagina: 1, ordem: 'nome' });
// URLSearchParams { pagina → '1', ordem → 'nome' }

const obj = Query.toObject(new URLSearchParams('pagina=1&ordem=nome'));
// { pagina: '1', ordem: 'nome' }

const merged = Query.merge('pagina=1', 'ordem=nome', 'filtro=ativo');
// URLSearchParams com todas as entradas
```

### DateTime

Utilitários de data.

```typescript
import { DateTime } from '@luminix/support';

DateTime.parse('2024-01-15')          // Date
DateTime.parse(new Date())            // Date (identidade)

DateTime.toDateTimeLocal(new Date())  // '2024-01-15T10:30'
// formatado para <input type="datetime-local">
```

---

## reader()

Lê dados JSON embutidos na página HTML pelos helpers Blade do Luminix.

```typescript
import { reader } from '@luminix/support';

// Lê o conteúdo de <div id="luminix-data::config">
const config = reader('config');

// Lê <div id="luminix-error::validation">
const erro = reader('validation', 'error');
```

A diretiva Blade `@luminixEmbed()`, do [luminix/frontend](https://github.com/luminix-cms/frontend#diretiva-luminixembed), renderiza a tag `<div>` correspondente. A classe `Application` chama `reader('config')` automaticamente durante `create()`.

---

## isValidationError()

Verifica se um erro do Axios carrega uma resposta `422 Unprocessable Entity` — o formato padrão de falhas de validação do Laravel.

```typescript
import { isValidationError } from '@luminix/support';

try {
    await http.throw().post('/usuarios', dados);
} catch (e) {
    if (isValidationError(e)) {
        // e.response.data.errors contém os erros de validação
        console.log(e.response.data.errors);
    }
}
```

---

## Re-exports

`axios` e `immer` são re-exportados para que pacotes dependentes usem exatamente as mesmas instâncias, evitando conflitos de versão:

```typescript
import { axios, immer } from '@luminix/support';
```

---

## Referência de tipos

```typescript
import type {
    // EventSource
    Event,
    EventMap,
    EventMapOf,
    EventsOf,
    EventCallbackOf,

    // Application
    ApplicationInterface,
    ApplicationEvents,

    // HTTP
    RequestOptions,

    // Mixins
    MacroableOf,
    MacroableInterface,
    HasFacadeAccessor,
    FacadeOf,
    ReducibleInterface,
    ReducibleOf,
    ReducerCallback,

    // Collection
    CollectionIteratorCallback,
    CollectionChanged,

    // PropertyBag
    PropertyBagEventMap,

    // Operadores de consulta
    Operator,  // '=' | '!=' | '>' | '>=' | '<' | '<='

    // Helpers genéricos
    Constructor,
    TypeOf,
    JsonObject,
    JsonValue,

    // Mapas de macros (estenda para adicionar macros customizados)
    ArrMacros,
    DateTimeMacros,
    FuncMacros,
    ObjMacros,
    QueryMacros,
    StrMacros,
} from '@luminix/support';
```

### Estendendo os mapas de macros

Declare um module augmentation para que macros customizados sejam type-safe:

```typescript
declare module '@luminix/support' {
    interface StrMacros {
        slug(value: string): string;
    }
}

// No seu arquivo de bootstrap:
import { Str } from '@luminix/support';
Str.macro('slug', (value) => value.toLowerCase().replace(/\s+/g, '-'));
```
