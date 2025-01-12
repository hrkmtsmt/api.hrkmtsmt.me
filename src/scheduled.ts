import { hc } from 'hono/client';
import { AppType } from './main';

export const scheduled: ExportedHandlerScheduledHandler = async () => {
  const client = hc<AppType>('/');
  await client['posts:bulk'].$put();
};
