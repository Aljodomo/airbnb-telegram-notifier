import * as puppeteer from 'puppeteer';
import * as proxyChain from "proxy-chain";
import { Listing } from './listing';
import { sendDebugLog } from './telegram';

export async function scrape(): Promise<Listing[]> {

    const username = process.env.PROXY_USERNAME!;
    const password = process.env.PROXY_PASSWORD!;
    const host = process.env.PROXY_HOST!;
    const port = process.env.PROXY_PORT!;
    const proxyUrl = `http://${username}:${password}@${host}:${port}/`;
    const anoProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);

    const browser = await puppeteer.launch({
        headless: true,
        timeout: 20000,
        ignoreHTTPSErrors: true,
        slowMo: 0,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--window-size=1280,720',
            `--proxy-server=${anoProxyUrl}`
        ],
    });

    var result: Listing[] = [];
    try {
        const page = await browser.newPage();

        await page.authenticate({
            username,
            password
        });

        await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

        await page.setViewport({ width: 1280, height: 720 });

        await page.setRequestInterception(true);

        page.on('request', (interceptedRequest: any) => {
            const blockResources = ['image', 'media', 'font'];
            if (blockResources.includes(interceptedRequest.resourceType())) {
                interceptedRequest.abort();
            } else {
                interceptedRequest.continue();
            }
        });


        await page.goto(process.env.AIRBNB_URL!,
            {
                waitUntil: 'networkidle0',
            }
        );

        const curPageTitle = await page.title();
        console.log("Loaded page with title : " + curPageTitle);
        if(curPageTitle.toLowerCase().includes("denied") || !curPageTitle.toLowerCase().includes("airbnb")) {
            sendDebugLog("Sus page title\n\n" + curPageTitle);
        }

        result = await page.$$eval(".c4mnd7m", (listings: any) => {
            return listings.map((listing: any) => {
                const link = listing.querySelector('meta[itemprop="url"]')?.getAttribute("content")!;
                const priceLabel = listing.querySelector("._14y1gc > .a8jt5op")?.textContent!;

                return {
                    url: link,
                    priceText: priceLabel
                }
            });
        });

        console.log(`Scraping completed with ${result.length} results`);
    } catch (error) {
        console.log(error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }

    return result;
};