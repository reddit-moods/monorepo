import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Flex,
  InputGroup,
  InputLeftElement,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import SentimentResult from "./SentimentResult";

interface FormValues {
  subreddit: string;
}

export type RobertaLabels = "LABEL_0" | "LABEL_1" | "LABEL_2";
export interface ModelPrediction {
  label: RobertaLabels;
  score: number;
}

export interface SentimentState {
  sentiment: "Negative" | "Neutral" | "Positive";
  confidence: number;
  headings: string[];
  predictions: ModelPrediction[];
}

export default function SubredditSentimentForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const [sentimentState, setSentimentState] = useState<
    SentimentState | undefined
  >(undefined);

  const toast = useToast();

  async function onSubmit(values: FormValues) {
    try {
      const API_URL =
        "https://28gsbggq1f.execute-api.us-east-1.amazonaws.com/prod";
      const resp = await fetch(
        API_URL +
          "?" +
          new URLSearchParams({
            subreddit: values.subreddit,
          }),
        {
          headers: {
            "content-type": "application/json",
          },
          method: "GET",
          mode: "cors",
        }
      );

      console.log("resp: ", resp);

      if (resp.status == 404) {
        // Error
        toast({
          title: `Could not access the subreddit ${values.subreddit}`,
          description: "It probably is private, banned, or does not exist.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      const respBody = (await resp.json()) as SentimentState;
      console.log(
        "sentiment: ",
        respBody.sentiment,
        "confidence: ",
        respBody.confidence,
        "headings: ",
        respBody.headings,
        "pred: ",
        respBody.predictions
      );

      const state: SentimentState = {
        sentiment: respBody.sentiment,
        confidence: respBody.confidence,
        headings: respBody.headings,
        predictions: respBody.predictions,
      };

      setSentimentState(state);
    } catch (e: any) {
      console.log("Unknown error occurred: ", e);
      if (e && e.message && e.message.includes("Failed to fetch")) {
        toast({
          title: "Oops! Our servers are down :(",
          description: "Sit tight and they'll be back up in no time!",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "top",
        });
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDir={"column"} minW={"50%"}>
          <FormControl isInvalid={errors.subreddit != undefined}>
            <Flex flexDir={"column"} gap={4}>
              <FormLabel
                htmlFor="subreddit"
                fontSize={"2xl"}
                fontWeight={600}
                textAlign={"center"}
                mb={0}
              >
                reddit moods
              </FormLabel>
              <Text w={"100%"} textAlign={"center"}>
                Get the current overall mood of a subreddit using AI!
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <p>r/</p>
                </InputLeftElement>
                <Input
                  id="subreddit"
                  placeholder="wallstreetbets"
                  {...register("subreddit", {
                    required: "Please specify a non-empty subreddit name.",
                    minLength: {
                      value: 1,
                      message: "Minimum length should be 4",
                    },
                  })}
                  bgColor={"lightgray"}
                  outline={"lightblue"}
                />
              </InputGroup>
              <FormErrorMessage>
                <>{errors.subreddit && errors.subreddit.message}</>
              </FormErrorMessage>
            </Flex>
          </FormControl>
          <Button
            mt={4}
            colorScheme="primary"
            isLoading={isSubmitting}
            type="submit"
          >
            Get Subreddit Mood
          </Button>
        </Flex>
      </form>
      <SentimentResult sentimentState={sentimentState}></SentimentResult>
    </>
  );
}
