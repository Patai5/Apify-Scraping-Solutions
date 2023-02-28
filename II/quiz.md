### 1. Do you have to rebuild an actor each time the source code is changed?

Yes, but fortunetly it's really easy and can even be completely automated with integrations like GitHub.

### 2. In Git, what is the difference between pushing changes and making a pull request?

When you push a change into a remote repository it gets updated directly with no questions asked. A pull request on the other hand has to be reviewed usually by someone more senior in the repository, who decides whether to make it a successful change.

### 3. Based on your knowledge and experience, is the apify push command worth using (in your opinion)?

Absolutely, but solely for making quick developement testing changes. For a production actor this shouldn't be used and you should consider using other alternatives like GitHub.
