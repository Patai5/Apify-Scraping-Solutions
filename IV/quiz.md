### 1. What is the relationship between the Apify API and Apify client? Are there any significant differences?

Apify client is just a wrapper around the Apify API. The client is always up to date and catches and handles errors.

### 2. How do you pass input when running actor or task via API?

The input is passed as the body of the request to the API.

### 3.Do you need to install the apify-client NPM package when already using the apify package?

No need to install an additional dependency as you can create a new client using the `Actor.newClient()` function from the `apify` package
