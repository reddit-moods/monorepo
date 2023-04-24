export default function SentimentEmoji({
  sentiment,
}: {
  sentiment: "Positive" | "Neutral" | "Negative";
}) {
  if (sentiment == "Positive") {
    return (
      <>
        <h1>Sentiment Result: POSITIVE</h1>
      </>
    );
  }
  if (sentiment == "Neutral") {
    return (
      <>
        <h1>Sentiment Result: NEUTRAL</h1>
      </>
    );
  }
  return (
    <>
      <h1>Sentiment Result: NEGATIVE</h1>
    </>
  );
}
