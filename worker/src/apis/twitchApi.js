class twitchApi {

  constructor(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET) {
    this.TWITCH_CLIENT_ID = TWITCH_CLIENT_ID;
    this.TWITCH_CLIENT_SECRET = TWITCH_CLIENT_SECRET;
    this.GRANT_TYPE = "client_credentials";
    this.API_BASE = "https://api.twitch.tv/helix";
    this.OAUTH_BASE = "https://id.twitch.tv/oauth2";
  }

  async getAccessToken() {
    const oauth_url = `${this.OAUTH_BASE}/token?client_id=${this.TWITCH_CLIENT_ID}&client_secret=${this.TWITCH_CLIENT_SECRET}&grant_type=${this.GRANT_TYPE}`;
    const response = await fetch(oauth_url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    const { access_token } = await response.json();
    return access_token;
  }

  async getUserByName(name) {
    try {
      const access_token = await this.getAccessToken();
      const api = `${this.API_BASE}/users?login=${name.toLowerCase()}`;
      const headers = {
        "Client-ID": this.TWITCH_CLIENT_ID,
        "Authorization": "Bearer " + access_token
      };

      if(!access_token) return null;

      const response = await fetch(api, {headers});
      const { data } = await response.json();
      return data[0];
    }
    catch (err) {
      console.info(err);
      return null;
    }
  }

  async getStreamsByName(array) {
    try {
      const access_token = await this.getAccessToken();
      const arrayString = array.filter((name, index) => array.indexOf(name) === index).map(login => `user_login=${login}`).join("&");
      const api = `${this.API_BASE}/streams?${arrayString}`;
      const headers = {
        "Client-ID": this.TWITCH_CLIENT_ID,
        "Authorization": "Bearer " + access_token
      };

      if(!access_token) return null;

      const response = await fetch(api, {headers});
      const { data } = await response.json();
      return data;
    }
    catch (err) {
      console.info(err);
      return null;
    }
  }
}

export default twitchApi;