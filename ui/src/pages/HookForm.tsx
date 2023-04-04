import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";

interface FormValues {
  name: string;
}

export default function HookForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit(values: FormValues) {
    // return new Promise<void>((resolve) => {
    //   setTimeout(() => {
    //     alert(JSON.stringify(values, null, 2));
    //     resolve();
    //   }, 3000);
    // });
    console.log("values: ", values);
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
          mode: "no-cors",
        },
        method: "GET",
      }
    );
    console.log("resp: ", resp);
  }

  return (
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
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  );
}
