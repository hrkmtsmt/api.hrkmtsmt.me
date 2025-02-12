import Crypto from 'crypto';
import snakecaseKeys from 'snakecase-keys';
import queryString from 'query-string';
import { Client, HTTP_METHODS } from '@src/modules';
import camelcaseKeys from 'camelcase-keys';
import type * as OAuth from './oauth.types';

export class HatenaOAuth {
  constructor(
    private client: Client,
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

  private toAuthorization(params: OAuth.InitiateAuthorizaitonParams) {
    return `OAuth ${this.toSortedQueryString(params).replaceAll('&', ',')}`;
  }

  private toSignature(
    method: string,
    url: string,
    params: OAuth.InitiateSignatureParams,
    keys: OAuth.InitiateSignatureKeys
  ) {
    const p = this.toSortedQueryString(params);
    const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(p)].join('&');
    const key = `${encodeURIComponent(keys.consumerSecret)}&${encodeURIComponent(keys.tokenSecret)}`;

    return Crypto.createHmac('sha1', key).update(baseString).digest().toString('base64');
  }

  public async initiate() {
    const params = {
      oauthCallback: 'oob',
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

    const response = await this.client.post<string, string>(endpoint, body, header);
    const json = queryString.parse(response) as Record<string, string | boolean>;

    return camelcaseKeys(json) as OAuth.InitiateResponse;
  }
}
