import { defineComponent, inject, h } from 'vue';
import { DIALOGS_KEY } from './injectionKeys';
import { DialogDef } from './dialogs';

export default defineComponent({
    setup() {
        const dialogs = inject(DIALOGS_KEY);

        if (!dialogs) {
            throw new Error('Dialogs manager not provided. Install the dialogs plugin');
        }

        function resolveWith(dialog: DialogDef, data: any) {
            dialogs!.resolve(dialog, data);
        }

        return () => {
            const current = dialogs.current;

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
                              key: current._id,
                              class: 'v-dialog',
                          },
                          h(current.component, {
                              ...(current.props instanceof Object ? current.props : {}),
                              onResolve: (returnData: any) => resolveWith(current, returnData),
                          })
                      )
                    : undefined
            );
        };
    },
});
