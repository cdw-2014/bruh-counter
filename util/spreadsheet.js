require("dotenv").config();

const GoogleSpreadsheet = require("google-spreadsheet");
const { promisify } = require("util");

const creds = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key.replace(new RegExp("\\\\n", "g"), "\n"),
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url
};

exports.accessSpreadsheet = async (sender, recipient, sheetNum = 0) => {
  const doc = new GoogleSpreadsheet(
    "1Jw7xVPkZKH2me8927RuCPQ4bQnFiiBufVQop-0nHUiQ"
  );
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[sheetNum];

  const row = {
    dateRecorded: new Date().toLocaleString("en-US", {
      timeZone: "America/New_York"
    }),
    recordedBy: sender,
    initiator: recipient
  };

  await promisify(sheet.addRow)(row);
};

exports.getRowCount = async (user = null, sheetNum = 0) => {
  const doc = new GoogleSpreadsheet(
    "1Jw7xVPkZKH2me8927RuCPQ4bQnFiiBufVQop-0nHUiQ"
  );
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[sheetNum];
  let rows = await promisify(sheet.getRows)();
  if (user !== null) {
    rows = rows.filter(row => row.initiator === user);
  }
  let number = rows.length;
  return number;
};

//https://docs.google.com/spreadsheets/d/1sMAlmWe6qIvSc21grnhqBrrOqv1NdFqyQ7YmMILKgtU/edit#gid=1387463060
exports.getMovie = async () => {
  const doc = new GoogleSpreadsheet(
    "1sMAlmWe6qIvSc21grnhqBrrOqv1NdFqyQ7YmMILKgtU"
  );
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[2];
  let rows = await promisify(sheet.getRows)();
  if (rows.length > 0) return rows[0];
  else return;
};

exports.postMeme = async meme => {
  const { name, link, description } = meme;
  const doc = new GoogleSpreadsheet(
    "1Jw7xVPkZKH2me8927RuCPQ4bQnFiiBufVQop-0nHUiQ"
  );
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[2];

  const row = {
    name,
    link,
    description
  };

  await promisify(sheet.addRow)(row);
};

exports.getMeme = async name => {
  const doc = new GoogleSpreadsheet(
    "1Jw7xVPkZKH2me8927RuCPQ4bQnFiiBufVQop-0nHUiQ"
  );
  await promisify(doc.useServiceAccountAuth)(creds);
  const info = await promisify(doc.getInfo)();
  const sheet = info.worksheets[2];
  let rows = await promisify(sheet.getRows)();
  const row = rows.filter(row => row.name === name)[0];
  return row;
};
