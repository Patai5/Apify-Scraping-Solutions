### 1. What are the different types of proxies that Apify proxy offers? What are the main differences between them?

1. Datacenter - fastest and most reliable, hovewer the most easily detectable one
2. Residential - not so fast and reliable, hovewer very hard to detect
3. Special - ie. Google Serp (google.com) - Speacial proxies used for certain websites

### 2. Which proxy groups do users get with the proxy trial? How long does the trial last?

All of them. There is no trial, only usage limits.

### 3. How can you prevent an error from occurring if one of the proxy groups that a user has is removed? What are the best practices for these scenarios?

Not having the value hardcoded in the code. Also using a proxy pool consisting of multiple working proxies.

### 4. Does it make sense to rotate proxies when you are logged into a website?

No, since the website can track your logged account and it will only scream more that yes I am a bot. Although you should rotate your proxies when logging in with multiple accounts at once.

### 5. Construct a proxy URL that will select proxies only from the US.

http://country-US:<username>:<password>@proxy.apify.com:8000

### 6. What do you need to do to rotate a proxy (one proxy usually has one IP)? How does this differ for CheerioCrawler and PuppeteerCrawler?

A proxy usually consists of multiple IPs that get rotated automatically. In a request based crawler like cheerio the proxies get easily rotated on every request. Puppeteer uses a running session for crawling through the page, therefore you have to use a new session for a new proxy.

### 7. Name a few different ways of how a website can prevent you from scraping it.

-   Captcha
-   IP blocking
-   Account blocking
-   Rate limiting
