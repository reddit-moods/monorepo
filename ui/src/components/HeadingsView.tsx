import { Card, CardBody, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { ModelPrediction } from "./SubredditSentimentForm";

interface HeadingsPredictionPair {
  heading: string;
  prediction: ModelPrediction;
}
// Separates each pair into one of 3 buckets: positive, neutral, negative
function separateBySentiment(pairs: HeadingsPredictionPair[]) {
  const positive: HeadingsPredictionPair[] = [];
  const neutral: HeadingsPredictionPair[] = [];
  const negative: HeadingsPredictionPair[] = [];

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    switch (pair.prediction.label) {
      case "LABEL_0":
        negative.push(pair);
        break;

      case "LABEL_1":
        neutral.push(pair);
        break;

      case "LABEL_2":
        positive.push(pair);
        break;

      default:
        break;
    }
  }

  //   TODO CUSTOM SORT FUNCTION
  //   positive.sort(())

  return {
    positive,
    neutral,
    negative,
  };
}

function SentimentSection({
  sentimentHeader,
  pairs,
}: {
  sentimentHeader: string;
  pairs: HeadingsPredictionPair[];
}) {
  return (
    <>
      <Flex flexDir={"column"} gap={4}>
        <Text fontSize={"lg"} fontWeight={"bold"} textAlign={"center"}>
          {sentimentHeader}
        </Text>
        <Card h={"100%"} borderWidth={"thin"}>
          <CardBody>
            <Flex flexDir={"column"}>
              {pairs.map(({ heading, prediction }) => {
                return (
                  <>
                    <Flex flexDir={"row"} gap={4}>
                      <Text>{heading}</Text>
                      <Text>{prediction.score}</Text>
                    </Flex>
                  </>
                );
              })}
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </>
  );
}

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

  const { positive, neutral, negative } = separateBySentiment(headingsAndPred);

  return (
    <>
      {/* Render three separate scrollable cards for positive/neutral/negative */}
      {/* <Flex flexDir={"row"} gap={4} w={"100%"} justifyContent={"center"}> */}
      <SimpleGrid columns={3} gap={4} w={"100%"} my={4}>
        <SentimentSection
          sentimentHeader={"Positive"}
          pairs={positive}
        ></SentimentSection>
        <SentimentSection
          sentimentHeader={"Neutral"}
          pairs={neutral}
        ></SentimentSection>
        <SentimentSection
          sentimentHeader={"Negative"}
          pairs={negative}
        ></SentimentSection>
      </SimpleGrid>
      {/* </Flex> */}
    </>
  );
}
