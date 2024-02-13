import Header from "@/components/header";
import { VStack, HStack, Flex, Box, Text, Image, Card, Button, Heading, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo } from "react";

const Images = [
    {
        "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvH28TyD8zuWiQfm1H_FZCaYlKb6o8j9YicQ&usqp=CAU",
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
            <Box bg="#caf0f8"
            width={"inherit"}
            mx={"2rem"}
                //minH={"100vh"}
                 borderRadius={20}
                px={"4rem"} py="2rem"
                >
                <Heading fontSize={25}>
                    Templates
                </Heading>
                <HStack paddingTop={5} mx={"2rem"} gap={8}>
                    {Images.map(data => {
                        return <Card maxW={"180px"}>
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