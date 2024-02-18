import { Inter } from 'next/font/google';
import { Box, Flex, Text, Button, Link, HStack, Avatar } from "@chakra-ui/react";
import { getAuth } from 'firebase/auth';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'
import { Teko, Courgette } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const teko = Teko({
    subsets: ["latin"],
    weight: "700"
});
const corg = Courgette({
    subsets: ["latin"],
    weight: "400"
});

const tekolight = Teko({
    subsets: ["latin"],
    weight: "300"
});

export function Former({ style, invert = false }) {
    return <Text style={{
        fontSize: invert ? 36 : 38,
        fontWeight: "bolder",
        marginLeft: 5,
        //        textDecoration: "underline",
        color: invert ? "white" : "whitesmoke",
        ...style
        //               marginLeft: 
    }}
        className={corg.className}
    >
        Former
    </Text>

}
export default function Header({ children, user, showLogin = true, showOptions = true,
    invert = false, shadow = false, centerChild = null,
    showAPI = true,
    pricing = true }) {

    return <Box py={invert ? 0 : 2.5}
        bg={invert ? "#2b2b2b" : "#1a1a29"}
    >
        <Flex flexDir={"row"} py={invert ? 2 : 3} px={invert ? 4 : 8}
            justifyContent={"space-between"}
            boxShadow={shadow && "rgba(255, 255, 255, 0.05) 0px 0px 0px 1px;"}
        >
            <Link href='/'>
                <Former invert={invert} />
            </Link>
            {centerChild}
            <Flex>
                {children}
                {showOptions && <Flex alignSelf={"center"}>
                    <HStack gap={2}>
                        {pricing && <Link href="/pricing">
                            <Button variant="ghost" color={"white"}
                                className={corg.className}
                                _hover={{
                                    backgroundColor: "transparent",
                                }}
                            //                                fontSize={23}
                            //                              className={tekolight.className}
                            //                            fontWeight={300}
                            >
                                Pricing
                            </Button>
                        </Link>}

                        {showAPI && <Link href="/api-docs">
                            <Button variant="ghost" color={"white"}

                                //                                className={tekolight.className}
                                //                            letterSpacing={0.5}
                                //                              fontWeight={300}
                                className={corg.className}

                                _hover={{
                                    backgroundColor: "transparent",
                                }}>
                                API Integration
                            </Button>
                        </Link>}
                    </HStack>
                </Flex>
                }
                {
                    user == null ? <></> :
                        (user ? <Menu>
                            <MenuButton>
                                <Avatar alignSelf={"flex-end"} marginLeft={"35px"} size={"md"} borderWidth={0}
                                    name={user?.displayName} alt="" src={user?.photoURL} />
                            </MenuButton>
                            <MenuList mt={-15} mr={7}>
                                <MenuItem>Settings</MenuItem>
                                <MenuItem colorScheme="red"
                                onClick={async () => {
                                    const auth = getAuth();
                                    await auth.signOut();
                                }}>Logout</MenuItem>
                            </MenuList>
                        </Menu> : <Flex alignSelf={"flex-end"} marginLeft={"35px"}>
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