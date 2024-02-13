import { Flex } from "@chakra-ui/react";

export default function Footer() {
    const date = new Date();
    return <>
        <Flex py={10} justify={"center"} align={"center"} flexDir={"column"}
            borderTop={"1px solid gray"} fontFamily={"monospace"}
            bg={"#1a1a29"}
            fontSize={16}
            color={"white"}>
            Zenforms (c) {date.getFullYear()}
        </Flex></>
}