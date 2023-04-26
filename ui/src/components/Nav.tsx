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
//import Image from "next/image";
import { Image } from '@chakra-ui/react'

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
          <Flex alignItems={"center"} gap={2}>
            <Image src={"https://www.redditinc.com/assets/images/site/reddit-logo.png"} alt = "Reddit Moods logo" boxSize={"32px"}></Image>
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
              size="lg"
              aria-label="Go to Reddit Moods GitHub"
            ></IconButton>
          </Link>
        </Flex>
      </Box>
    </>
  );
}
