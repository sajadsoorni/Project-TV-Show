# Level 400

For level 400, you should work in the repo of your partner from level 200.

Before writing any new code, look at their level 300 implementation.

Compare their implementation to yours. Think:
1. How is it different?
2. What do you prefer about your implementation?
3. What do you prefer about their implementation?
4. What did you learn that you didn't know before?

They should do the same with your repository.

Have a discussion about your answers to these questions. In class, together you should give a 3 minute talk about your conclusions.

## Refactoring

Feel free to change anything in your codebase which you think will make it easier to work with, or to build new features.

Have your partner review any changes you have, and make sure they understand them.

## Adding new functionality

Level 400 is about expanding beyond one TV show.

Until now, your site has only showed information about the episode of one TV show.

But TVmaze has information about lots of TV shows, all in the same format.

We want to display any of them.

### Requirements

1. Add a `select` element to your page so the user can choose a show.
2. When the user first loads the page, make a `fetch` request to https://api.tvmaze.com/shows ([documentation](https://www.tvmaze.com/api#show-index)) to get a list of available shows, and add an entry to the drop-down per show.
3. When a user selects a show, display the episodes for that show, just like the earlier levels of this project.

  You will need to perform a `fetch` to get the episode list.
4. Make sure that your search and episode selector controls still work correctly when you change shows.
5. Your select must list shows in alphabetical order, case-insensitive.
6. During one user's visit to your website, you should never fetch any URL more than once.

> [!NOTE]  
> Be _careful_ when developing with fetch. By default, every time you make a small change to your app it will be restarted by live server - if you are fetching JSON on page load, the JSON will be downloaded again and again. These frequent HTTP requests may lead to the API permanently banning your IP address from further requests, or "throttling" it for some time. Worse, if they don't, they may cause performance issues for the API service we are using.

#### Screenshot of minimal version

Note: Provided your project meets the above requirements, it can **look** however you want.

Here is one example layout.

![Screenshot of a website with a drop-down list with the show "Breaking Bad" selected](example-screenshots/example-level-400-1.jpg)

![Screenshot of a website with a drop-down list showing multiple TV shows](example-screenshots/example-level-400-1.jpg)
