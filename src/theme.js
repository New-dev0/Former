import { extendTheme, extendBaseTheme, withDefaultColorScheme } from '@chakra-ui/react'
import {Button, Input} from "@chakra-ui/react";
import { Toast } from '@chakra-ui/react'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme(
    withDefaultColorScheme({colorScheme: "gray"})
);

export default theme