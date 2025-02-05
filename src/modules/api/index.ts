import { qiita } from './qiita';
import { zenn } from './zenn';
import { sizu } from './sizu';
import type { Env } from '@src/types';

export class Api {
  public qiita: ReturnType<typeof qiita>;
  public zenn: ReturnType<typeof zenn>;
  public sizu: ReturnType<typeof sizu>;

  constructor(env: Env['Bindings']) {
    this.qiita = qiita(env);
    this.zenn = zenn(env);
    this.sizu = sizu(env);
  }
}
