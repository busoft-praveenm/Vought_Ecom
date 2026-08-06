import * as admin from "firebase-admin";
import * as fs from 'fs';
import * as path from 'path';

let serviceAccount: admin.ServiceAccount | undefined;

try {
  const accountPath = path.resolve(__dirname, "../../firebase-service-account.json");
  if (fs.existsSync(accountPath)) {
    serviceAccount = JSON.parse(fs.readFileSync(accountPath, 'utf8'));
  }
} catch (error) {
  console.warn("Could not load Firebase service account credentials locally", error);
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // If running in production or docker without the file, it will rely on default GOOGLE_APPLICATION_CREDENTIALS
    admin.initializeApp();
  }
}

export default admin;