import CryptoJS from "crypto-js";

// Encryption key (ensure this is kept secure and not hard-coded in production)
const SECRET_KEY = "your_secret_key_here";

export const encryptData = (data: any): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): any => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
