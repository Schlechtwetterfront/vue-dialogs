import { App, Plugin } from 'vue';
import { createDialogs, Dialogs, DialogDef } from './dialogs';
import { DIALOGS_KEY } from './injectionKeys';
import DialogsContainer from './DialogsContainer';

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $dialogs: Dialogs;
    }
}

const plugin: Plugin = {
    install(app: App) {
        const dialogs = createDialogs();

        app.provide(DIALOGS_KEY, dialogs);

        app.config.globalProperties.$dialogs = dialogs;
    },
};

export { plugin as dialogs, DialogsContainer, DIALOGS_KEY, Dialogs, DialogDef };

export * from './useApi';
