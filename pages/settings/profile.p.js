import { getAuth } from "firebase/auth";
import SettingsPage from "./index.p";
import { Avatar, Box, Image, Text, Flex, Input } from "@chakra-ui/react";

export default function Profile({ user }) {

    return <SettingsPage title={"Profile"}>
        <Flex
            flexDir={"column"} alignItems={"center"}
        >
            <Image mt={3} src={user?.photoURL} height={"200px"} width={"200px"} borderRadius={"50%"} />
            <Text mt={6}>
                {user?.displayName}
            </Text>
        </Flex>
    </SettingsPage>
}