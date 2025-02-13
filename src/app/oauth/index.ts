import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Api, Cache } from '@src/modules';
import type { BlankSchema } from 'hono/types';
import type { Env } from '@src/types';
import type { InitiateResponse } from '@src/modules/api/hatena/oauth.types';

const cache = new Cache<InitiateResponse>();

export const oauth = new Hono<Env, BlankSchema, '/'>()
  .get('/oauth/hatena', async (c) => {
    try {
      const { oauth } = new Api(c.env).hatena;
      const token = await oauth.initiate();
      cache.set(token);
      return c.redirect(oauth.authorizeURL(token.oauthToken));
    } catch {
      throw new HTTPException(500, { message: 'Failed authorize.' });
    }
  })
  .get('/oauth/hatena/callback', async (c) => {
    const token = c.req.query('oauth_token');
    const verifier = c.req.query('oauth_verifier');
    const value = cache.get();

    if (!token || !verifier || !value) {
      throw new HTTPException(500, { message: 'Failed to get token.' });
    }

    const { oauth } = new Api(c.env).hatena;
    const t = await oauth.token(value.oauthToken, value.oauthTokenSecret, verifier);
    const response = { ACCESS_TOKEN: t.oauthToken, ACCESS_TOKEN_SECRET: t.oauthTokenSecret };
    cache.clear();

    return c.json(response);
  });
