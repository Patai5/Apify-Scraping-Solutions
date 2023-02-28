import { CheerioAPI } from "cheerio";
import { ProductDetail } from "./types";

export const extractProductDetail = (request: any, $: CheerioAPI, keyword: string) => {
    const title = $("#productTitle").first().text().trim();
    const asin = $("#ASIN").val() as string;
    const itemUrl = request.url;
    const description = $("#productDescription > p > span").text();

    const item: ProductDetail = {
        title,
        asin,
        itemUrl,
        description,
        keyword,
        sellerName: undefined,
        offer: undefined,
    };
    return item;
};

export const extractOfferDetail = (request: any, $: CheerioAPI) => {
    const sellers = $("#aod-offer-soldBy").map((_i, el) => {
        return $("div > div > div:nth-child(2) > *", el).first().text();
    });
    const offers = $(".a-offscreen").map((_i, el) => {
        return $(el).text();
    });
    if (sellers.length !== offers.length) {
        console.log("Sellers and offers are not equal for product:", request.url);
        return;
    }
    return { sellers, offers };
};

export const filterDuplicateOffers = (offers: ProductDetail[]) => {
    const filteredOffers: ProductDetail[] = [];
    // O(n^2) but n is small so it's fine
    for (const offer of offers) {
        let isDuplicate = false;
        for (const filteredOffer of filteredOffers) {
            if (filteredOffer.offer === offer.offer && filteredOffer.sellerName === offer.sellerName) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) filteredOffers.push(offer);
    }
    return filteredOffers;
};

export const getOfferURL = (asin: string) => {
    return `https://www.amazon.com/gp/product/ajax/ref=dp_aod_ALL_mbc?asin=${asin}&experienceId=aodAjaxMain`;
};
