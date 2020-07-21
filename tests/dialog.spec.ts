import { DialogsContainer, useDialogs, dialogs, DIALOGS_KEY, useDialog } from '../src';
import { defineComponent, nextTick, reactive } from 'vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { createDialogs, Dialogs } from '../src/dialogs';

const DialogComp = defineComponent({
    name: 'DialogComp',
    template: '<div>#Dialog</div>',
    setup() {
        const { resolve } = useDialog();

        return { close: () => resolve('dialogData') };
    },
});

const DialogCompWithProps = defineComponent({
    name: 'DialogCompWithProps',
    props: {
        prop: {
            type: String,
            default: 'default',
        },
    },
    template: '<div>Prop: {{ prop }}</div>',
});

describe('Dialogs: show', () => {
    let wrapper: VueWrapper<any>;
    let dialogs: Dialogs;

    beforeEach(() => {
        dialogs = createDialogs();
        wrapper = mount(DialogsContainer, {
            global: {
                provide: {
                    [DIALOGS_KEY as symbol]: dialogs,
                },
            },
        });
    });

    it('should render the dialog', async () => {
        dialogs.from(DialogComp).show();

        await nextTick();

        expect(dialogs.dialogs.length).toBeGreaterThan(0);

        expect(dialogs.current).not.toBe(null);

        const comp = wrapper.findComponent(DialogComp);

        expect(comp.exists()).toBe(true);

        expect(wrapper.text()).toContain('#Dialog');
    });

    it('should render with default props', async () => {
        dialogs.from(DialogCompWithProps).show();

        await nextTick();

        expect(wrapper.text()).toContain('Prop: default');
    });

    it('should render with props', async () => {
        dialogs.from(DialogCompWithProps, { prop: 'custom' }).show();

        await nextTick();

        expect(wrapper.text()).toContain('Prop: custom');
    });

    it('should render with reactive props', async () => {
        const props = reactive({
            prop: 'before',
        });

        dialogs.from(DialogCompWithProps, props).show();

        await nextTick();

        expect(wrapper.text()).toContain('Prop: before');

        props.prop = 'after';

        expect(wrapper.text()).toContain('Prop: before');

        await nextTick();

        expect(wrapper.text()).toContain('Prop: after');
    });

    it('should accept vnode props', async () => {
        dialogs.from(DialogComp, { class: 'vnodeClass' }).show();

        await nextTick();

        const c = wrapper.findComponent(DialogComp);

        expect(c.classes()).toContain('vnodeClass');

        expect(wrapper.html()).toContain('vnodeClass');
    });

    it('should show last dialog', async () => {
        dialogs.from(DialogCompWithProps, { prop: '1' }).show();

        await nextTick();

        expect(wrapper.text()).toContain('Prop: 1');

        dialogs.from(DialogCompWithProps, { prop: '2' }).show();

        await nextTick();

        expect(wrapper.text()).toContain('Prop: 2');
    });

    it('should show last dialog', async () => {
        dialogs.from(DialogCompWithProps, { prop: '1' }).show();

        dialogs.from(DialogCompWithProps, { prop: '2' }).show();

        dialogs.from(DialogCompWithProps, { prop: '3' }).show();

        await nextTick();

        expect(wrapper.text()).toContain('Prop: 3');

        expect(dialogs.dialogs.length).toBe(3);
    });
});

describe('Dialogs: resolve', () => {
    let wrapper: VueWrapper<any>;
    let dialogs: Dialogs;

    beforeEach(() => {
        dialogs = createDialogs();
        wrapper = mount(DialogsContainer, {
            global: {
                provide: {
                    [DIALOGS_KEY as symbol]: dialogs,
                },
            },
        });
    });

    it('should close the dialog', async () => {
        const d = dialogs.from(DialogComp);

        d.show();

        await nextTick();

        expect(wrapper.text()).toContain('#Dialog');

        dialogs.resolve(d.def);

        await nextTick();

        expect(wrapper.text()).not.toContain('#Dialog');
    });

    it('should return data', async () => {
        expect.assertions(1);

        const d = dialogs.from(DialogComp);

        const p = d.show();

        await nextTick();

        dialogs.resolve(d.def, 'someData');

        return p.then((data) => expect(data).toBe('someData'));
    });
});

describe('Dialogs: reject/rejectAll', () => {
    let wrapper: VueWrapper<any>;
    let dialogs: Dialogs;

    beforeEach(() => {
        dialogs = createDialogs();
        wrapper = mount(DialogsContainer, {
            global: {
                provide: {
                    [DIALOGS_KEY as symbol]: dialogs,
                },
            },
        });
    });

    it('should throw for a single dialog', async () => {
        expect.assertions(2);

        const d = dialogs.from(DialogComp);

        const p = d.show();

        await nextTick();

        expect(wrapper.text()).toContain('#Dialog');

        dialogs.reject(d.def);

        return p.catch((reason) => expect(reason).toBeUndefined());
    });

    it('should clear all dialogs', async () => {
        expect.assertions(7);

        const promises = [
            dialogs
                .from(DialogComp)
                .show()
                .catch((reason) => expect(reason).toBeUndefined()),
            dialogs
                .from(DialogComp)
                .show()
                .catch((reason) => expect(reason).toBeUndefined()),
            dialogs
                .from(DialogComp)
                .show()
                .catch((reason) => expect(reason).toBeUndefined()),
        ];

        const all = Promise.all(promises);

        await nextTick();

        expect(wrapper.text()).toContain('#Dialog');

        expect(dialogs.dialogs.length).toBe(3);

        dialogs.rejectAll();

        expect(dialogs.dialogs.length).toBe(0);

        await nextTick();

        expect(wrapper.text()).not.toContain('#Dialog');

        return all;
    });
});

describe('Dialog: resolve', () => {
    let wrapper: VueWrapper<any>;
    let dialogs: Dialogs;

    beforeEach(() => {
        dialogs = createDialogs();
        wrapper = mount(DialogsContainer, {
            global: {
                provide: {
                    [DIALOGS_KEY as symbol]: dialogs,
                },
            },
        });
    });

    it('stops rendering the dialog', async () => {
        dialogs.from(DialogComp).show();

        // Render
        await nextTick();

        const compBefore = wrapper.findComponent(DialogComp);

        expect(compBefore.exists()).toBe(true);

        (compBefore.vm as any).close();

        // Should stop rendering
        await nextTick();

        expect(dialogs.dialogs.length).toBe(0);

        expect(dialogs.current).toBe(null);

        expect(wrapper.findComponent(DialogComp).exists()).toBe(false);
    });

    it('should return data', async () => {
        expect.assertions(2);

        const p = dialogs.from(DialogComp).show();

        // Render
        await nextTick();

        const compBefore = wrapper.findComponent(DialogComp);

        expect(compBefore.exists()).toBe(true);

        (compBefore.vm as any).close();

        return p.then((data) => expect(data).toBe('dialogData'));
    });
});
