<template>
    <div>
        <header>A confirm dialog</header>
        <button @click="resolve(false)">
            Cancel
        </button>
        <button @click="resolve(true)">
            Accept
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useDialog } from '../../src';

export default defineComponent({
    setup() {
        const { resolve } = useDialog();

        return {
            resolve,
        };
    },
});
</script>
