import { ref, markRaw, computed, reactive, ComponentPublicInstance } from 'vue';

/**
 * Component constructor returned by defineComponent
 */
type ComponentConstructor<T extends ComponentPublicInstance> = new (...args: any) => T;

/**
 * Extract props type if possible
 */
type ExtractProps<ComponentDef> = ComponentDef extends ComponentConstructor<infer ComponentProps>
    ? InstanceType<ComponentConstructor<ComponentProps>>['$props']
    : unknown;

/**
 * Dialog definition
 */
export interface DialogDef<ComponentDef = {}> {
    readonly _id: string;

    readonly component: ComponentDef;

    props?: ExtractProps<ComponentDef>;

    _resolve: (value?: any) => void;
    _reject: (reason?: any) => void;
}

interface Dialog {
    show: <ReturnValue = unknown>() => Promise<ReturnValue>;
}

let dialogId = 0;

/**
 * Dialog manager
 */
export interface Dialogs {
    dialogs: DialogDef[];

    current: DialogDef | null;

    from: <ComponentDef extends {} = {}>(
        component: ComponentDef,
        props?: ExtractProps<ComponentDef>
    ) => Dialog;

    resolve: <TDialog extends DialogDef>(dialog: TDialog, data?: any) => void;

    reject: <TDialog extends DialogDef>(dialog: TDialog) => void;

    rejectAll: () => void;
}

export function createDialogs() {
    const dialogs = ref<DialogDef[]>([]);

    const current = computed(() =>
        dialogs.value.length > 0 ? dialogs.value[dialogs.value.length - 1] : null
    );

    function from<ComponentDef extends {} = {}>(
        component: ComponentDef,
        props?: ExtractProps<ComponentDef>
    ): Dialog {
        const show = <ReturnValue = unknown>() => {
            let resolver: ((value?: any) => void) | undefined;
            let rejecter: ((reason?: any) => void) | undefined;

            const p = new Promise<ReturnValue>((resolve, reject) => {
                resolver = resolve;
                rejecter = reject;
            });

            const dialog = {
                _id: (dialogId++).toString(),
                component: markRaw(component),
                props: props,
                _resolve: resolver!,
                _reject: rejecter!,
            };

            dialogs.value.push(dialog);

            return p;
        };

        return { show };
    }

    function remove<TDialog extends DialogDef>(dialog: TDialog) {
        const index = dialogs.value.indexOf(dialog);

        if (index > -1) {
            dialogs.value.splice(index, 1);
        }
    }

    function resolve<TDialog extends DialogDef>(dialog: TDialog, data?: any) {
        dialog._resolve(data);

        remove(dialog);
    }

    function reject<TDialog extends DialogDef>(dialog: TDialog) {
        dialog._reject();

        remove(dialog);
    }

    function rejectAll() {
        dialogs.value.forEach((d) => d._reject());

        dialogs.value = [];
    }

    const dialogManager: Dialogs = reactive({
        from,
        resolve,
        reject,
        rejectAll,
        dialogs,
        current,
    });

    return dialogManager;
}
