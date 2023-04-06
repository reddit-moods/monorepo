# Design

## UI Design

The UI is a SPA that takes in a subreddit, calls an API request, and renders the sentiment based on the API response.

### MVP

The main components in the home page will be the `SubRedditInput`.

After it is inputted and validated, the page will go to `our-domain.com/r/subreddit`. Here, we will dynamically fetch the sentiment and render a different output based on that sentiment.

This will give us the flexibility to potentially render analytics for that subreddit as a separate page and cache responses.

### Other Features

- Cache sentiment analytics for subreddits
- Store sentiment calculations in a DB
- Dynamically calculate analytics for subreddits

## API Design

The API will consist of the following endpoints:

- GET `/api/health`
  - returns 200 if API is up
  - Anything else, and its down
  - Only implement this is not using Lambda
- GET `/api/sentiment?subreddit=SUBREDDIT_NAME_NOT_INCLUDING_THE_R_SLASH`
  - Calls the model to predict on the top 25 hottest Reddit posts
  - Returns 200 with sentiment:
    ```json
    {
      "sentiment": "neutral"
    }
    ```

### Deploy with Lambda

For our initial MVP, we can implement a basic version of this API with AWS Lambda and Hugging Face.

TBD

## Evaluation Pipeline

TODO
