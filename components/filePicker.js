import { Modal, ModalContent, ModalCloseButton, Heading, Flex, Box, Tabs, Image, Input, Grid, GridItem, TabPanel, Tab, TabPanels, TabList, ModalOverlay } from "@chakra-ui/react";
// import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { useEffect, useState } from "react";

// use @giphy/js-fetch-api to fetch gifs, instantiate with your api key
const gf = new GiphyFetch('Bcs4Iqudaov0oNwSF8uAagnPUx6CUOgK')

function GIFPage() {
    const [data, setData] = useState();
    const [value, setValue] = useState();

    useEffect(() => {
        gf.trending({ limit: 10 }).then(setData)
    }, []);
    console.log(data);

    return <>
        <Box display={"flex"} flexDir={"column"}>
            <Flex>
                <Heading size={"sm"}>
                    Trending
                </Heading>
                <Input 
                onChange={e => setValue(e.currentTarget.value)}/>
            </Flex>
            <Grid templateColumns={"repeat(4, 1fr)"} mt={3}>
                {data?.data.map(gif => {
                    return <GridItem>
                        <Image width={120} height={120} src={gif.images.preview_gif.url} />
                    </GridItem>
                })}
            </Grid>
        </Box>
    </>
}
export default function FilePicker() {
    const [tab, setTab] = useState(0);

    //    const fetchGifs = (offset) => gf.trending({ offset, limit: 10 })

    return <Modal isOpen size={"xl"} isCentered>
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
                                <GIFPage />
                            }
                        </TabPanel>
                    </TabPanels>
                </Tabs>


            </Box>
        </ModalContent>
    </Modal>
}