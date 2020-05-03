<template>
    <section>
        <label>Field 1</label>
        <input type="text" v-model="form.field1" />
        <label>Field 2</label>
        <input type="text" v-model="form.field2" />
        <button @click="submit">
            OK
        </button>
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useDialog } from '../../src';

export default defineComponent({
    setup() {
        const { resolve } = useDialog();

        const form = reactive({
            field1: '',
            field2: 'default',
        });

        function submit() {
            resolve(form);
        }

        return {
            form,
            submit,
        };
    },
});
</script>