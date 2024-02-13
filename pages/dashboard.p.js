import Header from "@/components/header";
import { VStack, HStack, Flex, Box, Text, Image, Card, Button, Heading, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

const Images = [
    {
        "url": "https://photo-cdn2.icons8.com/lMlU7rY8f6ZSkUscxZF9gCO9R5uHWvBmHWwT9QHpMEM/rs:fit:576:385/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5h/c3NldHMvYXNzZXRz/L3NhdGEvb3JpZ2lu/YWwvNjkwLzMwZWUz/ZGQ1LTYxZjYtNGM5/NS1hYjk3LTU3N2Q5/MjJhZWRkMS5qcGc.webp",
        "name": "Job Application",
        "subtitle": ""
    },
    {
        "url": "https://photo-cdn2.icons8.com/VDP2KyNiOTXjRhv5ZVTjyvumoJqXUl6decJitMYCWxo/rs:fit:576:384/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi8xMzBkNzU5NDRm/YWE0NDk2OThkNjVm/Yjg4NTBjNTE4Ni5q/cGc.webp",
        "name": "Business Meet",
        "subtitle": ""
    },
    {
        "url": "https://photo-cdn2.icons8.com/rkVQ_TNNDBpEM5X3kEiUhs6MQ_pQ-zTv8zu4k_kxJrE/rs:fit:576:423/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi81OThhNTNjZTUx/ODU0NTM5OGYxYzI2/OGUxM2Q4NzkxMy5q/cGc.webp",
        "name": "Ask Product requirements to your customers!",
        "subtitle": ""
    },
    {
        "url": "https://photo-cdn2.icons8.com/vl9E3ZbrcUk9u4oMJim8-0aa39d9dc1j3gfHyjcMIp0/rs:fit:576:384/czM6Ly9pY29uczgu/bW9vc2UtcHJvZC5l/eHRlcm5hbC9hMmE0/Mi83Y2U5MzUxNGUw/Y2Y0N2FmODRkZDA5/NTA0ZmMzMjBiNi5q/cGc.webp",
        "name": "Plan a trip with friends!",
        "subtitle": ""
    }
];

export default function Dashboard({ user }) {
    const router = useRouter();

    useMemo(() => {
        if (user === null && !user) {
            router.push("/login");
        }
    }, [user]);


    return (<>
        <Header showOptions={false} user={user} >
            <Button marginTop={2}>
                Create Form
            </Button>
        </Header>
        <main style={{
            padding: 0
        }}>
            <Box bg="#35374d" //</main> #caf0f8"
            width={"inherit"}
            mx={"2rem"}
                //minH={"100vh"}
                 borderRadius={20}
                px={"4rem"} py="2rem"
                >
                <Heading fontSize={20} color="white">
                    Templates
                </Heading>
                <HStack paddingTop={5} mx={"2rem"} gap={8}>
                    {Images.map(data => {
                        return <Card maxW={"180px"} height={"185px"}
                        borderTopRadius={10}
                        >
                            <CardBody style={{ padding: 0 }}>
                                <Image
                                    bgRepeat={"repeat"}
                                    borderTopRadius={10}

                                    //                                   objectFit="contain"
                                    //                                   maxW={{ base: '100%', sm: '200px' }}
                                    maxH={"130px"}
                                    src={data.url}
                                    alt={data.name}
                                />

                            </CardBody>
                            <CardFooter style={{padding: 10, textAlign:"match-parent"}}>
                                <p style={{ // fontFamily: "cursive", 
                                fontSize: 13}}>
                                    {data.name}
                                </p>
                            </CardFooter>
                        </Card>
                    })}
                </HStack>
            </Box>
        </main>
    </>)
}