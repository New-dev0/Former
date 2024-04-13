import { Text, Box, Heading, Flex, Button, VStack, Image, ButtonGroup, IconButton, Tag } from "@chakra-ui/react";
import Header from "@/components/header";
import { useRouter } from "next/router";
import { Rating } from 'react-simple-star-rating'
import { useEffect, useState } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker"
import { GrAdd } from "react-icons/gr";
import { IoMdShare } from "react-icons/io";
import FilePicker from "@/components/filePicker";
import Head from "next/head";
import { SiGoogleforms } from "react-icons/si";
import { IoAdd, IoAddCircleOutline, IoTabletLandscape } from "react-icons/io5";
import { getAuth } from "firebase/auth";
import { MdTableRows } from "react-icons/md";
import { FaChevronDown, FaHome } from "react-icons/fa";
import { BsBoxArrowUpRight, BsChevronLeft, BsChevronRight, BsTrash3Fill } from "react-icons/bs";
import {
    Tabs, TabList, TabPanels, Tab, TabPanel, TabIndicator,
    InputGroup,
    Badge, HStack, Input, Link, Spinner,

} from '@chakra-ui/react'
import {
    Card, CardHeader, CardFooter, Skeleton, CardBody, useMediaQuery, useToast,
    Select, Textarea,
    Checkbox,
    useDisclosure,
    InputLeftElement
} from "@chakra-ui/react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

import { getDoc, getDocs, query, doc, addDoc, setDoc, collection, updateDoc } from "firebase/firestore";
import { MdDelete } from "react-icons/md";
import { db } from "@/src/firebaseapp";
import { getRandomInt } from "../dashboard.p";
import { IoMdImage } from "react-icons/io";

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
import { LuImageOff } from "react-icons/lu";

import { Abel, Coming_Soon, Ramabhadra, Fira_Sans, Tajawal, New_Rocker } from "next/font/google";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";

const abel = Fira_Sans(
    {
        weight: "400",
        subsets: ["latin"]
    }
)

const taj = Tajawal({
    subsets: ["latin"],
    weight: "500"
});

async function getForm(slug) {
    //    console.log(slug);
    const dc = doc(db, "forms", slug);
    const dcn = await getDoc(dc);
    //    console.log(doc)
    return dcn.data();
}

const optionTypes = {
    "choice": "Choice Based",
    "name": "Name",
    "long_answer": "Long Answer",
    "short_answer": "Short Answer",
    "number": "Number",
    "email": "Email",
    "phoneno": "Phone Number",
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
                                        textAlign={"start"}
                                        backgroundColor={"white"}>
                                        {rData.type === "rating" && <Rating readonly allowHover={false} disableFillHover initialValue={parseInt(x)}
                                            SVGstyle={{
                                                display: "inline-block",
                                            }} />}
                                        {["choice", "question", "short_answer", "long_answer",
                                            "email", "name",
                                            "number",
                                            'date',
                                            "phoneno",
                                            "url",
                                        ].includes(rData.type) && <Text>{x}</Text>}
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
    const [invalidPage, setinvalidPage] = useState(false);
    const [response, setResponse] = useState({});
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imagePickIndex, setImagePickIndex] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const [isMobile] = useMediaQuery("(max-width: 520px)");
    const [selectIndex, setSelectPanel] = useState(null);
    const [currentPage, setcurrentPage] = useState(0);
    const [errorBox, setErrorBox] = useState({});

    const toast = useToast();

    const router = useRouter()
    const { slug } = router.query;

    useEffect(() => {
        if (localStorage.getItem("submitted")) {
            setSubmitted(true);
        };

        if (slug) getForm(slug).then(data => {
            if (data === undefined) {
                setinvalidPage(true);
                return
            }
            setFormData(data)});
        window.addEventListener("beforeunload", (e) => {
            if (view && !submitted) {
                e.preventDefault()
            }
            else if (!view) {
                e.preventDefault();
            }
        })
    }, [slug]);

    console.log(formData)
    const FormSaveButton = (props) => {
        return <ButtonGroup width={selectIndex !== null || isMobile ? 400 : 200}
            colorScheme={formData?.theme?.colorScheme || "purple"}
            flexDir={selectIndex !== null || isMobile ? "row" : "column"}
            alignItems={isMobile ? null : "center"}
            {...props}>
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
                marginTop={selectIndex !== null || isMobile ? 0 : 3}

                onClick={() => {
                    if (!formData['pages']) {
                        formData["pages"] = [];
                    }
                    formData['pages'].push({
                        "type": "choice",
                        "question": "Question",
                        "required": true,
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
    };


    const Settings = () => {
        const toggleRequireLogin = async () => {
            setFormData(prev => ({ ...prev, requireLogin: !prev.requireLogin }));
            const dc = doc(db, "forms", slug);
            await setDoc(dc, { "requireLogin": !formData?.requireLogin || false }, { merge: true });
        }

        const toggleSingleQuestion = async () => {
            setFormData(prev => ({ ...prev, singleQuestionMode: !prev.singleQuestionMode }));
            const dc = doc(db, "forms", slug);
            await setDoc(dc, { "singleQuestionMode": !formData?.singleQuestionMode || false }, { merge: true });
        }

        return <Flex minW={isMobile ? "90%" : "50%"} justify={"center"}
            align={"center"}
            flexDir={"column"}
        >
            <Box backgroundColor={"whitesmoke"} borderRadius={20}
                paddingTop={5}
                width={isMobile ? "99%" : "50%"}
                paddingBottom={5}
                pr={8}
                pl={8}>
                <Heading size="md" textAlign={"start"}>
                    Settings
                </Heading>
                <HStack mt={3} justify={"space-between"} minW={"80vh"}>
                    <Text onClick={toggleRequireLogin}>
                        Require login to fill
                    </Text>
                    <Checkbox isChecked={formData?.requireLogin} onChange={toggleRequireLogin}
                        borderColor={"black"}
                    />
                </HStack>
                <HStack mt={3} justify={"space-between"} minW={"80vh"}>
                    <Text onClick={toggleSingleQuestion}>
                        Single question Mode
                    </Text>
                    <Checkbox isChecked={formData?.singleQuestionMode} onChange={toggleSingleQuestion}
                        borderColor={"black"} />
                </HStack>


            </Box>
            <Box backgroundColor={"whitesmoke"} borderRadius={20}
                paddingTop={5}
                mt={5}
                width={isMobile ? "99%" : "50%"}
                paddingBottom={5}
                pr={8}
                pl={8}>
                <Heading size="md" textAlign={"start"}>
                    Customize
                </Heading>
                <VStack display={"flex"}
                    align={"start"} mt={3}>
                    <Text>Response message:</Text>
                    <Textarea onChangeCapture={async e => {
                        formData['responseMessage'] = e.currentTarget.value;
                        const dc = doc(db, "forms", slug);
                        await setDoc(dc, { "responseMessage": e.currentTarget.value }, { merge: true });
                    }} defaultValue={formData['responseMessage']} />
                </VStack>

            </Box>

            {/* <Box minW={"80vh"} backgroundColor={"whitesmoke"} borderRadius={20}
                paddingTop={5}
                mt={8}
                paddingBottom={5}
                pr={8}
                pl={8}>
                <Heading size={"md"} textAlign={"center"}>
                    Color Scheme
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
                                    formData['theme'] = d;
                                    setFormData({ ...formData });
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

            </Box> */}
            <Button colorScheme={"red"} mt={5} size={"lg"} onClick={() => {
                alert("Deletion is currently not supported!")
            }}>
                Delete form
            </Button>
        </Flex>
    }

    const FormSubmitButton = () => <Button size={formData?.singleQuestionMode ? "lg" : null} colorScheme={"purple"} minW={"220px"} mt={7} alignSelf={"center"} onClick={async () => {
        let newErrorBox = {};
        formData["pages"].map(d => {
            if (!response[d.qid]) {
                newErrorBox[d.qid] = "This answer is required and can not be empty!"
                return
            }
            if (d['type'] === "name" && (response[d.qid].length < 4)) {
                newErrorBox[d.qid] = "Please enter a valid name!";
                return
            }
            if (d['type'] === "phoneno" && (response[d.qid].length != 10)) {
                newErrorBox[d.qid] = "Please enter a valid phone number!";
                return
            }

            if (d['type'] === "email" && !((response[d.qid]).toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ))) {
                newErrorBox[d.qid] = "Please enter a valid email address!";
                return
            }

        });
        if (Object.entries(newErrorBox).length) {
            setErrorBox(newErrorBox);
            toast({
                title: "Error Occured!",
                description: `Please fix all ${Object.entries(newErrorBox).length} errors`,
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true
            })
            return;
        }
        const dc = collection(db, "forms", slug, "responses");
        await addDoc(dc, response);
        toast({
            status: "success",
            title: "Submitted!",
            position: "top"
        });
        setSubmitted(true);
        setResponse({});
        setErrorBox({});
        localStorage.setItem("submitted", true)
    }} maxW={"100px"}>
        Submit
    </Button>
        ;
    function MoreOptionsPanel() {
        const data = formData['pages'][selectIndex];
        //        console.log(data);

        return <Flex
            flexDir={"column"}
            right={0}
            position={"fixed"}
            alignSelf={"start"}
            minW={"25%"}
            alignContent={"space-between"}
            minH={"100vh"}
            height={"90%"}
            //                backgroundColor={"whitesmoke"}
            mt={1}
            mr={1}
            ml={-1}
        >
            <Box backgroundColor={"#323331"}
                width={"100%"} py={3}
                borderTopLeftRadius={10}
                borderTopEndRadius={10}
            >
                <Flex
                    justifyContent={"space-between"} px={3}
                    alignItems={"center"}>
                    <Text px={2}
                        color={"white"}
                        fontWeight={"bolder"}
                    >
                        More Options
                    </Text>
                    <IconButton onClick={() => setSelectPanel(null)}
                        borderRadius={"50%"}>
                        <BsChevronRight />
                    </IconButton>
                </Flex>
            </Box>
            <Text backgroundColor={"white"}
                px={3} py={2} width={"100%"}

            >
                {data?.question}
            </Text>
            <Flex minH={"80vh"} backgroundColor={"whitesmoke"}
                flexDir={"column"}
                pt={8}
                px={4} pr={7}
                pl={3}
                gap={5}
            >


                <Flex justifyContent={"space-between"} ml={3}>
                    <Text>
                        Required:
                    </Text>
                    <Checkbox size={"lg"} colorScheme={"green"} defaultChecked={data?.required}
                        onChange={e => { data['required'] = !data['required'] }}
                        borderColor={"black"}
                    />
                </Flex>
                {["short_answer", "long_answer"].includes(data.type) && <>
                    <Flex justifyContent={"space-between"} ml={3}>
                        <Text>
                            Min Length:
                        </Text>
                        <Input size={"sm"} maxW={"100px"}
                            type="number" />
                    </Flex>
                    <Flex justifyContent={"space-between"} ml={3}>
                        <Text>
                            Max Length:
                        </Text>
                        <Input size={"sm"} maxW={"100px"}
                            maxLength={3}
                            type="number" onChange={(e) => {
                                data['maxLength'] = parseInt(e.target.value)
                            }} />
                    </Flex>
                    <hr />
                </>}
                <HStack justify={"space-between"}>
                    <Text marginLeft={"12px"}>
                        Move to:
                    </Text>
                    <Select maxW={"120px"} placeholder={"Select"} onChangeCapture={(e => {
                        let newindex = parseInt(e.currentTarget.value)
                        let element = formData['pages'].splice(selectIndex, 1)[0];
                        formData['pages'].splice(newindex, 0, element);
                        setSelectPanel(newindex);
                        setFormData({ ...formData });
                        toast({
                            "title": "Moved",
                            status: "success"
                        })
                    })}>
                        {formData.pages.map((page, i) => <option key={i} value={i}>{i + 1}</option>)}
                    </Select>
                </HStack>
            </Flex>

        </Flex>

    }

    function ParseQuestion(props, index) {
        const singleMode = formData?.singleQuestionMode && view;
        const [sOption, selectOpt] = useState();
        const options = formData["pages"][index].options;

        const PageContent = () => {
            return <>
                {
                    props.media?.map((x, index) => {
                        return <Image key={index} src={x.url} minW="350" minH="200" height={350} width={700} marginBottom={3} />
                    })
                }
                {
                    view ? <Heading size={"md"} fontWeight={"500"}
                        marginBottom={4}

                        fontSize={singleMode ? (isMobile ? 30 : 40) : null}
                        my={singleMode ? 6 : 0}
                        mb={singleMode ? 6 : 4}
                    >
                        {props.question}
                    </Heading> :
                        <Input borderWidth={0.1} fontWeight={"500"}
                            size={"lg"}
                            defaultValue={props.question}
                            color={formData?.theme?.fg}
                            //                        m={2}
                            onChange={(e) => {
                                props.question = e.currentTarget.value;
                            }} />
                }
                {
                    ["choice", "question"].includes(props.type) && <VStack gap={1}
                        justify={"start"}
                        mt={3}
                    >
                        {props?.options.map((option, oindex) => <Flex flexDir={"row"}
                            backgroundColor={singleMode ? "purple.50" : null}
                            borderRadius={singleMode ? 10 : 0}
                            pl={singleMode ? 10 : 0}
                            py={singleMode ? 1 : 0}
                            key={oindex} width={"100%"}
                            onClick={() => {
                                if (view) {
                                    selectOpt(oindex);
                                    //                                    console.log(props.question);
                                    response[props.qid] = option.id
                                    //                                   setResponse({ ...response });
                                }
                            }}>

                            {view ? <Radio colorScheme={"purple"} disabled={!view}
                                size={singleMode ? "lg" : null}
                                defaultChecked={view ? null : false}
                                isChecked={sOption === oindex || response[props.qid] == option.id}

                                onChange={(e) => {
                                    //                                console.log(view)
                                    if (view) {
                                        selectOpt(oindex);
                                        //                                    console.log(props.question);
                                        response[props.qid] = option.id
                                        //                                   setResponse({ ...response });
                                    }
                                }} /> : <IconButton size={"sm"} onClick={() => {
                                    props.options = props?.options?.filter((x, index) => { return index !== oindex });
                                    setFormData({ ...formData });
                                }}>
                                <BsTrash3Fill />
                            </IconButton>}
                            {view ? <Text ml={5} size={"sm"} maxW={singleMode ? null : "250px"} fontWeight={"400"}
                                fontSize={singleMode ? 30 : 15}
                                className={abel.className}
                            >
                                {option.text}
                            </Text> :
                                <Input textColor={formData?.theme?.fg} maxW={"250px"} borderWidth={0.3}
                                    defaultValue={option.text} ml={2} size={"sm"}
                                    onChange={(e) => {
                                        if (view) {
                                            response[props.qid] = e.currentTarget.value;
                                            return;
                                        }
                                        formData["pages"][index]["options"][oindex]['text'] = e.currentTarget.value;
                                    }} />}
                        </Flex>)}
                    </VStack>
                }

                {
                    ["short_answer", "email", "phoneno", "number",
                        "name",
                        "url"].includes(props.type) &&
                    <InputGroup>
                        {
                            props.type === "email" && <InputLeftElement mt={1.5}>
                                <MdEmail />
                            </InputLeftElement>
                        }
                        {
                            props.type === "phoneno" && <InputLeftElement mt={1.5}>
                                <FaPhoneAlt />
                            </InputLeftElement>
                        }
                        {
                            props.type === "url" && <InputLeftElement mt={1.5}>
                            </InputLeftElement>
                        }
                        <Input placeholder={props.type === "phoneno" ? "Enter Phone Number" : (props.type === "email" ? "Enter Email" : "Enter Content")}
                            borderWidth={0.5}
                            backgroundColor={singleMode ? "white" : null}
                            width={singleMode ? (isMobile ? "100%" : "50%") : "100%"}
                            defaultValue={response[props.qid]}
                            onKeyDown={event => {
                                if (["ArrowRight", "ArrowLeft", "Backspace"].includes(event.key)) {
                                    return
                                }
                                if (props.type === "name" && !/[a-zA-Z ]/i.test(event.key)) {
                                    event.preventDefault();
                                }
                                if ((props.type === "phoneno" || props.type === "number") && !/[0-9 ]/i.test(event.key)) {
                                    event.preventDefault();
                                }

                            }}
                            size={singleMode ? "lg" : null}

                            mt={2}
                            type={(() => {
                                switch (props.type) {
                                    case "number":
                                        return "number"
                                    case "phoneno":
                                        return "tel"
                                    default:
                                        return "name"
                                }
                            })()}
                            onChange={e => {
                                if (view) {
                                    response[props.qid] = e.currentTarget.value;
                                    return
                                }

                            }} />
                    </InputGroup>
                }
                {
                    props.type === "long_answer" && <Textarea placeholder="Enter Answer"
                        color={formData?.theme?.fg}
                        mt={2}
                        backgroundColor={singleMode ? "white" : null}
                        maxW={singleMode ? (isMobile ? "100%" : "50%") : null}
                        size={singleMode ? "lg" : null}
                        defaultValue={response[props.qid]}
                        //                    borderWidth={0}
                        onChange={e => {
                            if (view) {
                                response[props.qid] = e.currentTarget.value;
                            }
                        }}
                    />
                }
                {
                    props.type === "rating" && <Box display={"flex"} justifyContent={"center"} mt={5}
                    >
                        <Rating SVGstyle={{
                            display: "inline-block",
                            marginTop: view ? 8 : 0
                        }} disableFillHover allowHover={false}
                            onClick={(e) => {
                                response[props.qid] = e;
                            }} />
                    </Box>
                }
                {
                    ["date", "time"].includes(props.type) && <Input type={props.type} onChange={e => {
                        response[props.qid] = e.currentTarget.value;
                    }} />
                }

                {errorBox[props.qid] && view && <>
                    <Text color={"red.500"} ml={singleMode ? 0 : 0} className={taj.className} mb={4}
                        fontSize={singleMode ? 20 : null}
                        mt={singleMode ? 7 : 3}>
                        Error: {errorBox[props.qid]}

                    </Text>
                </>}

            </>

        }
        if (view && formData?.singleQuestionMode) {
            const hasNextPage = formData['pages'].length !== currentPage + 1;
            return <Box backgroundColor={"whitesmoke"} minH={"80vh"}
                py={4} px={isMobile ? 7 : 20}
                mx={4}
                display={"flex"}
                flexDir={"column"}
                justifyContent={"space-between"}
                borderRadius={10}
            >
                <div>
                    <PageContent />
                </div>
                {(!hasNextPage) && <FormSubmitButton />}
                <Flex justifyContent={"flex-end"}>
                    {<IconButton borderColor={"black"}
                        colorScheme={currentPage > 0 ? "purple" : null} width={"50px"} height={"50px"}
                        onClick={() => {
                            if (currentPage > 0) {
                                setcurrentPage(currentPage - 1);
                            }
                        }}>
                        <BsChevronLeft />
                    </IconButton>}
                    {<IconButton ml={3} colorScheme={hasNextPage ? "purple" : null}
                        width={"50px"} height={"50px"}
                        onClick={() => {
                            //       console.log(currentPage, formData['pages'].length)
                            if (hasNextPage) {
                                setcurrentPage(currentPage + 1);
                            }
                        }}>
                        <BsChevronRight />
                    </IconButton>}

                </Flex>
            </Box>;
        }
        //        console.log(options, props)

        return <Card minH={"160px"} width={isMobile ? "99%" : "48%"}
            //            minW={"min-content"}
            onClick={() => { if (selectIndex !== null) setSelectPanel(index) }}
            borderColor={selectIndex === index ? "black" : null}
            borderWidth={selectIndex === index ? 1 : 0}
            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px;"}
            backgroundColor={formData?.theme?.card}
        // backgroundColor={"blue.200"}
        >
            <CardBody>
                <PageContent />
            </CardBody>
            {!view && <CardFooter gap={2} justify={"space-between"}
                display={"flex"}
                flexDir={"row"}


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
                    {["choice", "question"].includes(props.type) && options.length < 10 && <Button px={isMobile ? 0 : 12} onClick={() => {
                        options.push({
                            "text": "Option " + (options.length + 1),
                            "id": `opt${getRandomInt(1000000, 9999999)}`
                        });
                        setFormData({ ...formData });
                    }}>
                        {isMobile ? <IoAdd /> : 'Add option'}
                    </Button>}

                    {props.media && props.media.length !== 0 ? <IconButton colorScheme={"red"} onClick={() => {
                        props.media = [];
                        setFormData({ ...formData });
                    }}>
                        <LuImageOff />
                    </IconButton> : <IconButton variant="outline" onClick={() => {
                        setModalOpen(!modalOpen);
                        setImagePickIndex(index);
                    }}>
                        <IoMdImage />
                    </IconButton>}
                    {selectIndex === null && <IconButton onClick={() => { setSelectPanel(index) }}>
                        <BsChevronRight />
                    </IconButton>}
                </Flex>
                <IconButton colorScheme={"red"} icon={<MdDelete />} onClick={() => {
                    formData["pages"].splice(index, 1);
                    setFormData({ ...formData });
                }} />
            </CardFooter>}
        </Card>
    }

    const QuestionsTab = () => <><Flex
        backgroundColor={formData?.theme?.bg}
        flexDir={"column"}>
        {!view && !formData?.pages?.length && <Card width={isMobile ? "90%" : "38%"} opacity={0.7}
            alignSelf={"center"} onClick={() => {
                if (!formData['pages']) {
                    formData["pages"] = [];
                }
                formData['pages'].push({
                    "type": "choice",
                    "question": "Question",
                    "required": true,
                    "qid": `ques${getRandomInt(1000000, 9999999)}`,
                    "options": [
                        { "text": "Option 1", "id": `opt${getRandomInt(1000000, 9999999)}` }
                    ]
                });
                setFormData({ ...formData });

            }}>
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
        {/* {!view && <Box width={"100%"}
            display={"flex"}
            justifyContent={"center"}>
            <Card width={isMobile ? "90%" : "50%"}>
                <CardHeader>

                </CardHeader>
                <CardBody>

                </CardBody>
                <CardFooter>
                    <Button>
                        Generate
                    </Button>
                </CardFooter>
            </Card>
        </Box>} */}
        {view && formData?.singleQuestionMode ?
            <>
                {ParseQuestion(formData['pages'][currentPage], currentPage)}</>
            : <Flex flexDir={"row"}
                width={"100%"}
                justifyContent={"center"}
            >
                <Flex flexDir={"column"} justifySelf={"center"}
                    align={"center"} width={"80%"} gap={3}
                    marginRight={selectIndex !== null ? "280px" : 0}>
                    {formData.pages?.map(ParseQuestion)}

                    {!view && isMobile && <FormSaveButton mt={3} mb={10} />}

                </Flex>

                {/* 
            ARROW LEFT BACK TO OPEN CHAT AI [REMOVE] #TODO
            {!selectIndex && <IconButton onClick={() => setselectIndex(!selectIndex)}
            >
                <BsChevronLeft />
            </IconButton>} */}
            </Flex>}
        {view && !formData?.singleQuestionMode && <FormSubmitButton />}

    </Flex>
    </>
    if (invalidPage) {
        return <>
        <Header />
        <Box minH={"100vh"} display={"flex"} flexDir={"column"} alignItems={"center"} backgroundColor={"blue.50"}>
            <Image src="https://ouch-cdn2.icons8.com/txEqzpEXP-oNdP7Ktb0qw4A58H2QtApHLRKwa1gpGvc/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvMS8w/NWYyNjAyMy1mMWFi/LTQ5NWUtYmY1ZC0w/MzE0NmFlYzNiNzgu/cG5n.png"
            width={400} height={400}/>
            <Heading maxW={"80%"}>
                This form does'nt exists or is deleted by the creator.
            </Heading>
            <Button mt={10} size={"lg"} colorScheme={"purple"}>
                Go to Home
            </Button>
        </Box>
        </>
    }
    if (view) {
        return formData ? <>
            <Head>
                <title>{formData.title}</title>
            </Head>
            <Header invert showOptions={false} showLogin={!(formData?.requireLogin && !user)} user={user} />
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

                            backgroundColor={"whitesmoke"} // padding={"10px"}
                            minW={"480px"} minH={"150px"}
                            display={"flex"}
                            justify={"center"}>
                            <CardBody justifyContent={"center"} alignItems={"center"}
                                display={"flex"} flexDir={"column"}>
                                <Image mb={8} alignSelf={"center"} src="https://ouch-cdn2.icons8.com/LdmJhqlesaurjtJurGbiWsjONtu0_SRQ8-aEFCkKgd0/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTI0/Lzk3YjJjOGZhLWUz/ZjQtNGNhNi1iZTVl/LWZiNWJjMDczN2Nl/YS5zdmc.png"
                                    height={150} width={150} />
                                <Heading size={"md"}>
                                    Thank your for submitting the form!
                                </Heading>
                                <Text mt={3}>
                                    {formData?.responseMessage || 'Your application have been submitted!'}
                                </Text>

                            </CardBody>
                            <CardFooter justify={"flex-end"}>
                                <Link onClick={() => {
                                    localStorage.removeItem("submitted");
                                    setSubmitted(false);
                                }}
                                    color={"blue"}>
                                    Submit another response?
                                </Link>
                            </CardFooter>
                        </Card>
                    </Box>
                </> :
                    (formData?.requireLogin && !user ? <>
                        <Flex justify={"center"} mt={5}>
                            <Card width={isMobile ? "90%" : "38%"}>
                                <CardHeader>
                                    <Heading size="md">
                                        This form requires login
                                    </Heading>
                                    <Text opacity={0.8} mt={2}>
                                        Form creator is requiring you to login to fill this form.
                                    </Text>
                                </CardHeader>
                                <CardFooter justify={"flex-end"}>
                                    <Button onClick={() => {
                                        router.push(`/login?ref=${window.location.pathname}`);
                                    }}
                                        colorScheme={"purple"}>
                                        Login to Continue
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Flex>
                    </> : <QuestionsTab />)}
            </Box>
        </> : <></>
    }
    return formData ? <>
        <Head>
            <title>{formData?.title}</title>
        </Head>
        <Header invert showOptions={false} user={user} />
        <HStack
            backgroundColor={formData?.theme?.bg || "#DEDEDE"}>
            <Box minH={"100vh"}
                paddingBottom={"4rem"}
                width={"100%"}
                backgroundColor={formData?.theme?.bg || "#DEDEDE"
                }
            //            backgroundColor={"#f5f5f5"}
            >
                <Tabs
                    variant='soft-rounded'
                    onChange={(e) => setTab(e)}
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
                        <Flex display={"flex"} alignContent={"center"}
                            verticalAlign={"middle"}

                        >
                            {/* <IconButton icon={<FaHome />} colorScheme={"purple"}
                            onClick={(e) => router.push("/dashboard")} borderRadius={"50%"} /> */}
                            {<Heading size={isMobile ? "sm" : "lg"} color={formData?.theme?.fg || "#2b2b2b"}
                                textAlign={"start"}
                            >
                                {formData['title']}
                            </Heading>}
                        </Flex>

                        <Flex flexDir={"row"}
                            marginLeft={isMobile ? null : "-210px"}
                        >
                            <Tab>
                                Questions
                            </Tab>
                            <Tab>
                                Settings
                            </Tab>
                        </Flex>
                        <ButtonGroup justifySelf={"flex-end"} alignSelf={"flex-end"}
                            colorScheme={formData?.theme?.colorScheme || "purple"}>
                            <Menu>
                                <MenuButton>
                                    <IconButton isRound
                                        variant="outline">
                                        <BsThreeDotsVertical />
                                    </IconButton>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={onOpen}
                                        icon={<SiGoogleforms />}>
                                        View responses
                                    </MenuItem>
                                    <MenuItem onClick={() => {
                                        window.open(`https://${window.location.host}/view/${slug}`)
                                    }} icon={<BsBoxArrowUpRight />}>
                                        View form
                                    </MenuItem>
                                    <MenuItem icon={<IoMdShare />}
                                        onClick={async (e) => {
                                            await navigator.share({
                                                title: `${user?.displayName} sent you this form!`,
                                                url: `https://${window.location.host}/view/${slug}`
                                            })
                                        }}>
                                        Share form                               </MenuItem>
                                </MenuList>
                            </Menu>

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

            {selectIndex !== null && <MoreOptionsPanel />}
        </HStack>


        {!isMobile && selectIndex === null && tab === 0 && <Box display={"flex"} position={"fixed"}
            bottom={10} right={selectIndex !== null ? "40%" : 10}
        >
            <FormSaveButton />
        </Box>}

        {/* DOCS: Model based components */}
        <Responses onClose={onClose} onOpen={onOpen} isOpen={isOpen} slug={slug} />
        <FilePicker isOpen={modalOpen} onClose={() => setModalOpen(!modalOpen)}
            onSelect={(data) => {
                setModalOpen(!modalOpen);
                //    if (!formData["pages"][imagePickIndex].media) {
                formData["pages"][imagePickIndex].media = [];
                //  }
                formData["pages"][imagePickIndex].media.push(data);
                setFormData({ ...formData });
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