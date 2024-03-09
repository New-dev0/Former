import { Text, Box, Heading, Flex, Button, VStack, ButtonGroup, IconButton } from "@chakra-ui/react";
import Header from "@/components/header";
import { useRouter } from "next/router";
import { Rating } from 'react-simple-star-rating'
import { useEffect, useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker"
import { GrAdd } from "react-icons/gr";
import FilePicker from "@/components/filePicker";
import Head from "next/head";

import { IoTabletLandscape } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { MdTableRows } from "react-icons/md";
import { FaChevronDown, FaHome } from "react-icons/fa";
import { Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator, Badge, HStack, Input, Link, Spinner } from '@chakra-ui/react'
import {
    Card, CardHeader, CardFooter, Skeleton, CardBody, useMediaQuery, useToast,
    Select, Textarea,
    Checkbox,
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
import { Coming_Soon, Ramabhadra } from "next/font/google";


async function getForm(slug) {
    //    console.log(slug);
    const dc = doc(db, "forms", slug);
    const dcn = await getDoc(dc);
    //    console.log(doc)
    return dcn.data();
}

const optionTypes = {
    "choice": "Choice Based",
    "long_answer": "Long Answer",
    "short_answer": "Short Answer",
    "rating": "Rating",
    "date": "Date",
    "time": "Time"
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
                    let value;
                    if (["question", "choice"].includes(page['type'])) {
                        let opt = page['options'].filter(y => y.id === x[1])
                        if (!opt.length) return;
                        value = opt[0]['text'];
                        console.log(value)
                    }
                    else {
                        console.log(page.type)
                        value = x[1];
                    }
                    //                    console.log(value)
                    out[xy]['ans'].push(value)
                })
            })
            //            console.log(out)
            setResponse(out);
        };
        setData()
    }, [props.isOpen]);

    console.log(response)
    //  console.log(props)
    return <Modal size={"full"} {...props}>
        <ModalOverlay />
        <ModalContent backgroundColor={"whitesmoke"}
            display={"flex"} alignItems={"center"}
            pb={"8rem"}>
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
                    {Object.entries(response).map((data, index) => {
                        let rData = data[1];
                        //                        console.log(rData)
                        return <TabPanel key={index}>
                            {rData.ans.map((x, index) => {
                                return <HStack key={index}>
                                    <Text>
                                        {index + 1}.
                                    </Text>
                                    <Box width={"100%"} py={2} px={3} boxShadow={"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;"}
                                        textAlign={"start"}>
                                        {rData.type === "rating" && <Rating readonly allowHover={false} disableFillHover initialValue={parseInt(x)}
                                            SVGstyle={{
                                                display: "inline-block",
                                            }} />}
                                        {["choice", "question", "short_answer", "long_answer"].includes(rData.type) && <Text>{x}</Text>}
                                    </Box></HStack>

                            })}
                            {!rData.ans.length && <Text>No Responses</Text>}
                        </TabPanel>
                        //                        console.log(rData);

                    })}
                </TabPanels>
            </Tabs>}
            {viewMode === "combined" && response && (Object.entries((response))).map((data, index) => {
                let qId = data[0];
                let rData = data[1];
                //                console.log(rData)
                return <>
                    <Card width={"80%"} my={2} key={index}>
                        <CardHeader fontWeight={"bold"} fontSize={20}>
                            {rData.question}
                        </CardHeader>
                        <CardBody>
                            {rData.ans.map((x, index) => {
                                return <HStack key={index}>
                                    <Text>
                                        {index + 1}.
                                    </Text>
                                    <Box width={"100%"} py={2} px={3} boxShadow={"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;"}>
                                        {rData.type === "rating" && <Rating readonly allowHover={false} disableFillHover initialValue={parseInt(x)}
                                            SVGstyle={{
                                                display: "inline-block",
                                            }} />}
                                            <Text>{x}</Text>
                                    </Box></HStack>
                            })}
                            {!rData.ans.length && <Text>No responses</Text>}
                        </CardBody>
                    </Card>

                </>
            })}
        </ModalContent>
    </Modal>
}

const colorModes = [
    {
        "name": "Teal",
        "bg": "teal",
        "fg": "white",
        "sc": "#034078"
    },
    {
        "name": "Ocean Blue",
        "bg": "#A2D6F9",
        "fg": "white",
        "sc": "#003366",
        "colorScheme": "blue",
        "card": "#473198"
    },
    {
        "name": "Forest Green",
        "bg": "#228B22",
        "fg": "white",
        "sc": "#2E8B57"
    }

];

export default function ViewEditPage({ user, view }) {
    const [formData, setFormData] = useState();
    const [submitted, setSubmitted] = useState();
    const [response, setResponse] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalOpen, setModalOpen] = useState(false);
    const [tab, setTab] = useState(0);
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
            <Box minW={"80vh"} backgroundColor={"whitesmoke"} borderRadius={20}
             paddingTop={5}
             paddingBottom={5}
             pr={8}
             pl={8}>
            <Heading size="md" textAlign={"start"}>
                Settings
            </Heading>
            <HStack mt={3} justify={"space-between"} minW={"80vh"}>
                <Text>
                    Require login to fill
                </Text>
                <Checkbox defaultChecked />
            </HStack>

            </Box>
            <Box minW={"80vh"} backgroundColor={"whitesmoke"} borderRadius={20}
            paddingTop={5}
            mt={8}
            paddingBottom={5}
            pr={8}
            pl={8}>
            <Heading size={"md"} textAlign={"center"}>
                Color Scheme
                <Badge>
                    Upcoming
                </Badge>
            </Heading>
            <HStack gap={5} mt={5}>
                {
                    colorModes.map((d, index) => {
                        return <Box //backgroundColor={"black"}
                        key={index}
                            _hover={{
                                boxShadow: "rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px;;"
                            }}
                            onClick={() => {
                                // TODO: UNCOMMNENT
                                //                              formData['theme'] = d;
                                //                                setFormData({ ...formData });
                            }}
                            //   boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
                            py={2} px={3} backgroundColor={d.bg}
                            borderRadius={7}>
                            <Heading size={"sm"} color={d.fg}>
                                {d.name}
                            </Heading>
                            <Skeleton height='20px' width={"180px"} mt={3} />
                            <Skeleton height='20px' width={"180px"} marginTop={3} />
                        </Box>

                    })
                }
            </HStack>

            </Box>
            <Button colorScheme={"red"} mt={5} size={"lg"} onClick={() => {
                alert("Deletion is currently not supported!")
            }}>
                Delete form
            </Button>
        </Flex>
    }

    function ParseQuestion(props, index) {
        const [sOption, selectOpt] = useState();
        const options = formData["pages"][index]["options"];
        console.log(options, props)

        return <Card minH={"160px"} width={isMobile ? "90%" : "38%"}
            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}
            backgroundColor={formData?.theme?.card}

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
                        color={formData?.theme?.fg}
                        marginBottom={2}
                        onChange={(e) => {
                            props.question = e.currentTarget.value;
                        }} />}
                {["choice", "question"].includes(props.type) && <VStack gap={1}>
                    {props?.options.map((option, oindex) => <Flex flexDir={"row"}
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
                                    //                                   setResponse({ ...response });
                                }
                            }} />
                        {view ? <Text ml={5} size={"sm"} maxW={"250px"} fontWeight={"400"}
                            fontSize={15}>
                            {option.text}
                        </Text> :
                            <Input textColor={formData?.theme?.fg} maxW={"250px"} borderWidth={0}
                                defaultValue={option.text} ml={2} size={"sm"}
                                onChange={(e) => {
                                    if (view) {
                                        response[props.qid] = e.currentTarget.value;
                                        return;
                                    }
                                    formData["pages"][index]["options"][oindex]['text'] = e.currentTarget.value;
                                }} />}
                    </Flex>)}
                </VStack>}
                {props.type === "short_answer" && <Input placeholder="Enter Content"
                    borderWidth={0}
                    onChange={e => {
                        if (view) {
                            response[props.qid] = e.currentTarget.value;
                            return
                        }

                    }} />}
                {props.type === "long_answer" && <Textarea placeholder="Enter Answer"
                    color={formData?.theme?.fg}
                    borderWidth={0}
                    onChange={e => {
                        if (view) {
                            response[props.qid] = e.currentTarget.value;
                        }
                    }}
                />}
                {props.type === "rating" && <Box display={"flex"} justifyContent={"center"} mt={5}
                >
                    <Rating SVGstyle={{
                        display: "inline-block",
                        marginTop: view ? 8 : 0
                    }} disableFillHover allowHover={false}
                        onClick={(e) => {
                            response[props.qid] = e;
                        }} />
                </Box>}
                {["date", "time"].includes(props.type) && <Input type={props.type} onChange={e => {
                    response[props.qid] = e.currentTarget.value;
                }} />}
            </CardBody>
            {!view && <CardFooter gap={2} justify={"space-between"}
                //            alignContent={"center"}
                alignItems={"center"}>
                <Flex flexDir={"row"} gap={2}
                    alignItems={"center"}>

                    <Select textColor={formData?.theme?.fg} onChange={(e) => {
                        props.type = e.currentTarget.value
                        setFormData({ ...formData });
                    }} placeholder={props.type ? optionTypes[props.type] : null} size={"sm"} maxW={"20vh"} borderRadius={10}>
                        {Object.entries(optionTypes).map(
                            data => {
                                return <option value={data[0]} key={data[0]}
                                >
                                    {data[1]}
                                </option>
                            }
                        )}
                    </Select>
                    {["choice", "question"].includes(props.type) && options.length < 6 && <Button px={12} onClick={() => {
                        options.push({
                            "text": "Option " + (options.length + 1),
                            "id": `opt${getRandomInt(1000000, 9999999)}`
                        });
                        setFormData({ ...formData });
                    }}>
                        Add option
                    </Button>}
                </Flex>
                <IconButton colorScheme={"red"} icon={<MdDelete />} onClick={() => {
                    formData["pages"].splice(index, 1);
                    setFormData({ ...formData });
                }} />
            </CardFooter>}
        </Card>
    }

    const QuestionsTab = () => <><Flex gap={3} alignItems={"center"} flexDir={"column"} px={8}
        backgroundColor={formData?.theme?.bg}>
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
            //            console.log(response);
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
    </>
    if (view) {
        return formData ? <>
            <Head>
                <title>{formData.title}</title>
            </Head>
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
        <Head>
            <title>{formData?.title}</title>
        </Head>
        {/* <Header invert showOptions={false} user={user} /> */}
        <Box minH={"100vh"}
            paddingBottom={"4rem"}
            backgroundColor={formData?.theme?.bg || "#DEDEDE"
            }
        //            backgroundColor={"#f5f5f5"}
        >
            <Tabs
                variant='soft-rounded'
                colorScheme={formData?.theme?.colorScheme || "purple"}
            //              backgroundImage={"https://t4.ftcdn.net/jpg/01/95/42/21/240_F_195422106_cNzNOmCmgf0QbxDVfuOoEc2zEl0gYIL0.jpg"}
            //                backgroundRepeat={"repeat"}
            //                align="center"
            >
                <TabList display={"flex"} justifyContent={"space-between"} px={8}
                    boxShadow={"rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;"}
                    py={4}
                    background={formData?.theme?.sc || "white"}
                >
                    <Flex display={"flex"} alignContent={"center"}>
                        <IconButton icon={<FaHome />} colorScheme={"purple"}
                            onClick={(e) => router.push("/dashboard")} borderRadius={"50%"} />
                        <Heading size={"lg"} color={formData?.theme?.fg || "#2b2b2b"} ml={3}>
                            {formData['title']}

                        </Heading>
                    </Flex>

                    <Flex flexDir={"row"} marginLeft={"30px"}>
                        <Tab>
                            Questions
                        </Tab>
                        <Tab>
                            Settings
                        </Tab>
                    </Flex>
                    <ButtonGroup justifySelf={"flex-end"} alignSelf={"flex-end"}
                        colorScheme={formData?.theme?.colorScheme || "purple"}>
                        <Button //mt={1} 
                            variant={"outline"}
                            onClick={onOpen}
                            // size={"sm"}
                            borderRadius={20}>
                            View responses
                        </Button>
                        <Button onClick={async (e) => {
                            await navigator.share({
                                title: `${user?.displayName} sent you this form!`,
                                url: `https://${window.location.host}/view/${slug}`
                            })
                        }}
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
            <ButtonGroup width={200} colorScheme={formData?.theme?.colorScheme || "purple"} flexDir={"column"} >
                <Button marginLeft={2} width={"180px"} onClick={async () => {
                    const dc = doc(db, "forms", slug);
                    await setDoc(dc, formData);
                    toast({
                        title: "Saved!",
                        status: "success"
                    })
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
                            "type": "choice",
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
        <FilePicker isOpen={modalOpen} onClose={() => setModalOpen(!modalOpen)} onSelect={(e) => {
            setModalOpen(!modalOpen);
            console.log(e);
        }} />
    </> : <>
        <Header invert />
        <Box>
            <Flex justify={"center"} align={"center"} minH={"100vh"}>
                <Spinner size="xl" />
            </Flex>
        </Box>
    </>
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