# QUIZ

### 1. Actors have an option the Settings tab to Restart on error. Would you use this feature for regular actors? When would you use this feature?

No, I wouldn't. Ussually if an error comes up and it's not handled it's alreaddy too late, running the actor multiple times for no result would just waste our Actor compute units.

### 2. Migrations happen randomly, but by aborting gracefully, you can simulate a similar situation. Try this out on the platform and observe what happens. What changes occur, and what remains the same for the restarted actor's run?

Everything that is saved in the memory gets erased, hovewer everything on the disc is still there, including all default data storages.

### 3. Why don't you (usually) need to add any special migration handling code for a standard crawling/scraping actor? Are there any features in the Crawlee/Apify SDK that handle this under the hood?

Most stuff is alreaddy handeled by the Crawlee/Apify SDK. The only thing we have to do is possibly to save some runtime memory data if we have to.

### 4. How can you intercept the migration event? How much time do you have after this event happens and before the actor migrates?

By using the `Actor.on('migrating', () => {...})` function you can listen for the migration event. You will have only a few seconds though so GL.

### 5. When would you persist data to the default key-value store instead of to a named key-value store?

On regular actor runs since the data is tied to the actors run. Hovewer if you need to share data across multiple actors a named key-value store might be a better solution
