require('dotenv').config();
const process = require('process');
const { google } = require('googleapis');
const { promises: fs } = require('fs');

require('./functions/main');
require('./functions/sheets');

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const API_DOMAIN = 'openapi.debank.com';
const API_PATH = 'v1/user/complex_protocol_list';

(async () => {
	try{
		// Dirty hack to save the key keyFile
		// on the ephemeral storage of heroku
		// Delete file if exists,
		// then recreate it using the env var 
		// which contains the full json key
		try{
			await fs.unlink("config/key.json");
		}catch(e){
			if(e.code !== 'ENOENT'){
				throw new Error(e);
			}
		}
		let key = await fs.open("config/key.json", 'a+');
		await key.write(process.env.SERVICE_ACCOUNT_JSON);
		await key.close();
		const auth = new google.auth.GoogleAuth({
			keyFile: 'config/key.json',
			scopes: SCOPE,
		});
		const client = await auth.getClient();
		const values = await getDailyReport(API_DOMAIN, API_PATH, process.env.ADDRESS);
		const response = await updateSheet(client, process.env.SSID, values);

		return response;
	}catch(e){
		console.error("Main():");
		console.error(e);
		process.exitCode = 1;
	}
})();
