import {
    Heading, Flex, Box, Button, Tabs, Tab, TabList, TabPanels, TabPanel,
    VStack, Input, Card, CardBody, CardHeader, Text, Image,
    IconButton, Grid, GridItem, Textarea
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import Header from "@/components/header";
import { Roboto_Condensed } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "@/src/firebaseapp";
import { getDoc, doc, collection, addDoc, updateDoc } from "firebase/firestore";
import Head from "next/head";
import { Cardo } from "next/font/google";
import { UpdateVoicePage } from "../create.p";
import { getRandomInt } from "@/pages/dashboard.p";

const roboto = Roboto_Condensed({
    subsets: ["latin"],
    weight: "500"
})

export default function EditVoicePage() {

    const [data, setData] = useState();
    const router = useRouter();
    const [image, setImage] = useState("https://ouch-cdn2.icons8.com/FNY0tyySA5Qr2K64HpKFeHky06S_uEkmzMZch-yeZJo/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNTIx/LzYyOTBlMmU4LWQ2/NmMtNDgzMS1hOWFl/LTUwNDQ3M2ZkMWZj/NS5wbmc.png")
    console.log(data);

    useEffect(() => {
        const query = router.query.slug;
        if (query) {
            const dc = doc(db, "voice-forms", query);
            getDoc(dc).then(x => setData(x.data()));
        };
        window.addEventListener("beforeunload", (e) => {
            e.preventDefault();
        })
    }, [router])

    return <>
        <Head>
            <title>{data?.title}</title>
        </Head>
        <Header showOptions={false} invert />
        <Box minH={"100vh"} backgroundColor={"whitesmoke"}
            pt={"10px"} pb={"3rem"} px={"2rem"}>
            <Flex justify={"space-between"} verticalAlign={"middle"}
                alignItems={"center"}>
                <div />
                <Text fontWeight={"bold"} fontSize={25}
                    className={roboto.className}
                    align={"center"} mt={5}>
                    {data?.title}
                </Text>
                <Button minW={"15vh"} onClick={async () => {
                    const dc = doc(db, "voice-forms", router.query.slug);
                    await updateDoc(dc, "keys", data?.keys || []);
                }} colorScheme={"green"}>
                    Save
                </Button>

            </Flex>

            <Flex mt={8} mx={10} gap={8}>
                <Flex flexDir={"column"} w={"100%"}>
                    <Textarea placeholder="Additional AI prompt"
                        backgroundColor={"white"} />

                    <Card minH={"50vh"} mt={8}>
                        <CardHeader borderBottomColor={"black.100"}
                            borderBottomWidth={1} display={"flex"} alignContent={"center"}
                            justifyContent={"end"}
                            verticalAlign={"middle"}>

                            <div>
                                <Button ml={5} onClick={() => {
                                    if (!data.keys) {
                                        data['keys'] = [];
                                    }
                                    data['keys'].push({
                                        "Id": `ques${getRandomInt(10000, 555555)}`,
                                        "tag": "",
                                        "value": ""
                                    })
                                    setData({ ...data });
                                }}>
                                    Add Keypoint
                                </Button>

                            </div>
                        </CardHeader>
                        <CardBody display={"flex"}
                            //alignItems={"center"} 
                            flexDir={"column"}>
                            {data?.keys?.map((x, index) => {
                                return <Flex my={2}
                                key={index}
                                //                                justify={"center"}
                                //                              align={"center"}
                                >
                                    <IconButton icon={<IoMdClose />} colorScheme={"red"} mr={5} size={"sm"}
                                        onClick={() => {
                                            data['keys'] = data['keys'].filter((_, cindex) => cindex !== index)
                                            setData({ ...data });
                                        }} />
                                    <Input borderRadius={10} defaultValue={x['tag']} //size={"sm"}
                                        backgroundColor={"#dce4f5"}
                                        minW={"30vh"}
                                        placeholder="Enter Question"
                                        onChange={e => {
                                            data['keys'][index]['tag'] = e.currentTarget.value
                                            setData({ ...data });
                                        }} />
                                    <Input borderRadius={10} minW={"30vh"} placeholder="Enter Detail" backgroundColor={"#dce4f5"} defaultValue={x['value']} ml={5}

                                        onChange={e => {
                                            data['keys'][index]['value'] = e.currentTarget.value
                                            setData({ ...data });

                                        }}
                                    //size={"sm"}
                                    />
                                </Flex>
                            })}

                        </CardBody>
                    </Card>

                </Flex>
                <Flex w={"30%"} flexDir={"column"}>
                    <Card minH={"60vh"}>
                        <CardBody alignItems={"center"} gap={3}
                            display={"flex"}
                            flexDir={"column"}>
                            <Image src={data?.img || "https://ouch-cdn2.icons8.com/FNY0tyySA5Qr2K64HpKFeHky06S_uEkmzMZch-yeZJo/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNTIx/LzYyOTBlMmU4LWQ2/NmMtNDgzMS1hOWFl/LTUwNDQ3M2ZkMWZj/NS5wbmc.png"} width={150} height={150} borderRadius={"50%"} />
                            <Input placeholder="Enter Agent Name" />
                        </CardBody>

                    </Card>

                </Flex>
            </Flex>
        </Box>
    </>
}