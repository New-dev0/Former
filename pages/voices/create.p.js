import Header from "@/components/header";
import { useRouter } from "next/router";
import {
    Box, Flex, Button, Heading, Image, Input, Textarea, Text, useMediaQuery, Badge, Select,
    useToast
} from "@chakra-ui/react";
import voiceModel from "@/src/static/voiceModel.json";
import { useEffect, useState } from "react";
import { getUniqueHash } from "../dashboard.p";
import { getDoc, addDoc, setDoc, collection, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/src/firebaseapp";

export function UpdateVoicePage({ voiceData }) {
    const router = useRouter();
    const toast = useToast();
    const [data, setData] = useState(voiceData);
    const [title, setTitle] = useState("");
    const [agent, setAgent] = useState("");
    const [image, setImage] = useState("https://ouch-cdn2.icons8.com/FNY0tyySA5Qr2K64HpKFeHky06S_uEkmzMZch-yeZJo/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNTIx/LzYyOTBlMmU4LWQ2/NmMtNDgzMS1hOWFl/LTUwNDQ3M2ZkMWZj/NS5wbmc.png")
    const auth = getAuth();
    const [value, setValue] = useState("");
    const [isMobile] = useMediaQuery("(max-width: 600px)");
    useEffect(() => {
        const _data = router.query.ref ? voiceModel[router.query.ref] : {};
        setData(_data);
        if (_data.img) { setImage(_data.img) }
    }, [router]);

    const SaveButton = () => <Button colorScheme={"teal"} mt={3} minW={"30vh"} maxW={"50vh"} onClick={async () => {
        if (!title || !value) {
            toast({
                title: "Enter title and prompt",
                status: "error",
            });
            return;
        };
        const hash = await getUniqueHash("voice-forms");
        const dc = doc(db, "voice-forms", hash);
        setDoc(dc, {
            "title": title,
            "prompt": value,
            "user": auth.currentUser.uid,
            "agent": agent,
            "img": image
        }, { merge: true });
        toast({
            title: "Created form!",
            status: "success",
            duration: 2000,
            position: "top"
        });
        router.push(`/voices/edit/${hash}`);
    }}>
        Save
    </Button>
    const BoxSelection = () => <Select placeholder="Select Agent" mt={2}
        aria-label="Select Agent"
        onChangeCapture={(e) => setAgent(e.currentTarget.value)}
        value={agent}
        maxW={"50vh"}>
        <option value={"hiring_manager"}>Hiring Manager</option>
        <option value={"teacher"}>Teacher</option>
        <option value={"custom"}>Custom</option>
    </Select>


    console.log(data)
    //    console.log
    if (false && !isMobile) {
        return <Flex backgroundColor={"whitesmoke"} minH={"100vh"}
            flexDir={"column"} px={"2rem"} pt={"2rem"}>
            <Heading textAlign={"center"}>
                Create Voice Form
            </Heading>
            <Flex mt={5} flexDir={"row"}
                justify={"center"}
                justifyContent={"center"}
            >
                <Flex flexDir={"column"} >
                    <Image src={data?.img} width={250} height={250}
                        borderRadius={"20%"} />

                </Flex>
                <Flex flexDir={"column"} width={"50%"} ml={8}
                //alignItems={"center"}
                >
                    <Text ml={3}  fontSize={12}>
                        Agent Mode:
                    </Text>
                    <BoxSelection />
                    <Input size={"lg"} onChange={e => setTitle(e.currentTarget.value)}
                        placeholder="Enter title"
                        defaultValue={data?.title}
                        //                        maxW={isMobile ? "80%" : "30%"}
                        mt={12} />
                    <SaveButton />
                </Flex>
            </Flex>
        </Flex>
    }
    return <>
        <Flex backgroundColor={"whitesmoke"} minH={"100vh"}
            flexDir={"column"} align={"center"} py={"2rem"}>
            <Heading>
                Create Voice Form
            </Heading>
            <Flex mt={5}>
                <Box width={200} height={200}>
                    <Image mt={4} backgroundImage={image} backgroundSize={"cover"}
                        height={200} width={200} borderRadius={
                            "50%"
                        } />
                </Box>
                <Flex flexDir={"column"} ml={8} justify={"center"}>
                    <Button mt={5} colorScheme={"teal"} >
                        Edit Profile
                    </Button>
                    <BoxSelection />
                </Flex>
            </Flex>
            <Input onChange={e => setTitle(e.currentTarget.value)}
                placeholder="Enter title"
                defaultValue={data?.title}
                maxW={isMobile ? "80%" : "30%"}
                mt={12} />
            <Textarea mt={5} maxW={isMobile ? "80%" : "30%"} onChange={(e) => setValue(e.currentTarget.value)}
                placeholder="Enter Prompt" />
            <SaveButton /> </Flex>
    </>
}

export default function CreatePage() {
    return <>
        <Header />
        <UpdateVoicePage />
    </>
}