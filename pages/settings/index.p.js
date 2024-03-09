import Header from "@/components/header";
import { Box, Text, Card, Flex, Heading, Link, ButtonGroup, Button, Grid, GridItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SettingsPage({ title, children }) {
    const Pages = [
        "Profile",
        "Access Tokens"
    ];
    const router = useRouter();

    useEffect(() => {
        if (!title) router.replace("/settings/profile");
    }, [title]);

    return <>
        <Header invert />
        <Box minH={"100vh"} px={"2rem"} pt={"2rem"}>
            <Flex flexDir={"row"}>
                <Flex flexDir={"column"} width={"20%"}>
                    <Flex display={"flex"} flexDir={"column"} gap={2}
                        maxW={"30vh"} width={"30vh"}
                        >
                        {Pages.map((box_title, index) => {
                            return <Button key={index} onClick={() => router.replace(`/settings/${box_title.toLowerCase().replace(" ", "-")}`)} colorScheme={title === box_title ? "purple" : null}
                                width={"30vh"} variant={title === box_title ? null : "outline"}>
                                {box_title}
                            </Button>
                        })}
                    </Flex>
                </Flex>
                <Flex flexDir={"column"} width={"70%"}>
                    <Heading textAlign={"center"} size={"lg"} mb={5}>
                        {title}
                    </Heading>
                    <hr />
                    <Box>
                        {children}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    </>
}