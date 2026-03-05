function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('links')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('links');
  const rows = sheet.getDataRange().getValues();
  const links = rows.slice(1).map(r => ({
    id: r[0], title: r[1], url: r[2], category: r[3], createdAt: r[4]
  })).filter(l => l.id);
  return ContentService.createTextOutput(JSON.stringify(links))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('links')
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet('links');
  const payload = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id', 'title', 'url', 'category', 'createdAt']);
  }

  if (payload.action === 'add') {
    const l = payload.link;
    sheet.appendRow([l.id, l.title, l.url, l.category, l.createdAt]);
  } else if (payload.action === 'delete') {
    const data = sheet.getDataRange().getValues();
    for (let i = data.length - 1; i >= 1; i--) {
      if (data[i][0] === payload.id) { sheet.deleteRow(i + 1); break; }
    }
  } else if (payload.action === 'update') {
    const l = payload.link;
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === l.id) {
        sheet.getRange(i + 1, 2).setValue(l.title);
        sheet.getRange(i + 1, 3).setValue(l.url);
        break;
      }
    }
  }
  return ContentService.createTextOutput('ok');
}
