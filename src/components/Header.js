import { Box, Flex, HStack, Text, useColorMode, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useGlobalState } from 'utils/GlobalState.ts';
import LanguageLocalizer from 'utils/LanguageLocalizer.js';
const Header = () => {
  const { colorMode } = useColorMode();
  const { title, showHint } = useGlobalState();

  useEffect(() => {
  }, [title, showHint])

  return (
    <Flex
      justify="space-between"
      align="center"
      p={4}
      bg={colorMode === 'dark' ? 'gray.800' : 'gray.100'}
      color={colorMode === 'dark' ? 'white' : 'black'}
    >

      <Text fontSize="xl" flex={1}> {LanguageLocalizer["project_title"]} / {title} </Text>

      {showHint &&
        <VStack flex={0.1} align="flex-start" fontSize="0.8rem" style={{ "text-wrap": "nowrap" }}>
          <HStack>
            <Box backgroundColor="#ccffcc" boxSize="12px" borderRadius="2px"></Box> <Text>{LanguageLocalizer["low_urgency"]}</Text>
          </HStack>
          <HStack>
            <Box backgroundColor="#ede2ab" boxSize="12px" borderRadius="2px"></Box> <Text>{LanguageLocalizer["mid_urgency"]}</Text>
          </HStack>
          <HStack>
            <Box backgroundColor="#ff9fa8" boxSize="12px" borderRadius="2px"></Box> <Text>{LanguageLocalizer["high_urgency"]}</Text>
          </HStack>
        </VStack>
      }

      {/* <IconButton
        aria-label="Toggle Dark Mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
      /> */}
    </Flex>
  );
};

export default Header;
