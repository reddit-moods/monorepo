import { ModelPrediction } from "./SubredditSentimentForm";

export default function HeadingsView({
  headings,
  predictions,
}: {
  headings: string[];
  predictions: ModelPrediction[];
}) {
  const headingsAndPred = headings.map(function (heading: string, i: number) {
    return {
      heading,
      prediction: predictions[i],
    };
  });
  return (
    <>
      {/* Render three separate scrollable cards for positive/neutral/negative */}
      {headingsAndPred.forEach(({ heading, prediction }) => {
        return (
          <>
            <SentimentRow
              heading={heading}
              prediction={prediction}
            ></SentimentRow>
          </>
        );
      })}
    </>
  );
}
