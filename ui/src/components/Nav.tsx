import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsGithub } from "react-icons/bs";

export default function NavBar() {
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex
          h={16}
          flexDir={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text>reddit moods</Text>
          <Link
            as={NextLink}
            href={"https://github.com/reddit-moods/monorepo"}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconButton
              icon={<BsGithub />}
              size="lg"
              aria-label="Go to Reddit Moods GitHub"
            ></IconButton>
          </Link>
        </Flex>
      </Box>
    </>
  );
}
