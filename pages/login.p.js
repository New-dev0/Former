import Header from "@/components/header";
import { Button, Image, Link, Input, Box, HStack, Text, Heading, Flex, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { useMediaQuery, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithCredential, SignInMethod, signInWithRedirect } from "firebase/auth";

export default function LoginPage({ login = true, user }) {
    const [isMobile] = useMediaQuery("(max-width: 600px)");
    const toast = useToast();
    const router = useRouter();

    useMemo(() => {
        if (user) {
            router.push("/dashboard");
        }        
    }, [user]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function GoogleLogin() {
        const auth = getAuth();
    
        const provider = new GoogleAuthProvider();
        if (isMobile) {
            await signInWithPopup(auth, provider);
        }
        else {
            await signInWithRedirect(auth, provider);
        }
        if (auth.currentUser) {
            toast({
                title: `Signed in as ${auth.currentUser?.displayName}`,
                variant: "top-accent"
            })
        }
    }

    return (<>
        <Header showLogin={false} />
        <main style={{ paddingTop: "4rem" }}
        >

            <Flex flexDir={"row"} justifyContent={"center"}>
                {!isMobile && <Image src="https://ouch-cdn2.icons8.com/RIrlQaGTTU9pAYI20kXNOEe08nhy8kk3THnCEjaDhQ4/rs:fit:368:386/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNTk1/LzZlMTViN2ZhLTMx/MDgtNDliNS04NzQ5/LTQzYTI5NTc5YmMw/OC5zdmc.png"
                    height={350} width={350} marginRight={50} />
                }
                <Card style={{ minHeight: "60vh", minWidth: isMobile ? "90%" : "50%" }} variant={"elevated"} >
                    <CardHeader alignSelf={"center"} fontFamily={"monospace"}>
                        <Heading size='lg'>{login ? "Login" : "Create Account"}</Heading>
                    </CardHeader>
                    <CardBody>
                        <Flex flexDir={"column"} style={{ minWidth: "80%" }}>
                            <Input placeholder="Enter Email" size={"lg"}
                                onChange={(e) => setEmail(e.target.value)} />
                            <Input placeholder="Enter Password" size={"lg"} style={{
                                marginTop: 30
                            }} marginBottom={20}
                                onChange={(e) => setPassword(e.target.value)} />


                        </Flex>
                        <hr />
                        <HStack marginTop={3} justify={"center"}>
                            <Button leftIcon={<FcGoogle />} px={10} py={5} onClick={GoogleLogin}>
                                Sign in with Google
                            </Button>

                        </HStack>
                    </CardBody>
                    <CardFooter>
                        <Link href={login ? "/create-account" : "/login"}>
                            {login ? "Don't have an account? Sign Up" : "Already have a account? Sign In"}
                        </Link>
                    </CardFooter>
                </Card>
            </Flex>
            <Flex>

            </Flex>

        </main>
    </>)
}