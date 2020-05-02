# `vue-dialogs`

Promise-based dialogs for Vue 3

## Usage

Install package

Register plugin in your app

```js
import { createApp } from 'vue';
import dialogs from 'vue-dialogs';

import App from './components/App.vue';

const app = createApp(App);

app.use(dialogs);

app.mount('#app');
```

Place a dialog container component which will hold all dialog instances

```vue
<template>
    <main>
        <div>Your app content</div>
        <DialogsContainer />
    </main>
</template>

<script>
import { defineComponent } from 'vue';
import { DialogsContainer } from 'vue-dialogs';

export default defineComponent({
    components: { DialogsContainer },
    setup() {
        return {};
    },
});
</script>
```

Create a dialog component

...

Show your component

...

### Advanced

Return values

...
