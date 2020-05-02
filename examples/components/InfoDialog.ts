import { defineComponent, h } from 'vue';
import { useDialog } from '../../src';

export default defineComponent({
    props: {
        text: {
            type: String,
            default: 'Simple info dialog',
        },
    },
    setup(props) {
        const { resolve } = useDialog();

        return () =>
            h('div', [
                h('div', props.text),
                h(
                    'button',
                    {
                        onClick() {
                            resolve();
                        },
                    },
                    ['OK']
                ),
            ]);
    },
});
