import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs';

// Helper to get authenticated doc
export async function getAuthenticatedDoc() {
    // 1. Load credentials
    // Note: User's specific path
    const KEY_PATH = path.join(process.cwd(), 'database', 'service_account.json.json');
    
    // Check if file exists
    if (!fs.existsSync(KEY_PATH)) {
        throw new Error(`Service account key not found at: ${KEY_PATH}`);
    }

    const rawCreds = fs.readFileSync(KEY_PATH, 'utf-8');
    const creds = JSON.parse(rawCreds);

    // 2. Initialize Auth
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive.file',
        ],
    });

    // 3. Initialize Doc
    // Hardcoded Sheet ID from verification
    const SHEET_ID = "1sVMHbe4NfOpJGCPV2hGInzzrcWXixgKe6BH30TraOzE";

    const doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
}

export async function appendToSheet(data: Record<string, string | number | boolean>) {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByIndex[0]; // Access the first sheet
    
    // Check if headers are set
    await sheet.loadHeaderRow(); // Ensure headers are loaded
    
    const headers = ["Full Name", "Email", "Password", "Date"];
    
    // Check if existing headers match our expectation. 
    // If the first header isn't "Full Name", we assume the sheet is wrong/old/garbage and fix it.
    const currentHeaders = sheet.headerValues;
    if (!currentHeaders || currentHeaders.length === 0 || currentHeaders[0] !== "Full Name") {
        console.log("Headers mismatch or missing. Setting correct headers...");
        await sheet.setHeaderRow(headers);
    }

    await sheet.addRow(data);
}
