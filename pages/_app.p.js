import theme from "@/src/theme";
import "../styles/globals.css";
import { ChakraBaseProvider, ChakraProvider} from '@chakra-ui/react'
import "../src/firebaseapp";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  }, [auth])

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} user={user}/>
    </ChakraProvider>
  )
}

export default MyApp