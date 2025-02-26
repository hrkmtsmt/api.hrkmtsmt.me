import crypto from "crypto";
import queryString from "query-string";
import snakecaseKeys from "snakecase-keys";

type Params = Record<string, string>;

type SignatureKey = Record<"consumerSecret" | "tokenSecret", string>;

export class OAuthBuilder {
	private toSortedQueryString<T extends Params>(params: T) {
		return queryString.stringify(snakecaseKeys(params), {
			sort: (a, b) => a.localeCompare(b),
		});
	}

	private toSignatureBaseString<T extends Params>(
		method: string,
		url: string,
		params: T,
	) {
		return [
			method.toUpperCase(),
			encodeURIComponent(url),
			encodeURIComponent(this.toSortedQueryString(params)),
		].join("&");
	}

	private toSignatureKey(consumerSecret: string, tokenSecret: string) {
		return [
			encodeURIComponent(consumerSecret),
			encodeURIComponent(tokenSecret),
		].join("&");
	}

	public nonce() {
		return crypto.randomBytes(16).toString("hex");
	}

	public timestamp() {
		return Math.floor(Date.now()).toString();
	}

	public toSignature<T extends Params>(
		method: string,
		url: string,
		params: T,
		key: SignatureKey,
	) {
		const b = this.toSignatureBaseString(method, url, params);
		const k = this.toSignatureKey(key.consumerSecret, key.tokenSecret);
		return crypto.createHmac("sha1", k).update(b).digest().toString("base64");
	}

	public toAuthorization<T extends Params>(params: T) {
		return `OAuth ${this.toSortedQueryString(params).replaceAll("&", ",")}`;
	}
}
