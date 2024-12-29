# TV Show Project

One of the most powerful things a software engineer can do is take some data and make it easy for people to understand.

The aim of this project is to take some data someone else has (and exposes over an API), and display it to users. The data we're using for this project is about episodes of TV shows.

This project will take you multiple weeks to complete. As always, we will break down the project into levels we can deliver incrementally. You must finish each milestone before you start working on the next one (but it's ok to know what the future levels are going to be - it may help you design things). Your goal is to complete all of the levels up to and including level 500 during the Data Flows module.

## Data

The data we're going to use comes from a website called TVmaze. For the first few levels, you can call a function `getAllEpisodes()` and you will get an array of objects, one per episode of a TV show. Later on, you will use `fetch` to get the data dynamically from the API. Here is an example object for one episode:

```js
{
    id: 4952,
    url: "http://www.tvmaze.com/episodes/4952/game-of-thrones-1x01-winter-is-coming",
    name: "Winter is Coming",
    season: 1,
    number: 1,
    airdate: "2011-04-17",
    airtime: "21:00",
    airstamp: "2011-04-18T01:00:00+00:00",
    runtime: 60,
    image: {
        medium: "http://static.tvmaze.com/uploads/images/medium_landscape/1/2668.jpg",
        original: "http://static.tvmaze.com/uploads/images/original_untouched/1/2668.jpg"
    },
    summary:
        "<p>Lord Eddard Stark, ruler of the North, is summoned to court by his old friend, King Robert Baratheon, to serve as the King's Hand. Eddard reluctantly agrees after learning of a possible threat to the King's life. Eddard's bastard son Jon Snow must make a painful decision about his own future, while in the distant east Viserys Targaryen plots to reclaim his father's throne, usurped by Robert, by selling his sister in marriage.</p>",
    _links: {
        self: {
            href: "http://api.tvmaze.com/episodes/4952"
        }
    }
}
```

## Rules

### Your website must be accessible and use semantic HTML

As always, your application must score 100 for Accessibility on Lighthouse.

### Don't change `getAllEpisodes()`

Because we're just using this `getAllEpisodes()` function as a placeholder until we use `fetch`, and we can't change what data will be returned to us from the `fetch`, you shouldn't change the implementation of `getAllEpisodes()`.

### Use tech that we've learnt

You should use the DOM-manipulation functions you've been learning about on the course - the point of this project is to practice.

You should not use React, Vue, JQuery, or any other libraries or frameworks for this project. You can rebuild it in React later if you want!

### Functionality before style

Your goal of this project is to achieve the levels, all of which are about functionality. When you have completed level 500, you can spend some time making it look beautiful. But focus on the functionality first.

Remember: it's important that software works and that people can use it.

## Get started

Each level has a .md file in the [`levels`](./levels) folder. Start with level 0, then complete level 100.

After that, you're going to swap codebases with someone else. You should complete level 200 in their repository, not your own. Every level, you'll swap back - so you'll do level 300 in your own codebase, level 400 in theirs, etc.

You are allowed to change anything in your partner's code to make it easier to understand or build on, but they must understand and accept your changes.

Remember, finish each level before you move on to the next. Reach out for help when you're stuck.
