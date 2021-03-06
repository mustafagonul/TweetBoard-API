import oAuthManager from 'oauth';
import config from '../../config/environment';

class Twitter {
  constructor() {
    this.oAuthObject = new oAuthManager.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      config.twitter.consumerKey,
      config.twitter.consumerSecret,
      '1.0',
      `${config.api.url}/v1/${config.twitter.callbackURL}`,
      'HMAC-SHA1');
  }

  requestLogin() {
    return new Promise((resolve, reject) => {
      this.oAuthObject.getOAuthRequestToken((error, oAuthToken) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(`https://twitter.com/oauth/authenticate?oauth_token=${oAuthToken}`);
      });
    });
  }

  getAccessToken(oAuthToken, OAuthVerifier) {
    return new Promise((resolve, reject) => {
      this.oAuthObject.getOAuthAccessToken(
        oAuthToken,
        OAuthVerifier,
        OAuthVerifier,
        (error, oAuthAccessToken, oAuthAccessTokenSecret, results) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({
            oAuthAccessToken,
            oAuthAccessTokenSecret,
            results,
          });
        });
    });
  }

  getUser(oAuthAccesToken, oAuthAccesTokenSecret) {
    return new Promise((resolve, reject) => {
      this.oAuthObject.get(
        'https://api.twitter.com/1.1/account/verify_credentials.json',
        oAuthAccesToken,
        oAuthAccesTokenSecret,
        (error, twitterResponseData) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(JSON.parse(twitterResponseData));
        });
    });
  }

  searchTweets(parameters, oAuthAccesToken, oAuthAccesTokenSecret) {
    const generatedURL = `https://api.twitter.com/1.1/search/tweets.json?${parameters}`;
    return new Promise((resolve, reject) => {
      this.oAuthObject.get(
        generatedURL,
        oAuthAccesToken,
        oAuthAccesTokenSecret,
        (error, twitterResponseData) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(JSON.parse(twitterResponseData));
        });
    });
  }

  trendsAvailable(oAuthAccesToken, oAuthAccesTokenSecret) {
    return new Promise((resolve, reject) => {
      this.oAuthObject.get(
        'https://api.twitter.com/1.1/trends/available.json',
        oAuthAccesToken,
        oAuthAccesTokenSecret,
        (error, twitterResponseData) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(JSON.parse(twitterResponseData));
        });
    });
  }

  trendsInPlace(placeId = 1, oAuthAccesToken, oAuthAccesTokenSecret) {
    return new Promise((resolve, reject) => {
      this.oAuthObject.get(
        `https://api.twitter.com/1.1/trends/place.json?id=${placeId}`,
        oAuthAccesToken,
        oAuthAccesTokenSecret,
        (error, twitterResponseData) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(JSON.parse(twitterResponseData));
        });
    });
  }

  userTimeline(screenName, oAuthAccesToken, oAuthAccesTokenSecret) {
    return new Promise((resolve, reject) => {
      this.oAuthObject.get(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${screenName}`,
        oAuthAccesToken,
        oAuthAccesTokenSecret,
        (error, twitterResponseData) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(JSON.parse(twitterResponseData));
        });
    });
  }
}

export default Twitter;
