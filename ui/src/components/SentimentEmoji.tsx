export default function SentimentEmoji({
  sentiment,
}: {
  sentiment: "Positive" | "Neutral" | "Negative";
}) {
  if (sentiment == "Positive") {
    return (
      <>
        <h1>THis shit is positive</h1>
      </>
    );
  }
  if (sentiment == "Neutral") {
    return (
      <>
        <h1>THis shit is neutral</h1>
      </>
    );
  }
  return (
    <>
      <h1>THis shit is negative</h1>
    </>
  );
}
