import { GoogleSheetConfigs } from "@src/configs/app.config";

export const ValueInputOptions = {
  USER_ENTERED: "USER_ENTERED",
  RAW: "RAW",
  INPUT_VALUE_OPTION_UNSPECIFIED: "INPUT_VALUE_OPTION_UNSPECIFIED",
};

export class GoogleSheetHelper {
  private tokenClient: google.accounts.oauth2.TokenClient | null = null;
  private _gapiInited = false;
  private _gisInited = false;
  private accessToken: string = "";

  private static googleSheetInstance: GoogleSheetHelper;

  private constructor() {
    //
  }

  public static getInstance() {
    if (!GoogleSheetHelper.googleSheetInstance) {
      GoogleSheetHelper.googleSheetInstance = new GoogleSheetHelper();
    }

    return GoogleSheetHelper.googleSheetInstance;
  }

  public get gapiInited() {
    return this._gapiInited;
  }

  public get gisInited() {
    return this._gisInited;
  }

  public gapiLoaded() {
    gapi.load("client", this.initializeGapiClient.bind(this));
  }

  private async initializeGapiClient() {
    const DISCOVERY_DOC =
      "https://sheets.googleapis.com/$discovery/rest?version=v4";

    await gapi.client.init({
      apiKey: GoogleSheetConfigs.apiKey,
      discoveryDocs: [DISCOVERY_DOC],
    });

    this._gapiInited = true;
  }

  public gisLoaded() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GoogleSheetConfigs.clientId,
      scope: GoogleSheetConfigs.scope,
      callback: (e) => {
        this.accessToken = e.access_token
        alert('Authorized Google Sheet Services')
      }
    });

    this._gisInited = true;
  }

  public authorize() {
    if (!this.tokenClient) {
      console.error("TokenClient is undefined");

      return;
    }

    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      this.tokenClient.requestAccessToken({ prompt: "" });
    }
  }

  public async appendValues(
    spreadsheetId: string,
    range: string,
    values: unknown[][],
    valueInputOption?: string
  ) {
    const body = {
      values,
    };

    try {
      gapi.client.sheets.spreadsheets.values
        .append({
          spreadsheetId,
          range,
          valueInputOption,
          resource: body,
          access_token: this.accessToken,
        })
        .then((response) => {
          console.log(response.result);
        });
    } catch (err) {
      console.error(err);
    }
  }
}

export const GoogleSheetHelperIns = GoogleSheetHelper.getInstance();
