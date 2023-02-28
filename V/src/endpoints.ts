import { Endpoint, ProductDetail } from "./types";
import { asins } from "./main.js";
import { extractProductDetail, getOfferURL, extractOfferDetail, filterDuplicateOffers } from "./utils.js";

/** Should have used a reouter here, but I allready had this code written before checking the solution so, umm yeah... :D */
export const handleEndpoints = async (endpoint: Endpoint) => {
    switch (endpoint.context.request.userData.label) {
        case "START":
            await start(endpoint);
            break;
        case "PRODUCT":
            await product(endpoint);
            break;
        case "OFFER":
            await offer(endpoint);
            break;
    }
};

const start = async (e: Endpoint) => {
    const { request, enqueueLinks } = e.context;

    await enqueueLinks({
        selector: ".rush-component > .a-link-normal.s-no-outline",
        baseUrl: new URL(request.url).origin,
        userData: { label: "PRODUCT" },
    });
    return;
};

const product = async (e: Endpoint) => {
    const { $, request } = e.context;

    const productDetails = extractProductDetail(request, $, e.keyword);
    if (productDetails.asin === undefined) return;

    console.log("\nGETTING DETAILS FOR PRODUCT OF ASIN:", productDetails.asin);
    await e.crawler.addRequests([
        { url: getOfferURL(productDetails.asin), userData: { label: "OFFER", productDetail: productDetails } },
    ]);
};

const offer = async (e: Endpoint) => {
    const { $, request } = e.context;
    const { dataset } = e;

    console.log("\nGETTING OFFERS FOR PRODUCT OF URL:", request.url);

    const extractedOffers = extractOfferDetail(request, $);
    if (extractedOffers === undefined) return;
    const { sellers, offers } = extractedOffers;
    asins[request.userData.productDetail.asin] = sellers.length;

    const products: ProductDetail[] = [];
    for (let i = 0; i < sellers.length; i++) {
        const product = request.userData.productDetail as ProductDetail;
        product.sellerName = sellers[i];
        product.offer = offers[i];
        products.push({ ...product });
    }
    await dataset.pushData(filterDuplicateOffers(products));
};
