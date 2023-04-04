import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";

interface FormValues {
  name: string;
}

interface SentimentState {
  sentiment: "Negative" | "Neutral" | "Positive";
  confidence: number;
}

export default function HookForm() {
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
          subreddit: values.name,
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
        <FormControl isInvalid={errors.name != undefined}>
          <FormLabel htmlFor="name">Subreddit</FormLabel>
          <Input
            id="name"
            placeholder="name"
            {...register("name", {
              required: "This is required",
              minLength: { value: 1, message: "Minimum length should be 4" },
            })}
          />
          <FormErrorMessage>
            <>{errors.name && errors.name.message}</>
          </FormErrorMessage>
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Submit
        </Button>
      </form>
      <div>
        {sentimentState ? (
          <>
            <p>Sentiment: {sentimentState.sentiment}</p>
            <p>Confidence: {sentimentState.confidence}</p>
          </>
        ) : (
          <>
            <p>Please submit a subreddit to get its current sentiment!</p>
          </>
        )}
      </div>
    </>
  );
}
