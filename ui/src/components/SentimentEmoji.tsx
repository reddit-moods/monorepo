export default function SentimentEmoji({
  sentiment,
}: {
  sentiment: "Positive" | "Neutral" | "Negative";
}) {
  if (sentiment == "Positive") {
    return (
      <>
        <h1>This subreddit is positive</h1>
      </>
    );
  }
  if (sentiment == "Neutral") {
    return (
      <>
        <h1>This subreddit is neutral</h1>
      </>
    );
  }
  return (
    <>
      <h1>This subreddit is negative</h1>
    </>
  );
}
