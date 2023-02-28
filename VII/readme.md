# QUIZ

### 1. Why might you want to store statistics about an actor's run (or a specific request)?

-   Debugging purposses
-   Tracking purposses
-   Logging progress of the run

### 2. In our Amazon scraper, we are trying to store the number of retries of a request once its data is pushed to the dataset. Where would you get this information? Where would you store it?

We can get it from the request it self as `request.retryCount`. In the assignment we are supposed to put it under the object in the default storage, hovewer I would put it under the default key-value storage under key of `RETRIED-REQUESTS` and store the failed url + the amount of retried requests.

### 3. We are building a new imaginary scraper for a website that sometimes displays captchas at unexpected times, rather than displaying the content we want. How would you keep a count of the total number of captchas hit for the entire run? Where would you store this data? Why?

First of all we would have to detect a captcha but afterwards just update some shared variable with the count of appearances. For storage I would use the default key-value storage and store it under key of `CAPTCHAS-HIT-COUNT`.

### 4. Is storing these types of values necessary for every single actor?

No, it's never necessary, hovewer especially for larger actors this data might come very handy for debugging purposes, which in such large actors might otherwise take a very long time.

### 5. What is the difference between the failedRequestHandler and errorHandler?

-   `failedRequestHandler` function gets called once a requests fails more than the `option.maxRequestRetries` times.
-   `errorHandler` function gets called before each retry for requests with less than `option.maxRequestRetries` times.
