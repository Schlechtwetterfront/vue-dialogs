<template>
    <div class="examples">
        <div class="examples__example">
            <h2>Info dialog</h2>
            <p>Simple ("static") dialog</p>
            <button @click="openInfo">Open</button>
        </div>

        <div class="examples__example">
            <h2>Info dialog with props</h2>
            <p>Pass props to dialog component</p>
            <button @click="openInfoWithProps">Open</button>
        </div>

        <div class="examples__example">
            <h2>Confirm dialog</h2>
            <p>
                Get a simple return value (
                <code>boolean</code>
                ) from the dialog
            </p>
            <p>
                Response:
                <code>{{ state.confirmResponse }}</code>
            </p>
            <button @click="openConfirm">Open</button>
        </div>

        <div class="examples__example">
            <h2>Form dialog</h2>
            <p>
                Get a complex return value (
                <code>object</code>
                ) from the dialog
            </p>
            <p>
                Response:
                <code>{{ JSON.stringify(state.formResponse) }}</code>
            </p>
            <button @click="openForm">Open</button>
        </div>

        <div class="examples__example">
            <h2>Dialog with reactive props</h2>
            <p>Pass a reactive object into the component props</p>
            <button @click="openProps">Open</button>
        </div>

        <div class="examples__example">
            <h2>Multiple dialogs</h2>
            <p>Add multiple dialogs at once. Only the newest will be rendered</p>
            <p>
                Currently open:
                <code>{{ openDialogs }}</code>
            </p>
            <button @click="openMany">Open</button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from 'vue';

import { useDialogs } from '../../src';
import InfoDialog from './InfoDialog';
import ConfirmDialog from './ConfirmDialog.vue';
import FormDialog from './FormDialog.vue';

export default defineComponent({
    setup() {
        const dialogs = useDialogs();

        const openDialogs = computed(() => dialogs?.dialogs.length);

        interface Form {
            field1: string;
            field2: string;
        }

        const state = reactive<{
            confirmResponse: boolean | null;
            formResponse: Form | null;
        }>({
            confirmResponse: null,
            formResponse: null,
        });

        async function openInfo() {
            await dialogs?.from(InfoDialog).show();
        }

        async function openInfoWithProps() {
            await dialogs
                ?.from(InfoDialog, {
                    text: 'Simple info dialog with text passed via props',
                })
                .show();
        }

        async function openConfirm() {
            if (!dialogs) {
                return;
            }

            const r = await dialogs.from(ConfirmDialog).show<boolean>();

            state.confirmResponse = r;
        }

        function openMany() {
            let index = 0;

            for (let index = 0; index < 3; index++) {
                dialogs
                    ?.from(InfoDialog, {
                        text: `Info dialog ${index}`,
                    })
                    .show();
            }
        }

        async function openForm() {
            if (!dialogs) {
                return;
            }

            state.formResponse = await dialogs.from(FormDialog).show<Form>();
        }

        const propsCounter = ref(0);
        const props = computed(() => ({ text: `Count: ${propsCounter.value}` }));

        async function openProps() {
            const interval = setInterval(() => {
                propsCounter.value++;
            }, 333);

            await dialogs?.from(InfoDialog, props).show();

            clearInterval(interval);
        }

        return {
            state,
            openInfo,
            openInfoWithProps,
            openConfirm,
            openMany,
            openDialogs,
            openForm,
            openProps,
        };
    },
});
</script>

<style lang="scss">
.examples {
    display: flex;
    flex-wrap: wrap;

    height: 100%;

    &__example {
        flex: 0 0 33%;
        margin-bottom: 3rem;
    }
}
</style>
