import Header from "@/components/header";
import {Heading, Text} from "@chakra-ui/react";

export default function APIPage({user}) {
    return <>
    <Header showAPI={false} user={user}/>
    <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start"
//        color: "white"
    }} color="white">
        <Heading size={"lg"} color={"white"}>
            API Documentation
        </Heading>
        <Text color={"white"} mt={8}>
            Coming Soon.
        </Text>
    </main>
    </>
}