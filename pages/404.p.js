import { Image, Box, Flex, Text } from "@chakra-ui/react";
import Header from "@/components/header";

export default function Page404() {
    return <>
        <Box>
            <Header />
            <Box style={{
                backgroundColor: "#cfd7e6",
                minHeight: "100vh",
                display: "flex",
                paddingTop: 80,
                alignItems: "center",
                fontFamily: "monospace",
                flexDirection: "column"
            }}>
                <Text fontSize={50}>Page not found</Text>

                <Image src="https://ouch-cdn2.icons8.com/97FZIQqO8bIurJyO-9aW18Kjx-2SgF2xhTsOEZau1kw/rs:fit:368:325/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvNzM3/LzZhYjZlYzBjLTM3/MTUtNGExNC05NjNi/LTU2ZWVhZDdjZTRh/My5zdmc.png" />
            </Box>

        </Box>
    </>
}