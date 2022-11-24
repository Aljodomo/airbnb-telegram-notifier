import axios from "axios";

export function sendUpdatedListingMessage(url: string, priceTextOld: string, priceTextNew: string): void {
    const text = `Neuer Preis für Wohnung im Suchgebiet.\n\n${url}\n\nAlter Preis:\n${priceTextOld}\n\nNeuer Preis:\n${priceTextNew}`;
    sendMessage(process.env.TELEGRAM_TARGET_CHAT_ID!, text);
}

export function sendNewListingMessage(url: string, priceText: string): void {
    const text = `Neue Wohnung im Suchgebiet.\n\n${url}\n\nPreis:\n${priceText}`;
    sendMessage(process.env.TELEGRAM_TARGET_CHAT_ID!, text);
}

export function sendDebugLog(text: string): void {
    sendMessage(process.env.TELEGRAM_DEBUG_CHAT_ID!, text);
}

export async function sendMessage(chatId: string, text: string): Promise<void> {
    const botApiKey = process.env.TELEGRAM_API_KEY;
    const sendMessageUrl = `https://api.telegram.org/bot${botApiKey}/sendMessage`;
    const body = { "chat_id": chatId, "text": text }
    axios
        .post(sendMessageUrl, body)
        .then((res) => {
            console.log(`Telegram /sendMessage response statusCode: ${res.status}`);
        })
        .catch((error) => {
            console.error(error);
        });
}