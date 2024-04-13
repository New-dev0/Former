import Head from 'next/head';
import Image from 'next/image';
import { Butcherman, Inter, Ultra } from 'next/font/google';
import Header from '@/components/header';
// import Footer from '@/components/footer';

import {
  Flex, Button, HStack, Link, Box, Heading, Text, Card, CardBody,
  Badge, VStack,
  CardHeader,
  useMediaQuery
} from "@chakra-ui/react";
import { Abel, Roboto } from 'next/font/google';

const inter = Roboto({
  weight: "900",
  subsets: ["latin"]
})

const AbelFont = Abel({
  weight: "400",
  subsets: ["latin"],
})


export default function Home({ user }) {
  const [isMobile] = useMediaQuery("(max-width: 480px)");

  return (
    <>
      <Header user={user} />
      <main>
        <Flex justifyContent={"space-around"}
          alignItems={isMobile ? "center" : null}
          flexDir={isMobile ? "column" : null}
        >
          <Flex p={isMobile ? "0px" : "2rem"} flexDir={"column"} >
            <Heading fontSize={isMobile ? 55 : 76}
              bgGradient='linear(to-l, #7928CA, #FF0080)'
              bgClip='text'
              fontWeight={"extrabold"}>New Era of Forms  </Heading>

            <Box marginLeft={5} mt={5} mb={2} px={3}
              py={7}
              backgroundColor={"rgba(46, 46, 93, 0.11)"}
              borderRadius={20}>
              <ul style={{ marginTop: 3 }}>
                <li >
                  <HStack>
                    <Image src="https://img.icons8.com/?size=48&id=18944&format=png"
                      height={20} width={30} />

                    <Text color={"white"} fontSize={30} className={AbelFont.className}
                      flexDir={"row"} display={"flex"}>
                      Create forms with ease!
                    </Text>

                  </HStack>
                  <HStack mt={isMobile ? 3 : 0}>
                    <Image src="https://img.icons8.com/?size=48&id=18944&format=png"
                      height={20} width={30} />

                    <Text color={"white"} fontSize={30} className={AbelFont.className}
                      flexDir={"row"} display={"flex"}>
                      Seamless Integration
                    </Text>

                  </HStack>
                  <HStack mt={isMobile ? 3 : 0}>
                    <Image src="https://img.icons8.com/?size=48&id=18944&format=png"
                      height={20} width={30} />

                    <Text color={"white"} fontSize={30} className={AbelFont.className}
                      flexDir={"row"} display={"flex"}>
                      Made for Businesses to expand their reach
                    </Text>

                  </HStack>

                </li>
              </ul>

            </Box>
            <Flex justifyContent={isMobile ? "center" : null}>
              <Link href={user ? '/dashboard' : '/create-account'}>
                <Button alignSelf={"center"} marginTop={10} size={"lg"}>
                  Create form in seconds..
                </Button>
              </Link>
            </Flex>
            {/* <Box color={"black"} borderRadius={10} padding={1}
              width={"min-content"}
              minW={"40vh"}
              marginTop={5}
              px={3}
            //              textAlign={"center"}
            //              borderStyle={"solid"}
            //            borderColor={"white"}
            //</Flex>          borderWidth={0.1}
            >
              <Badge py={0.5} colorScheme={"purple"} px={2}>
                Upcoming: Create forms with AI
              </Badge>
            </Box> */}
          </Flex>
          {!isMobile && <Flex justifyContent={"center"} alignItems={"center"} minH={"60vh"} maxW={"40%"} marginRight={"10vh"}>
            <Image
              src={
                "https://ouch-cdn2.icons8.com/fljv3MNCPLwIDs-QDQQSeCLHBBK-grNV4hXus4pDlLQ/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTk2/L2JiNGZhNDkyLTUz/NDUtNDhkMS1hZmVk/LTQ1YWM5YzMzNTgx/ZS5zdmc.png"
                //"https://ouch-cdn2.icons8.com/_7O56rtpozcHJobvJfPxAl9iVrdueR6OnVDu3IrEhYQ/rs:fit:368:211/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvODUz/LzJiNGRkNTc1LTRj/ZTUtNDk3MC1iNmE4/LWIwNDNjMTY4Nzk3/MC5zdmc.png"
              }
              width={350} height={350} />
          </Flex>}
        </Flex>
      </main>
      <Box minH={"100vh"}
        //              bgGradient={"linear(to-r, red, pink)"}
        px={isMobile ? 0 : 3} py={3}
        backgroundColor={"#e3e8e7"}
        display={"flex"}
        pt={8}
        flexDir={"column"}
        alignItems={"center"}
      >
        <Heading textAlign={"center"}
        >Why Former?</Heading>
        <div style={{
          marginTop: 5,
          borderBottomColor: "black",
          borderStyle: "dashed",
          borderBottomWidth: 1,
          height: 0.5,
          width: "10%",
        }} />
        <Flex
          mt={8}
          flexDir={"column"}
          gap={8}
          width={"-moz-max-content"}
          minW={"80%"}
          alignItems={"center"}>

          <Card width={isMobile ? "98%" : "50%"}
            backgroundColor={"white"}
            borderWidth={1}
            boxShadow="rgba(17, 17, 26, 0.1) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 48px"
            borderColor={"black"}>
            <CardBody gap={3} display={"flex"} flexDir={"column"}>
              <HStack>
                <Image width={60} height={60} src={"https://ouch-cdn2.icons8.com/mNp6JKF-PmGhmDkAN3Qqnk23F9G2I91Zh7DzHROJHfU/rs:fit:368:332/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTc5/LzljZmY1YWJlLTlh/ZGQtNGM0YS1hOTNm/LTJmZmVkMzA1ZmQ4/Zi5zdmc.png"} />
                <VStack marginLeft={4} display={"flex"} alignItems={"start"}>
                  <Heading size={"md"} >
                    Completely free!
                  </Heading>
                  <Text>
                    Former is free platform for all, There is no charges for using it.
                  </Text>

                </VStack>


              </HStack>
              <hr />
              <HStack>
                <Image width={60} height={60} src={"https://ouch-cdn2.icons8.com/mNp6JKF-PmGhmDkAN3Qqnk23F9G2I91Zh7DzHROJHfU/rs:fit:368:332/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTc5/LzljZmY1YWJlLTlh/ZGQtNGM0YS1hOTNm/LTJmZmVkMzA1ZmQ4/Zi5zdmc.png"} />
                <VStack marginLeft={4} display={"flex"} alignItems={"start"}>
                  <Heading size={"md"} >
                    Never limited!
                  </Heading>
                  <Text>
                    Former is made for creators and business..
                  </Text>

                </VStack>
              </HStack>


            </CardBody>
          </Card>
        </Flex>
      </Box>

    </>
  )
}
