module.exports = getDailyReport = async function(apiDomain, apiPath, address){
	const axios = require('axios');
	try{
		const url = `https://${apiDomain}/${apiPath}?id=${address}`;
		const response = await axios.get(url);
		const content = response.data;
		let values = [];
		content.forEach((service) => {
			service.portfolio_item_list.forEach((item) => {
				const token = item.detail.supply_token_list[0];
				const name = token.name;
				const amount = token.amount;
				const value = `${item.stats.asset_usd_value}$`;
				const dateObj = new Date();
				// Month is in [0,11]
				const month = dateObj.getMonth() + 1;
				const date = dateObj.getDate() + '/' + month + '/' + dateObj.getFullYear();
				const entry = [
					date,
					name,
					amount,
					value
				];
				values.push(entry);
			});
		});

		return values;
	}catch(error){
		console.error("getDailyReport() : ");
		console.error(error);
		return;
	}
};
