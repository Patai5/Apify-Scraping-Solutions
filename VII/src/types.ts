import { CheerioCrawlingContext, CheerioCrawler, Dictionary } from "crawlee";
import { Dataset } from "apify";

export type Stats = { errors: { [error: string]: string[] }; totalSaved: number };

export type Endpoint = {
    keyword: string;
    crawler: CheerioCrawler;
    context: CheerioCrawlingContext<any, any>;
    dataset: Dataset<Dictionary>;
};

export type ProductDetail = {
    title: string;
    asin: string;
    itemUrl: string;
    description: string;
    keyword: string;
    sellerName?: string;
    offer?: string;
    dateHandled?: string;
    numberOfRetries?: number;
    currentPendingRequests?: number;
};
