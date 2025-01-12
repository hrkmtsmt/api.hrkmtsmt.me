import { Env } from '@src/types';
import { Client } from '.';

export class Api {
  public qiita: Client;

  public zenn: Client;

  public sizu: Client;

  constructor(env: Env['Bindings']) {
    this.qiita = new Client(env.QIITA_API_URL, { Authorization: `Bearer ${env.SECRET_QIITA_API_ACCESS_TOKEN}` });
    this.zenn = new Client(env.ZENN_API_URL);
    this.sizu = new Client(env.SIZU_API_URL, { Authorization: `Bearer ${env.SECRET_SIZU_API_KEY}` });
  }
}
