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
} from "@chakra-ui/react";
import { useState } from "react";
import SentimentResult from "./SentimentResult";

interface FormValues {
  subreddit: string;
}

export interface SentimentState {
  sentiment: "Negative" | "Neutral" | "Positive";
  confidence: number;
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

  async function onSubmit(values: FormValues) {
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

    const respBody = (await resp.json()) as SentimentState;
    console.log(
      "sentiment: ",
      respBody.sentiment,
      "confidence: ",
      respBody.confidence
    );

    const state = {
      sentiment: respBody.sentiment,
      confidence: respBody.confidence,
    };

    setSentimentState(state);
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
