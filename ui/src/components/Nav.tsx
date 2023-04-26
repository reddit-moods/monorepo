import {
  Box,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import redditlogo from "../assets/reddit_logo.png";
import { BsGithub } from "react-icons/bs";
import Image from "next/image";

export default function NavBar() {
  return (
    <>
      <Box bg={"white"} px={4}>
        <Flex
          h={16}
          flexDir={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Flex alignItems={"center"} gap={2}>
            <Image src={redditlogo} alt="Reddit Moods logo" height={32}></Image>
            <Text>Reddit Moods</Text>
          </Flex>
          <Link
            as={NextLink}
            href={"https://github.com/reddit-moods/monorepo"}
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconButton
              icon={<BsGithub />}
              size={"lg"}
              bg={"transparent"}
              aria-label="Go to Reddit Moods GitHub"
            ></IconButton>
          </Link>
        </Flex>
      </Box>
    </>
  );
}
