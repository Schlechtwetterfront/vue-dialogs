import { InjectionKey } from 'vue';
import { Dialogs } from './dialogs';

export const DIALOGS_KEY = Symbol('dialogs') as InjectionKey<Dialogs>;
