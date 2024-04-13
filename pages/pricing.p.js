import Header, { Former } from "@/components/header";
import { Heading, Text, Flex, Card, CardBody, CardFooter, CardHeader, useMediaQuery } from "@chakra-ui/react";
import CompareALT from "../src/static/pricing.json";

export default function PricingPage({ user }) {
    const [isMobile] = useMediaQuery("(max-width: 600px)");

    return <>
        <Header shadow user={user} pricing={false}/>
        <main>
            <Flex justify={"center"}>
                <Heading bgGradient='linear(to-l, #7928CA, #FF0080)'
                    bgClip='text' fontSize={35}>
                    Pricing
                </Heading>
            </Flex>
            <Flex mt={isMobile ?  10: 25} flexDir={isMobile ? "column" :"row"} gap={4}
            justifyContent={"center"}>
                {CompareALT.map((data, index) => {
                    return <Card minW={"40vh"} key={index}
                    minH={isMobile ? null : "50vh"}>
                        <CardHeader>
                            {data.id === "Former" ? <Former style={{ color: "black" }} />
                                : <Heading size={"lg"} mb={5}>
                                    {data.id}</Heading>}
                            <hr />
                        </CardHeader>
                        <CardBody pt={0}>
                            {data.notes.map(line => {
                                return <>
                                {line["_"]}</>
                            })}
                        </CardBody>
                    </Card>
                })}
            </Flex>
        </main>
    </>
}