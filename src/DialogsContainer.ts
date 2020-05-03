import { defineComponent, inject, h } from 'vue';
import { DIALOGS_KEY } from './injectionKeys';
import { Dialog } from './dialogs';

export default defineComponent({
    setup() {
        const dialogs = inject(DIALOGS_KEY);

        function resolveWith(dialog: Dialog, data: any) {
            dialogs?.resolve(dialog, data);
        }

        return () => {
            const current = dialogs?.current;

            return h(
                'div',
                {
                    class: {
                        'v-dialogs': true,
                        'v-dialogs--with-dialogs': dialogs?.dialogs.length ?? 0 > 0,
                    },
                },
                current
                    ? h(
                          'div',
                          {
                              key: current.id,
                              class: 'v-dialog',
                          },
                          h(current.component, {
                              ...current.props,
                              onResolve: (returnData: any) => resolveWith(current, returnData),
                          })
                      )
                    : undefined
            );
        };
    },
});
