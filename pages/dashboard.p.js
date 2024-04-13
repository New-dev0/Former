import Header from "@/components/header";
import {
    VStack, Flex, Box, Text,
    Modal, Image, Card, Button, Heading, CardHeader, CardBody, CardFooter,
    Link,
    useToast, Input
    , Grid,
    GridItem
    , SimpleGrid,
    IconButton,
    Spinner,

    useMediaQuery
} from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import VoiceModels from "../src/static/voiceModel.json"
import { IoMdClose } from "react-icons/io";

import { useDisclosure } from "@chakra-ui/react";
import { ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { useRouter } from "next/router";
import { Textarea } from "@chakra-ui/textarea";
import { useMemo, useState } from "react";
import { Abel, Nunito, Roboto } from "next/font/google";
import { doc, setDoc, updateDoc, collection, getDoc, addDoc, getDocs, where, query } from "firebase/firestore";
import { db } from "../src/firebaseapp";
import Head from "next/head";

const roboto = Roboto({
    subsets: ["latin"],
    weight: "900"
});

const Font = Nunito({
    subsets: ["latin"],
    weight: "500"
});

const Images = [
    {
        "url": "https://photo-cdn2.icons8.com/0EOWZ9RE6ZyQBZ4Q98fZrvl2TIaCh0_1jFWy_qKWCtE/rs:fit:576:384/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi9kYzM4YTY0NGZm/ZjY0MDgwYTNhNTBi/MzUzZmM3MzAyYy5q/cGc.webp",
        "name": "Register for Rock Party",
        "pages": []
    },
    // {
    //     "url": "https://img.freepik.com/free-vector/happy-women-sitting-talking-each-other-dialog-psychologist-tablet-flat-illustration_74855-14078.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1709769600&semt=sph",
    //     "name": "College Adm.",
    //     "subtitle": ""
    // },
    {
        "url": "https://photo-cdn2.icons8.com/xYg2PreVyUGTLWbDOAJkdeAIDxBKnXH_NGp49tQa7ak/rs:fit:576:384/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi9hMzZlNTg3ZmM1/YWU0NjY3ODE1NDU2/MmMxN2Q0OGI0My5q/cGc.webp",
        "name": "Plan a trip with friends!",
        "subtitle": "",
        "pages": [
            {
                "media": [
                    {
                        "width": 288,
                        "height": 162,
                        "url": "https://photo-cdn2.icons8.com/lL7cYXjn_d7NcyyXwae8VoTwFlKBWHhzj3UksxCv3jA/rs:fit:288:162/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi85MTNmZGI2Mjhi/MGY0NmMwOTE4ZWJl/NTUyYmQ5ZTcxNy5q/cGc.jpg"
                    }
                ],
                "required": true,
                "question": "Where do we go this weekend?",
                "qid": "ques8797625",
                "options": [
                    {
                        "id": "opt8156331",
                        "text": "Kashmir"
                    },
                    {
                        "text": "Kerala",
                        "id": "opt9944364"
                    },
                    {
                        "text": "Lonavla",
                        "id": "opt7843507"
                    },
                    {
                        "text": "Odisha",
                        "id": "opt5602203"
                    },
                    {
                        "id": "opt1232144",
                        "text": "Goa"
                    }
                ],
                "type": "choice"
            },
            {
                "options": [
                    {
                        "id": "opt7012826",
                        "text": "Yes"
                    },
                    {
                        "id": "opt6215536",
                        "text": "No"
                    }
                ],
                "type": "choice",
                "qid": "ques4576011",
                "question": "Should we take our kids?",
                "required": true
            },
            {
                "required": true,
                "question": "How many days, should we plan?",
                "type": "number",
                "qid": "ques4730674",
                "options": [
                    {
                        "id": "opt5494397",
                        "text": "Option 1"
                    }
                ]
            },
            {
                "options": [
                    {
                        "id": "opt2150943",
                        "text": "Option 1"
                    }
                ],
                "required": true,
                "question": "When is your weekend starting?",
                "type": "date",
                "qid": "ques8336757"
            }
        ]
    },
    {
        "url": "https://photo-cdn2.icons8.com/VDP2KyNiOTXjRhv5ZVTjyvumoJqXUl6decJitMYCWxo/rs:fit:576:384/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi8xMzBkNzU5NDRm/YWE0NDk2OThkNjVm/Yjg4NTBjNTE4Ni5q/cGc.webp",
        "name": "Business Meet",
        "subtitle": "",
        "pages": [
            
        ]
    },
    {
        "url": "https://photo-cdn2.icons8.com/9h68GzdGG3EkNfqiERjvlXcDweHdpBrXMrAk4yJJauo/rs:fit:576:385/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNTgwLzJkMDMy/YTQ3LTc4YWQtNDZh/YS1hZGQyLTM1N2Vl/NWIyODM1NC5qcGc.webp",
        "name": "Product feedback",
        "subtitle": ""
    },
    {
        "url": "https://photo-cdn2.icons8.com/lMlU7rY8f6ZSkUscxZF9gCO9R5uHWvBmHWwT9QHpMEM/rs:fit:576:385/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNjkwLzMwZWUz/ZGQ1LTYxZjYtNGM5/NS1hYjk3LTU3N2Q5/MjJhZWRkMS5qcGc.webp",
        "name": "Job Application",
        "subtitle": ""
    },
    {
        "url": "https://5.imimg.com/data5/NN/RC/MY-62005257/tiffin-service.jpg",
        "name": "Online Tiffin Service",
        "subtitle": ""
    }
];


const crypto = require('crypto');

function generateRandomHash(length) {
    const randomString = Math.random().toString(length).substring(2, 2 + length);
    const hash = crypto.createHash('sha256').update(randomString).digest('hex').substring(0, length);
    return hash;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


async function IDExists(id, key = "forms") {
    const dc = doc(db, key, id)
    const dcsnap = await getDoc(dc);
    console.debug("checking id", id)
    return dcsnap
}


export async function getUniqueHash(key) {
    let hash;
    do {
        hash = generateRandomHash(
            getRandomInt(4, 8)
        )
    }
    while ((await IDExists(hash, key)).exists()) {
        hash = generateRandomHash(
            getRandomInt(4, 8)
        )
    }
    return hash
}

async function createNewForm(title, description, userId, pages) {
    const hash = await getUniqueHash();
    const now = (new Date()).getTime()
    const doe = doc(db, "forms", hash)
    await setDoc(doe, {
        "title": title,
        "description": description,
        "userId": userId,
        "timestamp": now,
        "pages": pages
    }, { merge: true });
    return hash;
}

async function getUserForms(userId) {
    const dc = query(collection(db, "forms"), where(
        "userId", "==", userId
    ));
    const docs = await getDocs(dc);
    let newList = [];
    docs.forEach(doc => {
        let data = doc.data();
        data["id"] = doc.id;
        newList.push(data)
    }
    );
    return newList;
}

// getUserForms("3CYM2GsbcFRyOTNF0IxuC5tvr0Z2").then(console.log)

export default function Dashboard({ user }) {
    const toast = useToast();
    const router = useRouter();
    //     console.log(user);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(true);
    const [isMobile] = useMediaQuery("(max-width: 600px)");
    const [modalTitle, setModalTitle] = useState();
    const [modalDescription, setModalDescription] = useState();
    const [template, selectTemplate] = useState();
    const [userForms, setUserForms] = useState();
    const haveForms = userForms?.length !== 0

    //     console.log(isMobile);

    useMemo(() => {
        if (user === null && !user) {
            router.push("/login");
        }
        else if (user) {
            getUserForms(user.uid).then((x) => {
                setUserForms(x);
                setLoading(false)
            })
        }
    }, [user]);


    return (<>
        <Head>
            <title>Dashboard</title>
        </Head>
        <Header showOptions={false} user={user} invert>
            <Button marginTop={2} onClick={onOpen}>
                Create Form
            </Button>
        </Header>
        <hr />

        <Box bg="whitesmoke" //</main> #caf0f8"
            //bgGradient={"linear(red, pink)"}
            minH={"100vh"}
            width={"inherit"}
            //minH={"100vh"}
            borderRadius={3}
        //              py="2rem"
        >
            <Box // backgroundColor={"#f5f5f5"}
                paddingTop={8}
                borderRadius={0}
            >
                <Heading
                    //</CardHeader>fontSize={20}
                    className={roboto.className}
                    //                        fontFamily={"Roboto"}
                    marginLeft={isMobile ?
                        "14px" : 10}//color="white"
                    fontSize={25}
                    marginBottom={3}
                >
                    Templates
                </Heading>
                <Box px={isMobile ? 0 : "1rem"} overflowX={"auto"} whiteSpace={"nowrap"}
                    mx={isMobile ? "7px" : "2rem"} py={2} display={"flex"}
                >
                    {Images.map((data, index) => {
                        return <Card key={index} minWidth={"170px"} minHeight={"185px"}
                            maxW={"200px"}
                            onClick={() => {
                                selectTemplate(data);
                                onOpen();
                            }}
                            borderTopRadius={10}
                            _hover={{
                                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"
                            }}
                            mx={"10px"}
                        >
                            <CardBody style={{ padding: 0 }}>
                                <Image
                                    bgRepeat={"repeat"}
                                    borderTopRadius={10}

                                    //                                   objectFit="contain"
                                    //                                   maxW={{ base: '100%', sm: '200px' }}
                                    src={data.url}
                                    alt={data.name}
                                />

                            </CardBody>
                            <CardFooter width={30}>
                                {data.name}
                            </CardFooter>
                        </Card>
                    })}
                </Box>
            </Box>
            { // VOICE FORMS
                /*
                <Box mt={3} px={"2rem"}>
                    <Heading size="md">
                        Voice Forms
                    </Heading>
                    <Box mx={5} mt={5}>
                        <Grid templateColumns='repeat(3, 1fr)' gap={5}>
                            {Object.entries(VoiceModels).map(
                                (data, index) => {
                                    let id = data[0];
                                    let ndata = data[1];
                                    return <GridItem  // backgroundColor={"#d1dece"}
    key={index}
                                    >
                                        <Card         >
                                            <CardBody _hover={{
                                                backgroundColor: "gray.100", borderRadius: 15
                                            }}>
                                                <Link href={`/voices/create?ref=${id}`} flexDir={"row"} display={"flex"}>
                                                    <Image src={ndata.img}
                                                        height={50} width={50} borderRadius={5}
                                                        backgroundColor={"transparent"}
                                                    />
                                                    <Text ml={3}>
                                                        {ndata.title}
                                                    </Text>
                                                </Link>
    
    
                                            </CardBody>
                                        </Card>
    
                                    </GridItem>
                                }
                            )}
                        </Grid>
                    </Box>
                            </Box>
                            */
            }
            <Flex minH={"30vh"}
                py={"1rem"}
                px={isMobile ? "3px" : "1rem"}
                flexDir={"column"}
                paddingTop={4}
                backgroundColor={"whitesmoke"}
            >
                <Card marginTop={3.4}
                    boxShadow={"rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;"}
                    backgroundColor={"#fbfbfb"}
                    mx={isMobile ? "10px" : "1rem"}>
                    <CardHeader >
                        <Heading marginBottom={2} size={"md"} marginLeft={4}>
                            Your Forms
                        </Heading>
                        <hr />
                    </CardHeader>
                    <CardBody display={"flex"} justifyContent={
                        haveForms ? null : "center"} alignItems={
                            haveForms ? null : "center"}
                    >
                        {loading && <Flex flexDir={"row"}
                            justify={"flex-end"} width={"100%"}>
                            <Spinner thickness="4px" size="xl"

                                emptyColor='gray.200'
                                color='blue.500' />
                        </Flex>}
                        {haveForms ? <VStack marginLeft={isMobile ? "2px" : 3} width={"100%"}>
                            {userForms?.map((data, index) => {
                                //                                console.log(data)
                                return <><Flex flexDirection={"row"} key={index}
                                    onClick={() => router.push(`/edit/${data['id']}`)}
                                    width={"inherit"}
                                    _hover={{
                                        backgroundColor: "gray.100"
                                    }}
                                    py={isMobile ? "2px" : 2}
                                    minH={"40px"}
                                    justify={"space-between"}>
                                    <Flex flexDir={"row"}
                                        verticalAlign={"center"}>
                                        <Image src="https://img.icons8.com/?size=48&id=69622&format=png"
                                            height={"36px"}
                                            width={"36px"} />

                                        <Flex flexDir={"column"} marginLeft={3}>
                                            <Text>
                                                {data['title']}
                                            </Text>
                                            {
                                                data.description && <Text
                                                    opacity={0.8}>{data.description}</Text>
                                            }
                                        </Flex>
                                    </Flex>
                                    <IconButton variant={"outline"} icon={<BsThreeDotsVertical />} borderRadius={20}>
                                        Edit
                                    </IconButton>
                                </Flex>
                                    <hr />
                                </>
                            })}
                        </VStack> : "You have not created any form!"}

                    </CardBody>
                    {!haveForms && <CardFooter justify={"center"}>
                        <Button minWidth={"30vh"}
                            color={"white"}
                            backgroundColor={"#202020"}
                            _hover={{
                                color: "black",
                                backgroundColor: "white",
                                borderWidth: 1,
                                borderColor: "black"
                            }}
                            onClick={() => {
                                selectTemplate(null)
                                onOpen()
                            }}>
                            Create now
                        </Button>
                    </CardFooter>}
                </Card>
            </Flex>
        </Box>

        <Modal key={"modal"} size={"xl"} onClose={onClose} isOpen={isOpen} isCentered  >
            <ModalOverlay
                bg='none'
                backdropFilter='auto'
                backdropBlur='5px' />
            <ModalContent minH={isMobile ? null : "50vh"}
            // justifyContent={"center"}
            // display={"flex"}
            >
                <ModalHeader>🎉 Create new form</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {template && <Flex flexDir={"row"}

                        backgroundColor={"ghostwhite"}
                        borderRadius={3}
                        paddingLeft={5}
                        color={"teal.800"}
                        marginBottom={4}
                        py={3}
                        boxShadow={"rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;"}
                        px={2} align={"center"}
                        justify={"space-between"}
                        //                        borderWidth={0.2}
                        //                      borderColor={"black"}
                        alignItems={"center"}
                        verticalAlign={"center"}
                    >
                        <Flex flexDir={"row"} marginLeft={5}>
                            <Image src={template['url']} height={"35px"} width={"45px"}
                                borderRadius={7}
                            />
                            <Flex marginLeft={3} flexDir={"column"}  >
                                <Text fontWeight={"bold"}>
                                    {template["name"]}
                                </Text>
                                <Text>
                                    {template['subtitle']}
                                </Text>
                            </Flex>
                        </Flex>

                        <IconButton colorScheme={"red"} variant={"outline"} icon={<IoMdClose size={20} color="red" />} size={"sm"}
                            borderRadius={50} onClick={() => {
                                selectTemplate(null);
                            }} />
                    </Flex>}
                    <Flex flexDir={"row"} align={"center"}>
                        <Box width={"20%"}>
                            <Image src="https://ouch-cdn2.icons8.com/9WuPvdeXHgHCM0kYPYs1mBEqZy2WkvUbr2TUosjCmIE/rs:fit:368:439/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNzAy/L2M1OTA1Zjk2LTVk/YTYtNDhmOS04MGYw/LTRjNmIyNzcyZTE5/Zi5zdmc.png"
                                height={"100px"} width={"80px"} />
                        </Box>
                        <Flex flexDir={"column"} marginLeft={4} width={"60%"}>
                            <Input title="Set form title"
                                placeholder="Enter form title"
                                minW={"30vh"}
                                size="lg"
                                onChange={e => setModalTitle(e.currentTarget.value)}
                            />

                            <Textarea title="Enter form description"
                                placeholder="Enter form description"
                                marginTop={2}
                                noOfLines={10}
                                size={"lg"}
                                minH={"10vh"}
                                onChange={e => setModalDescription(e.currentTarget.value)} />
                        </Flex>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme={"red"} onClick={onClose}>Cancel</Button>
                    <Button marginLeft={2} colorScheme={"teal"} onClick={async () => {
                        if (!modalTitle || !modalDescription) {
                            toast({
                                "status": "error",
                                "title": "Form title or description cannot be empty",
                                "isClosable": true,
                                position: "top",
                                duration: 3000
                            })
                            return;
                        }
                        toast({
                            title: "Creating form!",
                            status: "loading",
                            duration: 3000
                        });

                        const hash = await createNewForm(modalTitle,
                            modalDescription, user.uid, template?.pages);
                        await router.push(`/edit/${hash}`);
                    }}>Continue</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>)
}

function getServerSideProps() {

}