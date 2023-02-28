import { CheerioCrawler } from "crawlee";
import { handleEndpoints } from "./endpoints.js";
import { Actor } from "apify";
import { Endpoint, ProductDetail, Stats } from "./types";

interface Input {
    keyword?: string;
    proxies?: string[];
}

export let asins: { [asin: string]: number };
export let stats: Stats;

Actor.main(async () => {
    Actor.on("migrating", () => {
        Actor.setValue("ASINS", asins);
        Actor.setValue("STATS", stats);
    });
    asins = (await Actor.getValue("ASINS")) || {};
    stats = (await Actor.getValue("STATS")) || { errors: {}, totalSaved: 0 };
    setInterval(function () {
        console.log("ASINS:", asins);
        console.log("STATS:", stats);
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
        errorHandler: async (context, error) => {
            if (stats.errors[context.request.url] === undefined) stats.errors[context.request.url] = [];
            stats.errors[context.request.url].push(error.message);
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
    await Actor.setValue("STATS", stats);
});
