import Head from 'next/head';
import Image from 'next/image';
import { Butcherman, Inter } from 'next/font/google';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Flex, Button, HStack, Link, Box, Heading, Text } from "@chakra-ui/react";

export default function Home({user}) {
  return (
    <>
      <Header user={user}/>
      <main>

        <Flex justifyContent={"space-around"}>
          <Flex p={"2rem"} flexDir={"column"} >
            <Heading fontSize={76}
              bgGradient='linear(to-l, #7928CA, #FF0080)'
              bgClip='text'
              fontWeight={"extrabold"}>New Era of Forms  </Heading>
            <Link href={user ? '/dashboard' : '/create-account'}>
              <Button alignSelf={"center"} marginTop={10}>
                Create form in seconds..
              </Button>

            </Link>
          </Flex>
          <Flex justifyContent={"center"} alignItems={"center"} minH={"60vh"} maxW={"40%"} marginRight={"10vh"}>
            <Image src={"https://ouch-cdn2.icons8.com/_7O56rtpozcHJobvJfPxAl9iVrdueR6OnVDu3IrEhYQ/rs:fit:368:211/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODUz/LzJiNGRkNTc1LTRj/ZTUtNDk3MC1iNmE4/LWIwNDNjMTY4Nzk3/MC5zdmc.png"}
              width={350} height={350} />
          </Flex>

        </Flex>

      </main>
    </>
  )
}