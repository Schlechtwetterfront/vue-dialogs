import { inject, getCurrentInstance } from 'vue';
import { Dialogs } from './dialogs';
import { DIALOGS_KEY } from './injectionKeys';

export function useDialogs() {
    const dialogs = inject<Dialogs>(DIALOGS_KEY);

    return dialogs;
}

export function useDialog() {
    const vm = getCurrentInstance();

    function resolve<T>(data?: T) {
        vm?.emit('resolve', data);
    }

    return { resolve };
}
