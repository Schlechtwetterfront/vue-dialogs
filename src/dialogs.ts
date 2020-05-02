import {
    ComponentOptionsBase,
    ref,
    Ref,
    FunctionalComponent,
    Component,
    markRaw,
    computed,
    ComputedRef,
} from 'vue';

type DialogComponent = Component | (() => Promise<Component>);

type ExtractComponentProps<
    TComponent extends DialogComponent
> = TComponent extends ComponentOptionsBase<infer CProps, any, any, any, any, any> // ^- Standard component
    ? CProps extends Readonly<infer RawCProps> // Props may be Readonly<...>, so extract again
        ? RawCProps
        : CProps
    : TComponent extends FunctionalComponent<infer FCProps> // Functional component
    ? FCProps extends Readonly<infer RawFCProps> // Props may be Readonly<...? again
        ? RawFCProps
        : FCProps
    : any;

export interface Dialog<TComponent extends DialogComponent = DialogComponent, TReturnValue = any> {
    id: string;

    component: TComponent;

    props?: ExtractComponentProps<TComponent>;

    _resolve: (value?: TReturnValue) => void;
}

type ExtractReturnValue<T = Dialog> = T extends Dialog<any, infer TReturnValue>
    ? TReturnValue
    : any;

let dialogId = 0;

export interface Dialogs {
    dialogs: Ref<Dialog[]>;

    current: Readonly<Ref<Dialog | null>>;

    show: <TReturnValue = unknown, TComponent extends DialogComponent = DialogComponent>(
        component: TComponent,
        props?: ExtractComponentProps<TComponent>
    ) => Promise<TReturnValue>;

    resolve: <TDialog extends Dialog>(dialog: Dialog, data?: ExtractReturnValue<TDialog>) => void;
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
        let resolver: ((value?: any) => void) | null = null;

        const p = new Promise<TReturnValue>((resolve) => (resolver = resolve));

        const dialog: Dialog<TComponent, ExtractComponentProps<TComponent>> = {
            id: (dialogId++).toString(),
            component: markRaw(component),
            props: props,
            _resolve: resolver!,
        };

        dialogs.value.push(dialog);

        return p;
    }

    function resolve<TDialog extends Dialog>(dialog: TDialog, data?: ExtractReturnValue<TDialog>) {
        dialog._resolve(data);

        const index = dialogs.value.indexOf(dialog);

        if (index > -1) {
            dialogs.value.splice(index, 1);
        }
    }

    const dialogManager: Dialogs = {
        show,
        resolve,
        dialogs,
        current,
    };

    return dialogManager;
}
