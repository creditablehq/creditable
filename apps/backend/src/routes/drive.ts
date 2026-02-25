import { Router } from 'express';
import * as fs from 'fs';
import { google } from 'googleapis';

const router = Router() as Router;
import multer from 'multer';

const GOOGLE_SERVICE_ACCOUNT_JSON =
  process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

export const drive = google.drive({
  version: 'v3',
  auth,
});

const upload = multer({ dest: 'uploads/' });

interface MulterRequest extends Request {
  file: Express.Multer.File;
}

router.post('/upload', upload.single('file'), async (req: any, res: any) => {
  const fileReq = req as MulterRequest;

  if (!fileReq.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    console.log(process.env.GOOGLE_DRIVE_FOLDER_ID);
    const fileMetadata = {
      name: fileReq.file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    };

    const media = {
      mimeType: fileReq.file.mimetype,
      body: fs.createReadStream(fileReq.file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id',
      supportsAllDrives: true,
    });

    fs.unlinkSync(fileReq.file.path);

    return res.json({ fileId: response.data.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
