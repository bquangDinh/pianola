export const ValueInputOptions = {
	USER_ENTERED: 'USER_ENTERED',
	RAW: 'RAW',
	INPUT_VALUE_OPTION_UNSPECIFIED: 'INPUT_VALUE_OPTION_UNSPECIFIED'
}

export class GoogleSheetHelper {
	private tokenClient: google.accounts.oauth2.TokenClient | null = null
	private _gapiInited = false
	private _gisInited = false
	private clientSecret: Record<string, string | string[]> = {}
	private _initialized = false
	private accessToken: string = ''

	private static googleSheetInstance: GoogleSheetHelper

	private constructor() {
		//
	}

	public static getInstance() {
		if (!GoogleSheetHelper.googleSheetInstance) {
			GoogleSheetHelper.googleSheetInstance = new GoogleSheetHelper()
		}

		return GoogleSheetHelper.googleSheetInstance
	}

	public async init() {
		if (this.isInitialized) {
			console.warn('Google Sheet Helper has been initialized')
			return
		}

		const response = await fetch('/client_secret_596748386175-snk4b1jagpmaq5f6q75ng3l2fj4qilam.apps.googleusercontent.com.json')

		const clientSecret = await response.json()

		this.clientSecret = clientSecret['web']

		this._initialized = true
	}

	public get isInitialized() {
		return this._initialized
	}

	public get gapiInited() {
		return this._gapiInited
	}

	public get gisInited() {
		return this._gisInited
	}

	public gapiLoaded() {
		gapi.load('client', this.initializeGapiClient.bind(this))
	}

	private async initializeGapiClient() {
		const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

		await gapi.client.init({
			apiKey: 'AIzaSyAoo_GddjZjkidQiJebnMIsbJ7BD4ihKeY',
			discoveryDocs: [DISCOVERY_DOC]
		})

		this._gapiInited = true
	}

	public gisLoaded() {
		this.tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: this.clientSecret['client_id'] as string,
			scope: 'https://www.googleapis.com/auth/spreadsheets',
			callback: (e) => {
				this.accessToken = e.access_token
			}
		})
		this._gisInited = true
	}

	public authorize() {
		if (!this.tokenClient) {
			console.error('TokenClient is undefined')

			return
		}

		if (gapi.client.getToken() === null) {
			this.tokenClient.requestAccessToken({ prompt: 'consent' })
		} else {
			this.tokenClient.requestAccessToken({ prompt: '' })
		}
	}

	public async appendValues(spreadsheetId: string, range: string, values: unknown[][], valueInputOption?: string) {
		const body = {
			values
		}

		try {
			gapi.client.sheets.spreadsheets.values.append({
				spreadsheetId,
				range,
				valueInputOption,
				resource: body,
				access_token: this.accessToken,
			}).then((response) => {
				console.log(response.result)
			})
		} catch (err) {
			console.error(err)
		}
	}
}

export const GoogleSheetHelperIns = GoogleSheetHelper.getInstance()