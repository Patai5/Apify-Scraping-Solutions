# QUIZ

### 1. How do you allocate more CPU for an actor's run?

By inputing more memory into the actors options. The amount of memory is directly proportional to the CPU power (4096 MB = 1 CPU core)

### 2. Within itself, can you get the exact time that an actor was started?

Yes, by getting it from environment (which you get by calling `Actor.getEnv()`) from which you can get the value at atribute `ApifyEnv.startedAt`

### 3. What are the types of default storages connected to an actor's run?

1. Dataset: _(any valid JSON data)_
2. Key-value store: _(any valid JSON data stored under key values)_
3. Request queue: _(stored queue of requests yet to be made by crawlee)_

### 4. Can you change the allocated memory of an actor while it's running?

No, it's has to be specified before it's started. Although you are able to "abort gracefully" the actor's run and change the memory parameter and then ressurect the run, still counting as one run.

### 5. How can you run an actor with Puppeteer on the Apify platform with headless mode set to false?

Yes, by using the _'Browser+TypeScript'_ Dockerfile ie. https://docs.apify.com/sdk/js/docs/guides/docker-images#example-dockerfile. Afterwards you can set `launchOptions: {headless: false}` to launch a headful browser.
