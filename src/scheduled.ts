import { hc } from 'hono/client';
import { toBasicAuth } from './modules';
import type { AppType } from './main';
import type { Env } from './types';

export const scheduled: ExportedHandlerScheduledHandler<Env['Bindings']> = async (_, env, c) => {
  const client = hc<AppType>(env.APP_URL);
  const headers = { Authorization: toBasicAuth(env.SECRET_BASIC_AUTH_USERNAME, env.SECRET_BASIC_AUTH_PASWORD) };
  c.waitUntil(client['posts:bulk'].$put({ headers }));
};
