import { CheerioCrawler } from "crawlee";
import { handleEndpoints } from "./endpoints.js";
import { Endpoint } from "./types";
import { Actor } from "apify";
import { ProductDetail } from "./types";

interface Input {
    keyword?: string;
    proxies?: string[];
}

export let asins: { [asin: string]: number };

Actor.main(async () => {
    Actor.on("migrating", () => {
        Actor.setValue("ASINS", asins);
    });
    asins = (await Actor.getValue("ASINS")) || {};
    setInterval(function () {
        console.log("ASINS:", asins);
    }, 10 * 1000);

    const input: Input = (await Actor.getInput()) as any;
    if (input === null) throw new Error("Missing input");
    if (input.keyword === undefined) {
        throw new Error("Missing expected input keyword");
    }
    if (input.proxies === undefined) {
        throw new Error("Missing expected input proxies");
    }
    const KEYWORD = input.keyword;

    const dataset = await Actor.openDataset();

    const proxyConfiguration = await Actor.createProxyConfiguration({
        groups: input.proxies,
    });

    const crawler = new CheerioCrawler({
        requestHandler: async (context) => {
            await handleEndpoints({ keyword: KEYWORD, crawler, context, dataset } as Endpoint);
        },
        proxyConfiguration: proxyConfiguration,
        useSessionPool: true,
        sessionPoolOptions: {
            maxPoolSize: 25,
            sessionOptions: {
                maxUsageCount: 5,
                maxErrorScore: 1,
            },
            persistStateKeyValueStoreId: "amazon-scraper-session-pool",
            persistStateKey: "session-pool",
        },
    });

    await crawler.addRequests([
        {
            url: "https://www.amazon.com/s?k=" + KEYWORD + "&ref=nb_sb_noss",
            userData: {
                label: "START",
            },
        },
    ]);
    await crawler.run();

    const { items }: { items: ProductDetail[] } = (await dataset.getData()) as any;
    let cheapest = items[0];
    for (const item of items) {
        const itemPrice = parseFloat(item.offer!.replace("$", ""));
        const cheapestPrice = parseFloat(cheapest.offer!.replace("$", ""));
        if (itemPrice < cheapestPrice) cheapest = item;
    }
    await Actor.setValue("CHEAPEST-ITEM", cheapest);
});
