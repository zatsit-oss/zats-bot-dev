const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

const SPREADSHEET_ID = "1xQYm4YOZSab579Jhyax5P5eD4DI_zZyZkSS8AHEipME";
const SHEET_NAME = "Feuille 1";

const keyFilePath = path.join(__dirname, "../configs/dev/secret.json");

async function saveLinkToSheet(link, user, label) {
  const auth = await google.auth.getClient({
    keyFile: process.env.SERVEUR_NAME === "dev" ? keyFilePath : undefined,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const existingUrls = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:D`,
  });

  const urls = existingUrls.data.values ? existingUrls.data.values.flat() : [];

  if (urls.includes(link)) {
    return null;
  }

  const formattedDate = new Date().toLocaleDateString("fr-FR");

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    resource: {
      values: [[formattedDate, user, label, link]],
    },
  });

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    resource: {
      requests: [
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId: await getSheetId(sheets, SPREADSHEET_ID, SHEET_NAME),
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: 3,
            },
          },
        },
      ],
    },
  });
}

async function getSheetId(sheets, spreadsheetId, sheetName) {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
  });
  const sheet = spreadsheet.data.sheets.find(
    (s) => s.properties.title === sheetName
  );
  return sheet ? sheet.properties.sheetId : null;
}

module.exports = { saveLinkToSheet };
