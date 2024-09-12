import { produce, isDraftable } from 'immer';

import Application from './App/Application';
import Client from './Http/Client';
import Collection from './Collection';
import EventSource from './Contracts/EventSource';
import Macroable from './Mixins/Macroable';
import MakeFacade from './Mixins/MakeFacade';
import PropertyBag from './PropertyBag';
import reader from './reader';
import Reducible from './Mixins/Reducible';
import Request from './Http/Request';
import Response from './Http/Response';
import ServiceProvider from './App/ServiceProvider';

import isValidationError from './Http/Utils/isValidationError';

import * as Arr from './Arr';
import * as DateTime from './DateTime';
import * as Func from './Func';
import * as Obj from './Obj';
import * as Query from './Query';
import * as Str from './Str';

export {
    Application,
    Arr,
    Client,
    Collection,
    DateTime,
    EventSource,
    Func,
    isValidationError,
    Macroable,
    MakeFacade,
    Obj,
    PropertyBag,
    reader,
    Reducible,
    Request,
    Response,
    ServiceProvider,
    Query,
    Str,

    produce,
    isDraftable,
};

export type { ApplicationInterface, ApplicationEvents } from './App/Interfaces';
export type { Event, EventMap, EventMapOf, EventsOf, EventCallbackOf } from './Contracts/EventSource';
export type { MacroableOf, MacroableInterface } from './Mixins/Macroable';
export type { HasFacadeAccessor, FacadeOf } from './Mixins/MakeFacade';
export type { ReducibleInterface, ReducibleOf, ReducerCallback } from './Mixins/Reducible';
export type { PropertyBagEventMap } from './PropertyBag';
export type { Constructor, TypeOf, JsonObject, JsonValue } from './Js';
export type { RequestOptions } from './Http/Client';
