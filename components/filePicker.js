import { Modal, ModalContent, ModalCloseButton, Button, Heading, Flex, Box, Tabs, Image, Input, Grid, GridItem, TabPanel, Tab, TabPanels, TabList, ModalOverlay } from "@chakra-ui/react";
// import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useEffect, useState } from "react";

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch('Bcs4Iqudaov0oNwSF8uAagnPUx6CUOgK')

function GIFPage({onSelect}) {
    const [data, setData] = useState([]);
    const [value, setValue] = useState();
    const [offset, setOffset] = useState(20);

    useEffect(() => {
        gf.trending({ limit: 20 }).then(x => setData(x.data))
    }, []);
//    console.log(data);

    return <>
        <Box display={"flex"} flexDir={"column"}>
            <Flex justify={"space-between"}>
                <Heading size={"sm"}>
                    Trending
                </Heading>
                <Input  size={"sm"} maxW={"25vh"} borderRadius={10}
                onChange={async e => {
                    //setValue(e.currentTarget.value);
                    gf.search(e.currentTarget.value, { limit: 20 }).then(x => setData(x.data))
                }}
            />
            </Flex>
            <Grid templateColumns={"repeat(4, 1fr)"} mt={3} overflowY={"scroll"} maxH={"50vh"}>
                {data?.map((gif, index) => {
                    return <GridItem key={index}>
                        <Image width={120} height={120} src={gif.images.preview_gif.url} />
                    </GridItem>
                })}
            </Grid>
           {data && <Flex my={2} justify={"center"}>
                <Button onClick={async () => {
                    let dyt;
                    if (value) {
                        dyt = await gf.trending({ limit: 20, offset: offset + 20});
                    }
                    else {
                        dyt = await gf.search(value, { limit: 20, offset: offset + 20}); 
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
export default function FilePicker({onClose, isOpen, onSelect}) {
    const [tab, setTab] = useState(0);

    //    const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })

    return <Modal isOpen={isOpen} onClose={onClose}  size={"xl"} isCentered>
        <ModalOverlay />
        <ModalContent>
            <Box minH={"30vh"} maxH={"80vh"} minW={"100%"} py={"0.5rem"}>
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

                        </TabPanel>
                        <TabPanel>
                        </TabPanel>
                        <TabPanel>
                            {tab == 2 &&
                                <GIFPage onSelect={onSelect}/>
                            }
                        </TabPanel>
                    </TabPanels>
                </Tabs>


            </Box>
        </ModalContent>
    </Modal>
}