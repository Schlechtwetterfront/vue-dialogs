import {
    ComponentOptionsBase,
    ref,
    Ref,
    FunctionalComponent,
    Component,
    markRaw,
    computed,
    reactive,
} from 'vue';

type DialogComponent = Component | (() => Promise<Component>);

type ExtractComponentProps<
    TComponent extends DialogComponent
> = TComponent extends ComponentOptionsBase<infer CProps, any, any, any, any, any> // ^- Standard component
    ? CProps extends Readonly<infer RawCProps> // Props may be Readonly<...>, so extract again
        ? RawCProps | Ref<RawCProps>
        : CProps | Ref<CProps>
    : TComponent extends FunctionalComponent<infer FCProps> // Functional component
    ? FCProps extends Readonly<infer RawFCProps> // Props may be Readonly<...? again
        ? RawFCProps | Ref<RawFCProps>
        : FCProps | Ref<FCProps>
    : any;

export interface Dialog<TComponent extends DialogComponent = DialogComponent, TReturnValue = any> {
    id: string;

    component: TComponent;

    props?: ExtractComponentProps<TComponent>;

    _resolve: (value?: TReturnValue) => void;
    _reject: (reason?: any) => void;
}

type ExtractReturnValue<T = Dialog> = T extends Dialog<any, infer TReturnValue>
    ? TReturnValue
    : any;

let dialogId = 0;

export interface Dialogs {
    dialogs: Dialog[];

    current: Dialog | null;

    show: <TReturnValue = unknown, TComponent extends DialogComponent = DialogComponent>(
        component: TComponent,
        props?: ExtractComponentProps<TComponent>
    ) => Promise<TReturnValue>;

    resolve: <TDialog extends Dialog>(dialog: TDialog, data?: ExtractReturnValue<TDialog>) => void;

    reject: <TDialog extends Dialog>(dialog: TDialog) => void;

    rejectAll: () => void;
}

export function createDialogs() {
    const dialogs = ref<Dialog[]>([]);

    const current = computed(() =>
        dialogs.value.length > 0 ? dialogs.value[dialogs.value.length - 1] : null
    );

    function show<TReturnValue = unknown, TComponent extends DialogComponent = DialogComponent>(
        component: TComponent,
        props?: ExtractComponentProps<TComponent>
    ) {
        let resolver: ((value?: any) => void) | undefined;
        let rejecter: ((reason?: any) => void) | undefined;

        const p = new Promise<TReturnValue>((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        });

        const dialog: Dialog<TComponent, ExtractComponentProps<TComponent>> = {
            id: (dialogId++).toString(),
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

    function resolve<TDialog extends Dialog>(dialog: TDialog, data?: ExtractReturnValue<TDialog>) {
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
