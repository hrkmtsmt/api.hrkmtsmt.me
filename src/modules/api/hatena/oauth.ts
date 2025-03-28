import camelcaseKeys from "camelcase-keys";
import queryString from "query-string";
import { Client, HTTP_METHODS, OAuthBuilder } from "@modules";
import type * as OAuth from "./oauth.types";

export class HatenaOAuth {
	private signatureMethod = "HMAC-SHA1";

	private version = "1.0";

	constructor(
		private oauth: Client,
		private builder: OAuthBuilder,
		private url: string,
		private consumerKey: string,
		private consumerSecret: string,
	) {}

	public async initiate() {
		const params = {
			oauthCallback: "http://localhost:8787/oauth/hatena/callback",
			oauthConsumerKey: this.consumerKey,
			oauthNonce: this.builder.nonce(),
			oauthSignatureMethod: this.signatureMethod,
			oauthTimestamp: this.builder.timestamp(),
			oauthVersion: this.version,
		};
		const endpoint = "/oauth/initiate";
		const url = `${this.url}${endpoint}`;
		const scope = "read_public,read_private";
		const signatureParams = { ...params, scope };
		const signatureKeys = {
			consumerSecret: this.consumerSecret,
			tokenSecret: "",
		};
		const oauthSignature = this.builder.toSignature(
			HTTP_METHODS.post,
			url,
			signatureParams,
			signatureKeys,
		);
		const authorization = this.builder.toAuthorization({
			...params,
			oauthSignature,
		});

		const header = { Authorization: authorization };
		const body = queryString.stringify({ scope });

		const response = await this.oauth.post<string, string>(
			endpoint,
			body,
			header,
		);
		const json = queryString.parse(response) as Record<
			string,
			string | boolean
		>;

		return camelcaseKeys(json) as OAuth.InitiateResponse;
	}

	public authorizeURL(token: string) {
		return `${this.url}/oauth/authorize?oauth_token=${token}`;
	}

	public async token(
		requestToken: string,
		requestTokenSecret: string,
		verifier: string,
	) {
		const params = {
			oauthConsumerKey: this.consumerKey,
			oauthNonce: this.builder.nonce(),
			oauthSignature_method: this.signatureMethod,
			oauthTimestamp: this.builder.timestamp(),
			oauthToken: requestToken,
			oauthVerifier: verifier,
			oauthVersion: this.version,
		};
		const endpoint = "/oauth/token";
		const url = `${this.url}${endpoint}`;
		const oauthSignature = this.builder.toSignature(
			HTTP_METHODS.post,
			url,
			params,
			{
				consumerSecret: this.consumerSecret,
				tokenSecret: requestTokenSecret,
			},
		);
		const authorization = this.builder.toAuthorization({
			...params,
			oauthSignature,
		});

		const header = { Authorization: authorization };
		const body = null;

		const response = await this.oauth.post<string, null>(
			endpoint,
			body,
			header,
		);
		const json = queryString.parse(response) as Record<
			string,
			string | boolean
		>;

		return camelcaseKeys(json) as OAuth.AccessTokenResponse;
	}

	public generateAuthorization(
		method: string,
		url: string,
		consumerKey: string,
		consumerSecret: string,
		accessToken: string,
		accessTokenSecret: string,
	) {
		const params = {
			oauthConsumerKey: consumerKey,
			oauthNonce: this.builder.nonce(),
			oauthSignatureMethod: "HMAC-SHA1",
			oauthTimestamp: this.builder.timestamp(),
			oauthToken: accessToken,
			oauthVersion: "1.0",
		};
		const oauthSignature = this.builder.toSignature(method, url, params, {
			consumerSecret,
			tokenSecret: accessTokenSecret,
		});

		return this.builder.toAuthorization({ ...params, oauthSignature });
	}
}
