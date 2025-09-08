import { Octokit } from "@octokit/rest";
import { hatena } from "./hatena";
import { qiita } from "./qiita";
import { sizu } from "./sizu";
import { zenn } from "./zenn";
import type { Env } from "@types";

export class Api {
  public hatena: ReturnType<typeof hatena>;

  public qiita: ReturnType<typeof qiita>;

  public sizu: ReturnType<typeof sizu>;

  public zenn: ReturnType<typeof zenn>;

  constructor(env: Env["Bindings"]) {
    this.hatena = hatena(env);
    this.qiita = qiita(env);
    this.sizu = sizu(env);
    this.zenn = zenn(env);
  }
}
