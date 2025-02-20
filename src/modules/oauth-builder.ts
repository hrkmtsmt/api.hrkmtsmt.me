import crypto from "crypto";
import queryString from "query-string";
import snakecaseKeys from "snakecase-keys";

type Params = Record<string, string>;

type SignatureKey = Record<"consumerSecret" | "tokenSecret", string>;

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class OAuthBuilder {
  private static toSortedQueryString<T extends Params>(params: T) {
    return queryString.stringify(snakecaseKeys(params), {
      sort: (a, b) => a.localeCompare(b),
    });
  }

  private static toSignatureBaseString<T extends Params>(method: string, url: string, params: T) {
    return [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(this.toSortedQueryString(params))].join(
      "&"
    );
  }

  private static toSignatureKey(consumerSecret: string, tokenSecret: string) {
    return [encodeURIComponent(consumerSecret), encodeURIComponent(tokenSecret)].join("&");
  }

  public static nonce() {
    return crypto.randomBytes(16).toString("hex");
  }

  public static timestamp() {
    return Math.floor(Date.now()).toString();
  }

  public static toSignature<T extends Params>(method: string, url: string, params: T, key: SignatureKey) {
    const b = this.toSignatureBaseString(method, url, params);
    const k = this.toSignatureKey(key.consumerSecret, key.tokenSecret);
    return crypto.createHmac("sha1", k).update(b).digest().toString("base64");
  }

  public static toAuthorization<T extends Params>(params: T) {
    return `OAuth ${this.toSortedQueryString(params).replaceAll("&", ",")}`;
  }
}
