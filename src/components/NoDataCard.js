import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import LanguageLocalizer from 'utils/LanguageLocalizer';
const NoDataCard = () => {

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh" // Full height of the parent container
            bg="gray.100"
        >
            <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                padding="4"
                textAlign="center"
                border="1px solid"
                borderColor="gray.300"
            >
                <Text fontSize="lg" color="gray.600">
                    {LanguageLocalizer["no_data_to_display"]}
                </Text>
            </Box>
        </Box>
    );
}

export default NoDataCard;