function doPost(e) {
  try {
    const folder = DriveApp.getFolderById("https://drive.google.com/drive/folders/10JnKweOLG4mae_IBgdcJK6y8LJOqmPJ6?usp=sharing");

    const base64 = e.parameters.file;
    const fileName = e.parameters.filename || "upload.png";
    const mimeType = e.parameters.mimetype || MimeType.PNG;

    const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, fileName);

    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService
      .createTextOutput(JSON.stringify({ fileUrl: file.getUrl() }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

  