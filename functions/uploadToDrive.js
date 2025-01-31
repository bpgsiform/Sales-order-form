const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS), // Read from environment variable
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = {
      name: 'invoice.pdf',
      parents: ['1duVia6LZPGsESJiiYoHopyRiV5ypRm8-'], // Replace with your Google Drive folder ID
    };
    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream('/tmp/invoice.pdf'),
    };

    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ fileId: res.data.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
