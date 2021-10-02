require('dotenv').config();

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

const creds = {
	type                        : process.env.type,
	project_id                  : process.env.project_id,
	private_key_id              : process.env.private_key_id,
	private_key                 : process.env.private_key.replace(new RegExp('\\\\n', 'g'), '\n'),
	client_email                : process.env.client_email,
	client_id                   : process.env.client_id,
	auth_uri                    : process.env.auth_uri,
	token_uri                   : process.env.token_uri,
	auth_provider_x509_cert_url : process.env.auth_provider_x509_cert_url,
	client_x509_cert_url        : process.env.client_x509_cert_url
};

exports.addRow = async (sender, recipient, sheetNum = 0) => {
	const doc = new GoogleSpreadsheet(process.env.LOGS_ID);
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[sheetNum];
	const row = [
		new Date().toLocaleString('en-US', {
			timeZone : 'America/New_York'
		}),
		sender,
		recipient
	];
	await sheet.addRow(row);
};

exports.getRowCount = async (user = null, sheetNum = 0) => {
	const doc = new GoogleSpreadsheet(process.env.LOGS_ID);
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	console.log(user);
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[sheetNum];
	let rows = await sheet.getRows();
	if (user !== null) {
		rows = rows.filter((row) => row['Initiator'] === user);
	}
	let number = rows.length;
	return number;
};

//https://docs.google.com/spreadsheets/d/1sMAlmWe6qIvSc21grnhqBrrOqv1NdFqyQ7YmMILKgtU/edit#gid=1387463060
exports.getMovie = async () => {
	const doc = new GoogleSpreadsheet('1sMAlmWe6qIvSc21grnhqBrrOqv1NdFqyQ7YmMILKgtU');
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[2];
	let rows = sheet.getRows();
	if (rows.length > 0) return rows[0];
	else return;
};

exports.postMeme = async (meme) => {
	const { name, link, description } = meme;
	const doc = new GoogleSpreadsheet(process.env.LOGS_ID);
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[2];

	const row = [
		name,
		link,
		description
	];

	await sheet.addRow(row);
};

exports.getMeme = async (name) => {
	const doc = new GoogleSpreadsheet(process.env.LOGS_ID);
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[2];
	let rows = await promisify(sheet.getRows)();
	const row = rows.filter((row) => row.name === name)[0];
	return row;
};

//TO-DO: Refactor to combine meme and playlist methods
exports.postPlaylist = async (playlist) => {
	const { name, link, songs } = playlist;
	const doc = new GoogleSpreadsheet(process.env.LOGS_ID);
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[3];

	const row = [
		name,
		link,
		songs
	];

	await sheet.addRow(row);
};

exports.getPlaylist = async (name) => {
	const doc = new GoogleSpreadsheet(process.env.LOGS_ID);
	await doc.useServiceAccountAuth({
		client_email : creds.client_email,
		private_key  : creds.private_key
	});
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[3];
	let rows = await sheet.getRows();
	const row = rows.filter((row) => row.name === name)[0];
	return row;
};
