<template>
    <section class="playground">
        <header class="playground__header">
            <h1>
                <code>vue-dialogs</code>
                playground
            </h1>
        </header>

        <div class="playground__content">
            <Examples />
            <DialogsContainer />
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue';

import { DialogsContainer } from '../../src';
import Examples from './Examples.vue';

export default defineComponent({
    components: {
        DialogsContainer,
        Examples,
    },
    setup() {
        return {};
    },
});
</script>

<style lang="scss">
body {
    color: #333;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
        'Open Sans', 'Helvetica Neue', sans-serif;
}

* {
    box-sizing: border-box;
}

.playground {
    height: 100%;

    max-width: 1200px;
    margin: 0 auto;

    &__header {
        display: flex;

        justify-content: center;
        align-items: center;
        height: 100px;
        border-bottom: 1px solid #efefef;
    }

    &__content {
        position: relative;
        min-height: 60vh;

        padding: 2rem;
    }
}

.v-dialogs {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.3);

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
