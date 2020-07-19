import { inject, getCurrentInstance } from 'vue';
import { DIALOGS_KEY } from './injectionKeys';

export function useDialogs() {
    const dialogs = inject(DIALOGS_KEY);

    return dialogs;
}

export function useDialog() {
    const vm = getCurrentInstance();

    function resolve<T>(data?: T) {
        vm?.emit('resolve', data);
    }

    return { resolve };
}
