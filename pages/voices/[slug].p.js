import { Box, Text, Button, IconButton, Flex, Heading, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSpeechRecognition, useSpeechSynthesis } from "react-speech-kit";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone } from "react-icons/fa";
import { db } from "@/src/firebaseapp";
import { IoMdPause } from "react-icons/io";
import { getDoc, doc, average } from "firebase/firestore";
import Head from "next/head";
import Typewriter from 'typewriter-effect';
import { Coiny, Quicksand } from "next/font/google";
import { useRef } from "react";
const quick = Quicksand({
    subsets: ["latin"],
    weight: "700"
});

export default function VoiceForm() {
    const [data, setData] = useState();
    const [value, setValue] = useState();
    const [instance, setInstance] = useState();
    const [convId, setConvID] = useState();
    const [aivalue, setAiValue] = useState();
    const { speak } = useSpeechSynthesis();
    const voiceText = useRef();


    const router = useRouter();
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (result) => {
            console.log(result);
            getQuestion(result);
            setValue(result)
            //            instance?.typeString(result)

        },
    });


    useEffect(() => {
        if (!router.isReady) return;
        const dc = doc(db, "voice-forms", router.query.slug);
        getDoc(dc).then(x => setData(x.data()));
        fetch("/api/createConversation").then(x => x.json().then(
            out => {
                if (out.id) {
                    setConvID(out.id)
                }
            }))
        listen({
            interimResults: false,
        });
    }, [router]);

    useEffect(() => {
        if (convId) { getQuestion("hi") }
    }, [convId])

    async function getQuestion(query) {

        let res = await fetch(`/api/respond?id=${convId}&query=${encodeURIComponent(query)}`);
        let rep = await res.json();
        if (rep.ok) {
            setAiValue(rep.text.text);
        }
        //      console.log(rep);
    }
    //    console.log(convId, aivalue);

    //    console.log(voiceText.current);
    return <>
        <Head>
            <title>{data?.title}</title>
        </Head>
        <Box minH={"100vh"}
            backgroundColor={"#25283D"}
            py={"3rem"} px={"3rem"}    >
            <Flex height={"100%"} minH={"80vh"}>
                <Flex flexDir={"column"} w={"50%"} height={"100%"}
                    align={"center"}
                    minH={"60vh"}
                    justifyContent={"center"}>
                    <Image height={300} width={300} src={data?.img || "https://ouch-cdn2.icons8.com/FNY0tyySA5Qr2K64HpKFeHky06S_uEkmzMZch-yeZJo/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNTIx/LzYyOTBlMmU4LWQ2/NmMtNDgzMS1hOWFl/LTUwNDQ3M2ZkMWZj/NS5wbmc.png"} />
                </Flex>
                <Flex flexDir={"column"} minHeight={"60vh"} height={"100%"} w={"50%"}
                    justify={"center"}
                >
                    <Flex flexDir={"row"} className={quick.className}>
                        <Heading color={"teal.100"} >
                            {aivalue}
                        </Heading>
                    </Flex>
                    <Flex flexDir={"row"} className={quick.className} mt={10}>
                        <Heading color={"white"} >
                            {value}
                        </Heading>
                    </Flex>
                </Flex>

            </Flex>
        </Box>
        <Box display={"flex"} flexDir={
            "row"
        }
            width={"100%"}
            position={"fixed"}
            alignItems={"center"}
            justifyContent={"center"}
            bottom={20}
            minW={"40vh"} minH={"10vh"}>
            <Box backgroundColor={listening ? "rgba(224, 67, 98, 0.5)" : "rgba(171, 217, 175, 0.8)"}
                maxW={"35%"}
                onClick={listening ? stop : () => listen({
                    interimResults: false,
                })}
                minW={"30vh"} minH={"10vh"} borderRadius={15}
                display={"flex"} justifyContent={"center"}
                alignItems={"center"}>
                <IconButton icon={listening ? <IoMdPause /> : <FaMicrophone />}
                    colorScheme={listening ? "red" : "green"}
                    size="lg" borderRadius="50%" />
                {/* <Button leftIcon={<FaMicrophone />} size="lg"
                        borderColor={"black"}
                        borderWidth={1}
                    >

                        Speak
                    </Button>
                 */}

            </Box>
        </Box></>
}