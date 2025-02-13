export type InitiateSignatureParams = {
  oauthCallback: string;
  oauthConsumerKey: string;
  oauthNonce: string;
  oauthSignature_method: string;
  oauthTimestamp: string;
  oauthVersion: string;
  scope: string;
};

export type InitiateSignatureKeys = {
  consumerSecret: string;
  tokenSecret: string;
};

export type InitiateAuthorizaitonParams = {
  oauthCallback: string;
  oauthConsumerKey: string;
  oauthNonce: string;
  oauthSignatureMethod: string;
  oauthTimestamp: string;
  oauthVersion: string;
  oauthSignature: string;
};

export type InitiateResponse = {
  oauthCallbackConfirmed: boolean;
  oauthToken: string;
  oauthTokenSecret: string;
};

export type AccessTokenSignatureParams = {
  oauthConsumerKey: string;
  oauthNonce: string;
  oauthSignatureMethod: string;
  oauthTimestamp: string;
  oauthToken: string;
  oauthVersion: string;
  oauthVerifier: string;
};

export type AccessTokenSignatureKeys = {
  consumerSecret: string;
  tokenSecret: string;
};

export type AccessTokenResponse = {
  oauthToken: string;
  oauthTokenSecret: string;
  urlName: string;
  displayName: string;
};
