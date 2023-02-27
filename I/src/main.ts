import { Actor } from "apify";

await Actor.main(async () => {
    const input = (await Actor.getInput()) as any;
    if (input.datasetId === undefined) {
        throw new Error("The 'datasetId' input must be provided!");
    }
    const dataset = await Actor.openDataset(input.datasetId);
    const data = await dataset.getData();

    const asins = new Map();
    for (const item of data.items) {
        if (asins.has(item.asin)) {
            if (item.price < asins.get(item.asin).price) {
                asins.set(item.asin, item);
            }
        } else {
            asins.set(item.asin, item);
        }
    }

    const defaultDataset = await Actor.openDataset();
    await defaultDataset.pushData(Array.from(asins.values()));
});
