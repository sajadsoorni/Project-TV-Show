# Level 300

For level 300, you should switch back to your original codebase.

You should have merged someone else's level 200 implementation.

Once again, compare their implementation to yours. Think:
1. How is it different?
2. What do you prefer about your implementation?
3. What do you prefer about their implementation?
4. What did you learn that you didn't know before?

Have a discussion about your answers to these questions. In class, together, give a 3 minute talk about your conclusions.

## Refactoring

Like with level 200, feel free to change anything in your codebase which you think will make it easier to work with, or to build new features.

Have your partner review any changes you have, and make sure they understand them.

## Adding new functionality

Level 300 is about getting rid of our static data from `episodes.js`, and instead using an API.

### Requirements

1. You must delete the `episodes.js` file from your repository.
2. Your website must still work the same, but by using a `fetch` request to https://api.tvmaze.com/shows/82/episodes. This URL should serve the exact same content as was returned by `getAllEpisodes` in `episodes.js`.
3. You must fetch this URL only _once_ per visit to your website. You should not re-fetch when someone searches, scrolls, or selects an episode from the drop-down.
4. If you don't have data yet, you should show something to tell the user to wait for the data.
5. If an error occurred loading the data, notify the user.
  1. Note: real users don't look in the console - `console.log` or `console.error` are not sufficient for this requirement.
  2. You will need to simulate an error to test this out yourself.

### Documentation

You can see that this endpoint has been documented here: https://www.tvmaze.com/api#show-episode-list
