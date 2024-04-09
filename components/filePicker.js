import { Modal, ModalContent, ModalCloseButton, Button, Heading, Flex, Box, Tabs, Image, Text, Input, Grid, GridItem, TabPanel, Tab, TabPanels, TabList, ModalOverlay } from "@chakra-ui/react";
// import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useEffect, useState } from "react";
import { FaGalacticRepublic } from "react-icons/fa";

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch('Bcs4Iqudaov0oNwSF8uAagnPUx6CUOgK')

function UserUploads() {
    const [data, setData] = useState();
    const [url, setUrl] = useState();

    useEffect(() => {
    }, []);

    return <Box>
        <Heading size={"md"} mb={2}>
            Upload an Image
        </Heading>
        <label for="ulimage"><Text
            color="blue.500">
            Upload image from local
        </Text>
        </label>
        <input type="file" hidden id="ulimage" name="ulimage" accept="image/png, image/jpeg" />

    </Box>
}

function GIFPage({ onSelect }) {
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const [trending, isTrending] = useState(true);
    const [offset, setOffset] = useState(20);

    useEffect(() => {
        gf.trending({ limit: 20 }).then(x => setData(x.data), isTrending(true))
    }, []);
    //    console.log(data);

    return <>
        <Box display={"flex"} flexDir={"column"}>
            <Flex justify={"space-between"}>
                <Heading size={"sm"}>
                    {trending ? "Trending" : "Results"}
                </Heading>
                <Input size={"sm"} maxW={"25vh"} borderRadius={10}
                    onChange={async e => {
                        if (e.currentTarget.value) {
                            gf.search(e.currentTarget.value, { limit: 20 }).then(x => setData(x.data), isTrending(false))
                        }
                        else {
                            gf.trending({ limit: 20 }).then(x => setData(x.data), isTrending(true))
                        }
                    }}
                />
            </Flex>
            <Grid templateColumns={"repeat(4, 1fr)"} mt={3} overflowY={"scroll"} maxH={"50vh"}>
                {data?.map((gif, index) => {
                    return <GridItem key={index} onClick={() => {
                        console.log(gif)
                        if (onSelect) {

                            onSelect({
                                "url": gif.images.preview_gif.url,
                                "height": gif.images.preview_gif.height,
                                "width": gif.images.preview_gif.width
                            })
                        }
                    }}>
                        <Image width={120} height={120} src={gif.images.preview_gif.url} />
                    </GridItem>
                })}
            </Grid>
            {data && <Flex my={2} justify={"center"}>
                <Button onClick={async () => {
                    let dyt; if (value) {
                        dyt = await gf.search(value, { limit: 20, offset: offset + 20 });
                        isTrending(false);
                    }
                    else {
                        dyt = await gf.trending({ limit: 20, offset: offset + 20 });
                        isTrending(true)
                    }
                    data.push(...dyt.data);
                    setData([...data]);
                    setOffset(offset + 20);
                }}>
                    Load More
                </Button>
            </Flex>}
        </Box>
    </>
}

function ImagePicker({onSelect}) {
    const [input, setInput] = useState('fruits');
    const [data, setData] = useState();

    async function fetchData() {
        const req = await fetch(`https://photos.icons8.com/api/frontend/v1/images?fields=id,title,slug,as,thumb1x,thumb1xWebp,thumb2x,thumb2xWebp,width,height,croppedWithAI,shortTitles(title,type),sourceId&page=1&per_page=30&sort_by=rising&filter=all&query=${input}&locale=en-US`);
        const resp = await req.json()
        setData(resp['images']);
    }

    useEffect(() => {
        fetchData()
    }, [input])

    return <Box
    overflowY={"scroll"} maxH={"60vh"}>
        <Input mx={3} value={input} onChange={e => setInput(e.currentTarget.value)} 
        />

        <Grid templateColumns={"repeat(3, 1fr)"} mt={3}>
            {data?.map((gif, index) => {
                return <GridItem key={index} onClick={() => onSelect({
                    "url": gif.thumb1x.url,
                    "height": gif.thumb1x.height,
                    "width": gif.thumb1x.width
                })}>
                    <Image width={200} height={200} src={gif.thumb1x.url} />
                </GridItem>
            })}
        </Grid>
    </Box>
}

export default function FilePicker({ onClose, isOpen, onSelect }) {
    const [tab, setTab] = useState(0);
    console.log(tab)
    //    const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })

    return <Modal isOpen={isOpen} onClose={onClose} size={"xl"} isCentered>
        <ModalOverlay />
        <ModalContent>
            <Box minH={"70vh"} maxH={"80vh"} minW={"100%"} py={"0.5rem"}>
                <Tabs onChange={(e) => setTab(e)}>
                    <TabList>
                        <Tab value={"uploads"}>
                            Your Uploads
                        </Tab>
                        <Tab value={"images"}>
                            Images
                        </Tab>
                        <Tab value={"animation"}>Animation
                        </Tab>

                        <Tab value={"gifs"}>
                            GIFs
                        </Tab>

                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            {tab === 0 && <UserUploads />}
                        </TabPanel>
                        <TabPanel>
                            {
                                tab === 1 && <ImagePicker onSelect={onSelect} />
                            }
                        </TabPanel>
                        <TabPanel>

                        </TabPanel>
                        <TabPanel>
                            {tab === 3 &&
                                <GIFPage onSelect={onSelect} />
                            }
                        </TabPanel>
                    </TabPanels>
                </Tabs>


            </Box>
        </ModalContent>
    </Modal>
}