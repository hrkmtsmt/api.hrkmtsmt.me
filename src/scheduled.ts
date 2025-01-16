import { hc } from 'hono/client';
import { toBasicAuth } from './modules';
import type { AppType } from './main';
import type { Env } from './types';

export const scheduled: ExportedHandlerScheduledHandler<Env['Bindings']> = async (_, env, context) => {
  context.waitUntil(
    (async () => {
      try {
        console.log(_, env);
        const client = hc<AppType>(env.APP_URL);
        const headers = { Authorization: toBasicAuth(env.SECRET_BASIC_AUTH_USERNAME, env.SECRET_BASIC_AUTH_PASWORD) };
        await client['posts:bulk'].$put({}, { headers });
      } catch (error: unknown) {
        console.error(error);
      }
    })()
  );
};
