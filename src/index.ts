import axios from 'axios';
import * as immer from 'immer';

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

import Arr from './Arr';
import DateTime from './DateTime';
import Func from './Func';
import Obj from './Obj';
import Query from './Query';
import Str from './Str';

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

    axios,
    immer,
};

export type { ArrMacros } from './Arr';
export type { DateTimeMacros } from './DateTime';
export type { FuncMacros } from './Func';
export type { ObjMacros } from './Obj';
export type { QueryMacros } from './Query';
export type { StrMacros } from './Str';

export type { ApplicationInterface, ApplicationEvents } from './App/Interfaces';
export type { Event, EventMap, EventMapOf, EventsOf, EventCallbackOf } from './Contracts/EventSource';
export type { RequestOptions } from './Http/Client';
export type { MacroableOf, MacroableInterface } from './Mixins/Macroable';
export type { HasFacadeAccessor, FacadeOf } from './Mixins/MakeFacade';
export type { ReducibleInterface, ReducibleOf, ReducerCallback } from './Mixins/Reducible';
export type { CollectionIteratorCallback } from './Collection';
export type { Constructor, TypeOf, JsonObject, JsonValue } from './Js';
export type { PropertyBagEventMap } from './PropertyBag';
