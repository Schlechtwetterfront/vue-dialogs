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
export interface Dialog<ComponentDef = {}> {
    readonly _id: string;

    readonly component: ComponentDef;

    props?: ExtractProps<ComponentDef>;

    _resolve: (value?: any) => void;
    _reject: (reason?: any) => void;
}

let dialogId = 0;

/**
 * Dialog manager
 */
export interface Dialogs {
    dialogs: Dialog[];

    current: Dialog | null;

    show: <ReturnValue = unknown, ComponentDef extends {} = {}>(
        component: ComponentDef,
        props?: ExtractProps<ComponentDef>
    ) => Promise<ReturnValue>;

    resolve: <TDialog extends Dialog>(dialog: TDialog, data?: any) => void;

    reject: <TDialog extends Dialog>(dialog: TDialog) => void;

    rejectAll: () => void;
}

export function createDialogs() {
    const dialogs = ref<Dialog[]>([]);

    const current = computed(() =>
        dialogs.value.length > 0 ? dialogs.value[dialogs.value.length - 1] : null
    );

    function show<ReturnValue = unknown, ComponentDef extends {} = {}>(
        component: ComponentDef,
        props?: ExtractProps<ComponentDef>
    ) {
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
    }

    function remove<TDialog extends Dialog>(dialog: TDialog) {
        const index = dialogs.value.indexOf(dialog);

        if (index > -1) {
            dialogs.value.splice(index, 1);
        }
    }

    function resolve<TDialog extends Dialog>(dialog: TDialog, data?: any) {
        dialog._resolve(data);

        remove(dialog);
    }

    function reject<TDialog extends Dialog>(dialog: TDialog) {
        dialog._reject();

        remove(dialog);
    }

    function rejectAll() {
        dialogs.value.forEach((d) => d._reject());

        dialogs.value = [];
    }

    const dialogManager: Dialogs = reactive({
        show,
        resolve,
        reject,
        rejectAll,
        dialogs,
        current,
    });

    return dialogManager;
}
