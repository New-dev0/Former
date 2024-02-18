import Header, { Former } from "@/components/header";
import { Heading, Text, Flex, Card, CardBody, CardFooter, CardHeader } from "@chakra-ui/react";
import CompareALT from "../src/static/pricing.json";

export default function PricingPage({ user }) {

    return <>
        <Header shadow user={user} pricing={false}/>
        <main>
            <Flex justify={"center"}>
                <Heading bgGradient='linear(to-l, #7928CA, #FF0080)'
                    bgClip='text' fontSize={35}>
                    Pricing
                </Heading>
            </Flex>
            <Flex mt={7} flexDir={"row"} gap={4}>
                {CompareALT.map((data, index) => {
                    return <Card minW={"40vh"} key={index}>
                        <CardHeader>
                            {data.id === "Former" ? <Former style={{ color: "black" }} />
                                : <Heading size={"lg"} mb={5}>
                                    {data.id}</Heading>}
                            <hr />
                        </CardHeader>
                        <CardBody>
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