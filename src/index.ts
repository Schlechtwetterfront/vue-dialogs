import { App, Plugin, createApp, h } from 'vue';
import { createDialogs, Dialogs } from './dialogs';
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

export default plugin;

export { DialogsContainer };

export * from './useApi';
