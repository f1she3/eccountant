module.exports = updateSheet = async function(auth, spreadsheetId, values){
	try{
		const {google} = require('googleapis');
		const sheets = google.sheets({version: 'v4', auth: auth});
		let range = 'A1:D1';
		const resource = {
			values,
		};
		const valueInputOption = 'USER_ENTERED';
		const response = (await sheets.spreadsheets.values.append({
			spreadsheetId: spreadsheetId,
			range: range,
			valueInputOption: valueInputOption,
			resource: resource,
		})).data;

		return response;
	}catch(error){
		console.error("updateSheet(): ");
		console.error(error);
		return;
	}
}
