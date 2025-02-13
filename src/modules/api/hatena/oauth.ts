import Crypto from 'crypto';
import snakecaseKeys from 'snakecase-keys';
import queryString from 'query-string';
import { Client, HTTP_METHODS } from '@src/modules';
import camelcaseKeys from 'camelcase-keys';
import type * as OAuth from './oauth.types';

export class HatenaOAuth {
  constructor(
    private oauth: Client,
    private url: string,
    private consumerKey: string,
    private consumerSecret: string
  ) {}

  private getNonce() {
    return Crypto.randomBytes(16).toString('hex');
  }

  private getTimestamp() {
    return Math.floor(new Date().getTime()).toString();
  }

  private toSortedQueryString(params: Record<string, string>) {
    return queryString.stringify(snakecaseKeys(params), { sort: (a, b) => a.localeCompare(b) });
  }

  private toAuthorization(params: OAuth.InitiateAuthorizaitonParams | OAuth.AccessTokenSignatureParams) {
    return `OAuth ${this.toSortedQueryString(params).replaceAll('&', ',')}`;
  }

  private toSignature(
    method: string,
    url: string,
    params: OAuth.InitiateSignatureParams | OAuth.AccessTokenSignatureParams,
    keys: OAuth.InitiateSignatureKeys | OAuth.AccessTokenSignatureKeys
  ) {
    const p = this.toSortedQueryString(params);
    const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(p)].join('&');
    const key = `${encodeURIComponent(keys.consumerSecret)}&${encodeURIComponent(keys.tokenSecret)}`;

    return Crypto.createHmac('sha1', key).update(baseString).digest().toString('base64');
  }

  public async initiate() {
    const params = {
      oauthCallback: 'http://localhost:8787/oauth/hatena/callback',
      oauthConsumerKey: this.consumerKey,
      oauthNonce: this.getNonce(),
      oauthSignature_method: 'HMAC-SHA1',
      oauthTimestamp: this.getTimestamp(),
      oauthVersion: '1.0',
    };
    const endpoint = '/oauth/initiate';
    const url = `${this.url}${endpoint}`;
    const scope = 'read_public';
    const signatureParams = { ...params, scope };
    const signatureKeys = { consumerSecret: this.consumerSecret, tokenSecret: '' };
    const signature = this.toSignature(HTTP_METHODS.post, url, signatureParams, signatureKeys);
    const authorization = this.toAuthorization({ ...params, oauthSignature: signature });

    const header = { Authorization: authorization };
    const body = queryString.stringify({ scope });

    const response = await this.oauth.post<string, string>(endpoint, body, header);
    const json = queryString.parse(response) as Record<string, string | boolean>;

    return camelcaseKeys(json) as OAuth.InitiateResponse;
  }

  public authorizeURL(token: string) {
    return `${this.url}/oauth/authorize?oauth_token=${token}`;
  }

  public async token(requestToken: string, requestTokenSecret: string, verifier: string) {
    const params = {
      oauthConsumerKey: this.consumerKey,
      oauthNonce: this.getNonce(),
      oauthSignature_method: 'HMAC-SHA1',
      oauthTimestamp: this.getTimestamp(),
      oauthToken: requestToken,
      oauthVerifier: verifier,
      oauthVersion: '1.0',
    };
    const endpoint = '/oauth/token';
    const url = `${this.url}${endpoint}`;
    const signature = this.toSignature(HTTP_METHODS.post, url, params, {
      consumerSecret: this.consumerSecret,
      tokenSecret: requestTokenSecret,
    });
    const authorization = this.toAuthorization({ ...params, oauthSignature: signature });

    const header = { Authorization: authorization };
    const body = null;

    const response = await this.oauth.post<string, null>(endpoint, body, header);
    const json = queryString.parse(response) as Record<string, string | boolean>;

    return camelcaseKeys(json) as OAuth.AccessTokenResponse;
  }

  public static generateAuthorization(
    method: string,
    url: string,
    consumerKey: string,
    consumerSecret: string,
    accessToken: string,
    accessTokenSecret: string
  ) {
    const params = {
      oauthConsumerKey: consumerKey,
      oauthNonce: Crypto.randomBytes(16).toString('hex'),
      oauthSignatureMethod: 'HMAC-SHA1',
      oauthTimestamp: Math.floor(new Date().getTime()).toString(),
      oauthToken: accessToken,
      oauthVersion: '1.0',
    };

    const p = queryString.stringify(snakecaseKeys(params), { sort: (a, b) => a.localeCompare(b) });
    const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(p)].join('&');
    const key = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(accessTokenSecret)}`;

    return `OAuth ${Crypto.createHmac('sha1', key).update(baseString).digest().toString('base64')}`;
  }
}
