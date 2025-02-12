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
  oauthSignature_method: string;
  oauthTimestamp: string;
  oauthVersion: string;
  oauthSignature: string;
};

export type InitiateResponse = {
  oauthCallbackConfirmed: boolean;
  oauthToken: string;
  oauthTokenSecret: string;
};
