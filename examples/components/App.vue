<template>
    <section>
        <header>
            <h1>
                <code>vue-dialogs</code>
                playground
            </h1>
        </header>

        <div>
            <h2>Info dialog</h2>
            <p>No return value</p>
            <button @click="openInfo">Open</button>
        </div>

        <div>
            <h2>Info dialog with props</h2>
            <p>No return value</p>
            <button @click="openInfoWithProps">Open</button>
        </div>

        <div>
            <h2>Confirm dialog</h2>
            <p>Response: {{ state.confirmResponse }}</p>
            <button @click="openConfirm">Open</button>
        </div>

        <div>
            <h2>Multiple dialogs</h2>
            <p>Currently open: {{ openDialogs }}</p>
            <button @click="openMany">Open</button>
        </div>

        <DialogsContainer />
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';
import { useDialogs } from '../../src';
import InfoDialog from './InfoDialog';
import ConfirmDialog from './ConfirmDialog.vue';

import { DialogsContainer } from '../../src';

export default defineComponent({
    components: {
        DialogsContainer,
    },
    setup() {
        const dialogs = useDialogs();

        const openDialogs = computed(() => dialogs?.dialogs.value.length);

        const state = reactive({
            confirmResponse: undefined as boolean | undefined,
        });

        async function openInfo() {
            await dialogs?.show(InfoDialog);
        }

        async function openInfoWithProps() {
            await dialogs?.show(InfoDialog, {
                text: 'Simple info dialog with text passed via props',
            });
        }

        async function openConfirm() {
            if (!dialogs) {
                return;
            }

            const r = await dialogs.show<boolean>(ConfirmDialog);

            state.confirmResponse = r;
        }

        function openMany() {
            let index = 0;

            for (let index = 0; index < 3; index++) {
                dialogs?.show(InfoDialog, {
                    text: `Info dialog ${index}`,
                });
            }
        }

        return {
            state,
            openInfo,
            openInfoWithProps,
            openConfirm,
            openMany,
            openDialogs,
        };
    },
});
</script>

<style lang="scss">
.v-dialogs {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.1);

    &--with-dialogs {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .v-dialog {
        min-width: 260px;

        background-color: white;

        padding: 1rem;
    }
}
</style>
