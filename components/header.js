import { Inter } from 'next/font/google';
import { Box, Flex, Text, Button, Link, HStack, Avatar } from "@chakra-ui/react";
import { getAuth } from 'firebase/auth';

const inter = Inter({ subsets: ['latin'] })

export default function Header({ children, user, showLogin = true, showOptions = true,
    invert = false }) {

    return <Box py={invert ? 0 : 2.5} bg={invert ? "white" : "#1a1a29"}>
        <Flex flexDir={"row"} py={invert ? 2 : 2} px={invert ? 4 : 8}
            justifyContent={"space-between"}
>
            <Link href='/'>
                <Text style={{
                    fontSize: 29,
                    fontWeight: "bolder",
                    fontFamily: inter,
                    color: invert ? "black" : "white",
                    //               marginLeft: 
                }}>
                    Zenforms
                </Text>
            </Link>
            <Flex>
                {children}
                {showOptions && <Flex alignSelf={"center"}>
                    <HStack gap={2}>
                        <Link href="/pricing">
                            <Button variant="ghost" color={"white"}
                                _hover={{
                                    backgroundColor: "transparent",
                                }}>
                                Pricing
                            </Button>
                        </Link>

                        <Link href="/api-docs">
                            <Button variant="ghost" color={"white"}
                                _hover={{
                                    backgroundColor: "transparent",
                                }}>
                                API Integration
                            </Button>
                        </Link>
                    </HStack>
                </Flex>
                }
                {
                    user == null ? <></> : (user ? <Avatar alignSelf={"flex-end"} marginLeft={"35px"} size={"md"} name={user?.displayName} alt="" src={user?.photoURL} /> : <Flex alignSelf={"flex-end"} marginLeft={"35px"}>
                        <Link href='/login'>
                            <Button>
                                Login
                            </Button>

                        </Link>
                    </Flex>)}
            </Flex>

        </Flex>
    </Box>
}