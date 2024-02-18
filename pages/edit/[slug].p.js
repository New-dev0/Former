import { Text, Box, Heading, Flex, Button, VStack, ButtonGroup, IconButton } from "@chakra-ui/react";
import Header from "@/components/header";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GrAdd } from "react-icons/gr";

import ColorCircle from "@/components/shapes";
import Head from "next/head";
import { IoTabletLandscape } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { MdTableRows } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, HStack, Input } from '@chakra-ui/react'
import {
    Card, CardHeader, CardFooter, Skeleton, CardBody, useMediaQuery, useToast,
    useDisclosure
} from "@chakra-ui/react";
import { getDoc, getDocs, query, doc, addDoc, setDoc, collection } from "firebase/firestore";
import { MdDelete } from "react-icons/md";
import { db } from "@/src/firebaseapp";
import { getRandomInt } from "../dashboard.p";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react';

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Radio,
    RadioGroup
} from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'


async function getForm(slug) {
    //    console.log(slug);
    const dc = doc(db, "forms", slug);
    const dcn = await getDoc(dc);
    //    console.log(doc)
    return dcn.data();
}

export function Responses({ slug, ...props }) {
    const [response, setResponse] = useState();
    const [viewMode, setViewMode] = useState("combined");

    useEffect(() => {
        if (!props.isOpen) return;
        async function setData() {
            let out = {}
            //            console.log(slug)
            const dc = doc(db, "forms", slug);
            const qdata = (await getDoc(dc)).data();
            qdata.pages.map(d => {
                out[d.qid] = {
                    'type': d.type,
                    "question": d.question,
                    "ans": []
                }
            })
            //            console.log(out)
            const data = collection(db, "forms", slug, "responses");
            const docs = await getDocs(data)
            docs.forEach(d => {
                Object.entries(d.data()).forEach(x => {
                    let xy = x[0];
                    let page = (qdata.pages.filter((x) => x.qid === xy));
                    if (!page.length) return
                    page = page[0];
                    //  console.log(qdata.pages, xy)
                    let opt = page['options'].filter(y => y.id === x[1])
                    if (!opt.length) return;
                    out[xy]['ans'].push(opt[0]['text'])
                })
            })
            //            console.log(out)
            setResponse(out);
        };
        setData()
    }, [props.isOpen]);

    //    console.log(response)
    //  console.log(props)
    return <Modal size={"full"} {...props}>
        <ModalOverlay />
        <ModalContent backgroundColor={"whitesmoke"}
            display={"flex"} alignItems={"center"}>
            <ModalCloseButton />
            <ModalHeader fontWeight={"bold"} display={"flex"} justifyContent={"space-between"}
                width={"90%"}>
                <Heading>
                    Responses
                </Heading>
                <div>
                    <ButtonGroup mr={3}
                    >
                        <IconButton colorScheme={viewMode === "combined" ? "purple" : null} icon={<MdTableRows />} onClick={() => setViewMode("combined")} />
                        <IconButton colorScheme={viewMode === "tab" ? "purple" : null} icon={<IoTabletLandscape />} onClick={() => setViewMode("tab")} />

                    </ButtonGroup>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<FaChevronDown />} colorScheme={"purple"}>
                            Export as
                        </MenuButton>
                        <MenuList fontSize={"15px"}>
                            <MenuItem>CSV</MenuItem>
                            <MenuItem>EXCEL</MenuItem>
                        </MenuList>
                    </Menu>
                </div>

            </ModalHeader>

            <hr />
            {viewMode === "tab" && response && <Tabs width={"80%"} align="center">
                <TabList>
                    {Object.entries(response).map((data, ind) => {
                        let qid = data[0];
                        let rData = data[1];
                        return <Tab key={ind}>
                            {rData.question}
                        </Tab>
                    })}
                </TabList>
                <TabPanels>
                    {Object.entries(response).map(data => {
                        let rData = data[1];
                        //                        console.log(rData);
                        return rData.ans.map((x, index) => {
                            //                            console.log(x)
                            return <TabPanel key={index} >
                                <HStack >
                                    <Text>
                                        {index + 1}.
                                    </Text>
                                    <Box width={"100%"} py={2} px={3} boxShadow={"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;"}
                                        textAlign={"start"}> {x}</Box></HStack>

                            </TabPanel>

                        })
                    })}
                </TabPanels>
            </Tabs>}
            {viewMode === "combined" && response && (Object.entries((response))).map((data) => {
                let qId = data[0];
                let rData = data[1];
                //                console.log(rData)
                return <>
                    <Card width={"80%"} my={2}>
                        <CardHeader fontWeight={"bold"} fontSize={20}>
                            {rData.question}
                        </CardHeader>
                        <CardBody>
                            {rData.ans.map((x, index) => {
                                return <HStack key={index}>
                                    <Text>
                                        {index + 1}.
                                    </Text>
                                    <Box width={"100%"} py={2} px={3} boxShadow={"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;"}> {x}</Box></HStack>
                            })}
                        </CardBody>
                    </Card>

                </>
            })}
        </ModalContent>
    </Modal>
}

export default function ViewEditPage({ user, view }) {
    const [formData, setFormData] = useState();
    const [submitted, setSubmitted] = useState();
    const [response, setResponse] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isMobile] = useMediaQuery("(max-width: 520px)");
    const toast = useToast();

    const router = useRouter()
    const { slug } = router.query;

    useEffect(() => {
        if (slug) getForm(slug).then(setFormData);
        window.addEventListener("beforeunload", (e) => {
            if (view && !submitted) {
                e.preventDefault()
            }
        })
    }, [slug]);

    const Settings = () => {
        return <Flex minW={"80vh"} justify={"center"}
            align={"center"}
            flexDir={"column"}
        >

            <Heading size={"md"} textAlign={"center"}>
                Color Scheme
            </Heading>
            <HStack mt={5}>
                <Box //backgroundColor={"black"}
                    boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
                    py={2} px={3} backgroundColor={"red"}
                    borderRadius={7}>
                    <Heading size={"sm"}>
                        Blue
                    </Heading>
                    <Skeleton height='20px' width={"180px"} mt={3} />
                    <Skeleton height='20px' width={"180px"} marginTop={3} />
                </Box>
            </HStack>
        </Flex>
    }

    function ParseQuestion(props, index) {
        const [sOption, selectOpt] = useState();
        const options = formData["pages"][index]["options"];

        return <Card minH={"200px"} width={isMobile ? "90%" : "38%"}
            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}

        // backgroundColor={"blue.200"}
        >
            <CardBody>
                {view ? <Heading size={"md"} fontWeight={"500"}
                    marginBottom={4}
                >
                    {props.question}
                </Heading> :
                    <Input borderWidth={0.1} fontWeight={"500"}
                        size={"lg"}
                        defaultValue={props.question}
                        marginBottom={2}
                        onChange={(e) => {
                            props.question = e.currentTarget.value;
                        }} />}
                <VStack gap={1}>
                    {props.options.map((option, oindex) => <Flex flexDir={"row"}
                        key={oindex} width={"100%"}>

                        <Radio colorScheme={"purple"} disabled={!view}
                            defaultChecked={view ? null : false}
                            isChecked={sOption === oindex}
                            onChange={(e) => {
                                //                                console.log(view)
                                if (view) {
                                    selectOpt(oindex);
                                    //                                    console.log(props.question);
                                    response[props.qid] = option.id
                                    //   setResponse({ ...response });
                                }
                            }} />
                        {view ? <Text ml={5} size={"sm"} maxW={"250px"} fontWeight={"400"}
                            fontSize={15}>
                            {option.text}
                        </Text> : <Input maxW={"250px"} borderWidth={0} defaultValue={option.text} ml={2} size={"sm"} onChange={(e) => {
                            //formData["pages"][index]["options"][oindex]['text']
                            option.text = e.currentTarget.value;
                        }} />}
                    </Flex>)}
                </VStack>
            </CardBody>
            {!view && <CardFooter gap={2} justify={"space-between"}>
                {options.length < 6 && <Button onClick={() => {
                    options.push({
                        "text": "Option " + (options.length + 1),
                        "id": `opt${getRandomInt(1000000, 9999999)}`
                    });
                    setFormData({ ...formData });
                }}>
                    Add option
                </Button>}
                <IconButton colorScheme={"red"} icon={<MdDelete />} onClick={() => {
                    formData["pages"].splice(index, 1);
                    setFormData({ ...formData });
                }} />
            </CardFooter>}
        </Card>
    }

    const QuestionsTab = () => <><Flex gap={3} alignItems={"center"} flexDir={"column"} px={8}>
        {!view && !formData?.pages?.length && <Card width={isMobile ? "90%" : "38%"} opacity={0.7}>
            <CardHeader>
                <Heading fontWeight={"bold"} size="md">
                    Add your first question!
                </Heading>
            </CardHeader>
            <CardBody>
                <HStack>
                    <Radio />
                    <Skeleton height={"30px"} width={"160px"} />
                </HStack>
                <HStack mt={2}>
                    <Radio />
                    <Skeleton height={"30px"} width={"160px"} />
                </HStack>
            </CardBody></Card>}

        {formData.pages?.map(ParseQuestion)}
        {view && <Button colorScheme={"purple"} minW={"220px"} mt={7} onClick={async () => {
            //            console.log(response);
            const dc = collection(db, "forms", slug, "responses");
            await addDoc(dc, response);
            toast({
                status: "success",
                title: "Submitted!",
                position: "top"
            });
            setSubmitted(true);
        }}>
            Submit
        </Button>}
    </Flex>
    </>;
    if (view) {
        return formData ? <>
            <Header invert showOptions={false} user={user} />
            <Box background={"#f5f5f5"}
                py={3}
                textAlign={"center"}
                pl={3}
                boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
            >
                <Heading size={"lg"} color={"#2b2b2b"}>
                    {formData['title']}
                </Heading>
            </Box>
            <Box minH={"100vh"}
                paddingBottom={"4rem"}

                backgroundColor={"#DEDEDE"} pt={3}>
                {submitted ? <>
                    <Box justifyContent={"center"} display={"flex"} marginTop={5}
                        flexDir={"column"} alignItems={"center"}>
                        <Card textAlign={"center"} blur={"2px"}
                            backgroundColor={"whitesmoke"} padding={"10px"}
                            minW={"480px"} minH={"150px"}
                            display={"flex"}
                            justify={"center"}>
                            <Heading size={"md"}>
                                Thank your for submitting the form!
                            </Heading>
                            <Text mt={3}>
                                Your application have been submitted!
                            </Text>

                        </Card>
                    </Box>
                </> :
                    <QuestionsTab />}
            </Box>
        </> : <></>
    }
    return formData ? <>
        <Header invert showOptions={false} user={user} />
        <Box minH={"100vh"}
            paddingBottom={"4rem"}
            backgroundColor={"#DEDEDE"}
        //            backgroundColor={"#f5f5f5"}
        >
            <Tabs
                variant='soft-rounded'
                colorScheme={"purple"}

            //                align="center"
            >
                <TabList display={"flex"} justifyContent={"space-between"} px={8}
                    boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
                    py={4}
                    background={"#f5f5f5"}
                >
                    <Heading size={"lg"} color={"#2b2b2b"}>
                        {formData['title']}
                    </Heading>
                    <Flex flexDir={"row"} marginLeft={"30px"}>
                        <Tab>
                            Questions
                        </Tab>
                        <Tab>
                            Settings
                        </Tab>
                    </Flex>
                    <ButtonGroup justifySelf={"flex-end"} alignSelf={"flex-end"}
                        colorScheme={"purple"}>
                        <Button //mt={1} 
                            variant={"outline"}
                            onClick={onOpen}
                            // size={"sm"}
                            borderRadius={20}>
                            View responses
                        </Button>
                        <Button
                            borderRadius={20}>
                            Share
                        </Button>
                    </ButtonGroup>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <QuestionsTab />
                    </TabPanel>
                    <TabPanel>
                        <Settings />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
        <Box display={"flex"} position={"fixed"} bottom={10} right={10}
        >
            <ButtonGroup width={200} colorScheme={"purple"} flexDir={"column"} >
                <Button marginLeft={2} width={"180px"} onClick={async () => {
                    const dc = doc(db, "forms", slug);
                    await setDoc(dc, formData);
                }}>
                    Save
                </Button>
                <Button aria-label="Add Question" leftIcon={<GrAdd />}
                    width={"180px"}
                    marginTop={3}

                    onClick={() => {
                        if (!formData['pages']) {
                            formData["pages"] = [];
                        }
                        formData['pages'].push({
                            "type": "question",
                            "question": "Question",
                            "qid": `ques${getRandomInt(1000000, 9999999)}`,
                            "options": [
                                { "text": "Option 1", "id": `opt${getRandomInt(1000000, 9999999)}` }
                            ]
                        });
                        setFormData({ ...formData });
                    }}>
                    Add Question
                </Button>
            </ButtonGroup>
        </Box>
        <Responses onClose={onClose} onOpen={onOpen} isOpen={isOpen} slug={slug} />
    </> : <></>
}

/*    () => {
    return formData ? <>
    <Head>
        <title>{formData['title']}</title>
    </Head>
        <Header invert showOptions={false} />
        <Box backgroundColor={"whitesmoke"}
            minH={"100vh"}
        >
            <Flex flexDir={"row"} gap={5}>
                <Flex flexDir={"column"} height={"100%"}
                    minH={"100vh"}
                    minW={"20%"}
                    overflowY={"auto"}
                    backgroundColor={"#444444"}
                    pt={"2rem"}
                    boxShadow={"rgba(0, 0, 0, 0.35) 0px 5px 15px;"}
                    px={"30px"}>
                    <Heading size="md" color={"white"}>
                        Pages
                    </Heading>
                    <VStack>

                    </VStack>
                </Flex>

                <Flex flexDir={"column"} mt={6}>
                    <Flex justifyContent={"space-between"}>
                        <Heading size="md">
                            {formData['title']}
                        </Heading>
                        <Button>
                            Settings
                        </Button>
                    </Flex>
                    <Flex justify={"center"}
                        align={"center"}
                        marginTop={3} flexDir={"row"}>
                        <Box bgColor={"white"} width={700}
                            height={380}>

                        </Box>

                    </Flex>
                </Flex>
            </Flex>
        </Box>

    </> : <>
    </>
}
*/