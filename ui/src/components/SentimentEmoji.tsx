export default function SentimentEmoji({
  sentiment,
}: {
  sentiment: "Positive" | "Neutral" | "Negative";
}) {
  if (sentiment == "Positive") {
    return (
      <>
        <h1>Positive</h1>
      </>
    );
  }
  if (sentiment == "Neutral") {
    return (
      <>
        <h1>Neutral</h1>
      </>
    );
  }
  return (
    <>
      <h1>Negative</h1>
    </>
  );
}
