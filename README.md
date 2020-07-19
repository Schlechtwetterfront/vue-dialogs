# `vue-dialogs`

Promise-based dialogs for Vue 3

## Usage

Install package

```bash
# yarn
yarn add @schlechtwetterfront/vue-dialogs

# npm
npm install @schlechtwetterfront/vue-dialogs
```

Register the plugin in your Vue app

```ts
import { createApp } from 'vue';
import { dialogs } from '@schlechtwetterfront/vue-dialogs';

import App from '...';

const app = createApp(App);

app.use(dialogs);

app.mount('#app');
```

Place a dialog container component which will hold all dialog instances. This should be placed in a way that easily allows styling the dialogs container to cover (overlay) your app area (by using css `position: relative` and `position: absolute`)

```vue
<template>
    <main>
        <div>Your app content</div>
        <DialogsContainer />
    </main>
</template>
<script>
import { defineComponent } from 'vue';
import { DialogsContainer } from '@schlechtwetterfront/vue-dialogs';

export default defineComponent({
    components: { DialogsContainer },
    setup() {
        return {};
    },
});
</script>
```

Create a dialog. Dialogs are just standard Vue components. The only thing a dialog component needs to do is let this library know when it should be closed. The library function `useDialog` provides a `resolve` funtion to do that

```vue
<template>
    <div>
        <header>An info dialog</header>
        <p>Info text...</p>
        <button @click="ok">OK</button>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useDialog } from '@schlechtwetterfront/vue-dialogs';

export default defineComponent({
    setup() {
        // Resolves and closes the dialog
        const { resolve } = useDialog();

        const ok = () => resolve();

        return { ok };
    },
});
</script>
```

Show your component. `useDialogs` returns the dialog "manager". `dialogs.show` returns a `Promise` that resolves when the dialog is closed

```ts
import { defineComponent } from 'vue';
import { useDialogs } from '@schlechtwetterfront/vue-dialogs';

import InfoDialog from '...';

export default defineComponent({
    setup() {
        const dialogs = useDialogs();

        async function openDialog() {
            await dialogs?.show(InfoDialog);

            // Dialog is closed here
        }

        return { openDialog };
    },
});
```

Set up some (S)CSS to display the dialogs

```scss
// Dialog container and overlay
.v-dialogs {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.3);

    // When the container has dialogs
    &--with-dialogs {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    // One dialog
    .v-dialog {
        min-width: 260px;

        background-color: white;

        padding: 1rem;
    }
}
```

### Return values

The `resolve` function takes a single optional argument `data`. Any data/input gathered in the dialog can be returned this way

```vue
<template>
    <div>
        <input v-model="form.field1" />
        <input v-model="form.field2" />
        <button @click="submit">OK</button>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useDialog } from '@schlechtwetterfront/vue-dialogs';

export default defineComponent({
    setup() {
        const { resolve } = useDialog();

        const form = reactive({
            field1: '',
            field2: 'default',
        });

        const submit = () => resolve(form);

        return { form, submit };
    },
});
</script>
```

```ts
import { defineComponent } from 'vue';
import { useDialogs } from '@schlechtwetterfront/vue-dialogs';

import FormDialog from '...';

interface Form {
    field1: string;
    field2: string;
}

export default defineComponent({
    setup() {
        const dialogs = useDialogs();

        async function openDialog() {
            if (!dialogs) {
                return;
            }

            // Explicitly specify return value as type param
            const returnValue = await dialogs.show<Form>(FormDialog);
        }

        return { openInfo };
    },
});
```

### Dialog Props

Props can be passed to dialog components like any other components. `dialogs.show` passes on its second argument to the component

```ts
import { defineComponent } from 'vue';
import { useDialogs } from '@schlechtwetterfront/vue-dialogs';

import InfoDialog from '...';

export default defineComponent({
    setup() {
        const dialogs = useDialogs();

        async function openDialog() {
            // The type of the component props should automatically be extracted from the component
            await dialogs?.show(InfoDialog, { text: 'My overriden info text' });
        }

        return { openInfo };
    },
});
```

Refs (`ref`, `computed`) and reactive objects can be passed into the props, too

#### Getting typed props and specifying the return value

Due to a limitation of TypeScript (lack of partial generics interference), the type of the component props cannot be inferred if the type of the return value is specified

```ts
await dialogs.show<boolean>(DialogComponent, { prop: 'value' });
// Cannot be inferred ------------------------------ ^^^^^^^
```

In that case, the type of the component has to be explicitly specified

```ts
await dialogs.show<boolean, typeof DialogComponent>(DialogComponent, { prop: 'value' });
// Specify component type - ^^^^^^^^^^^^^^^^^^^^^^
```
