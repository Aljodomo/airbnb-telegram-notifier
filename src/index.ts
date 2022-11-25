
import { scrape } from "./airbnb";
import { sendDebugLog, sendNewListingMessage, sendUpdatedListingMessage } from "./telegram";
import { Listing } from "./listing";
import { cutGroup1 } from "./regex";
import * as dotenv from "dotenv";

dotenv.config();

const INTERVAL_TIME = 1000 * 60 * 2; // every 2 minutes
// const INTERVAL_TIME = 1000 * 10;

const store: Map<string, Listing> = new Map();

async function run() {
  const listings: Listing[] = await scrape();

  const currentlyPresentListingIds = new Set();

  listings.forEach((currentListing) => {
    const id: string | null = cutGroup1("\/rooms\/([0-9]+)\?", currentListing.url);

    if(!id) {
      console.error("Could not get id");
      console.error(currentListing);
      return;
    }

    currentlyPresentListingIds.add(id);

    if (store.has(id)) {
      const storedListing: Listing = store.get(id)!;

      if (storedListing.priceText !== currentListing.priceText) {
        sendUpdatedListingMessage(storedListing.url, storedListing.priceText, currentListing.priceText);
        store.set(id, currentListing);
        console.log("Listing updated with id " + id);
      } else {
        console.log("No new listings found");
      }
    } else {
      sendNewListingMessage(currentListing.url, currentListing.priceText);
      store.set(id, currentListing);
      console.log("New listings found with id: " + id);
    }
  });

  // Delete if not present anymore

  const storeIds = store.keys;
  for(let id in storeIds) {
    if(!currentlyPresentListingIds.has(id)) {
      store.delete(id);
    }
  }

  console.log(store);
  
}

setInterval(() => sendDebugLog("I am alive - " + Date.now().toString()), 1000 * 60 * 60 * 24)

run();
setInterval(() => run(), INTERVAL_TIME);