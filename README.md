# Airbnb Telegream Notifier

Scrapes a airbnb url for listings every 5 minutes and sends notifications about new listings to a telegram chat.

## Notifications

The notification contains the following information in a single text message

```
{
    url: string, // www.airbnb.de/rooms/123456789?...
    priceText: string // 176€ Night
}
```

There are also notifications about changed prices

## Enviroment varibables

| Name | description | type |
| - | - | - | 
| AIRBNB_URL | Airbnb url to scrape for available listings | url string |
| PROXY_USERNAME | Username of the proxy to use for scraping airbnb | string |
| PROXY_PASSWORD | Password of the proxy | string |
| PROXY_HOST | Proxy host | string |
| PROXY_PORT | Proxy port | number |
| TELEGRAM_API_KEY | Telegram bot api key for notifications | string |  
| TELEGRAM_TARGET_CHAT_ID | Telegram chat id to send notifications to | string |
| TELEGRAM_DEBUG_CHAT_ID | Telegram chat id to send debug notifications to | string |

## Usage

Nodejs needs to be installed

Check with 

```
node --version
```

Run with
```
npm run serve
```