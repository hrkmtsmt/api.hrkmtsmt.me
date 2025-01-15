import { app } from './main';
import { toBasicAuth } from './modules';
import type { Env } from './types';

export const scheduled: ExportedHandlerScheduledHandler<Env['Bindings']> = async (_, env, c) => {
  const headers = { Authorization: toBasicAuth(env.SECRET_BASIC_AUTH_USERNAME, env.SECRET_BASIC_AUTH_PASWORD) };
  c.waitUntil(app.request('/posts:bulk', { method: 'PUT', headers }) as Promise<any>);
};
