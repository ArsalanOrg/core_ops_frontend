import { Flex, useColorMode } from '@chakra-ui/react';
import React from 'react';
import { useGlobalState } from 'utils/GlobalState.ts'
import LanguageLocalizer from 'utils/LanguageLocalizer.js';
const Footer = () => {
    const { colorMode } = useColorMode();
    const { hideFooter } = useGlobalState();

    return (
      <Flex
        display={hideFooter ? 'none' : 'flex'}
        justify='space-between'
        align='center'
        p={4}
        bg={colorMode === 'dark' ? 'gray.800' : '#34496F'} // Set background color based on color mode
        color={colorMode === 'dark' ? 'white' : 'black'} // Set text color based on color mode
      >
        <p>{LanguageLocalizer['copyright']} &copy;</p>
      </Flex>
    )
};

export default Footer;
