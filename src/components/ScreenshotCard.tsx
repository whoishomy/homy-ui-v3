import { Box, Badge, Image, Text, Stack, useColorModeValue } from '@chakra-ui/react';

export interface Screenshot {
  path: string;
  component: string;
  date: string;
  viewport: string;
  tags: string[];
  description?: string;
}

interface ScreenshotCardProps {
  screenshot: Screenshot;
}

export default function ScreenshotCard({ screenshot }: ScreenshotCardProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const tagBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box
      bg={cardBg}
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.02)', shadow: 'lg' }}
    >
      <Image
        src={`/api/screenshots/${screenshot.path}`}
        alt={`${screenshot.component} screenshot`}
        width="100%"
        height="auto"
        objectFit="cover"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="teal">
            {screenshot.viewport}
          </Badge>
          <Text ml={2} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.500">
            {screenshot.component}
          </Text>
        </Box>

        <Text mt={2} fontSize="sm" color="gray.500">
          {screenshot.date}
        </Text>

        {screenshot.description && (
          <Text mt={2} fontSize="sm">
            {screenshot.description}
          </Text>
        )}

        <Stack direction="row" mt={4} flexWrap="wrap" gap={2}>
          {screenshot.tags.map((tag) => (
            <Badge key={tag} bg={tagBg} borderRadius="full" px="2">
              {tag}
            </Badge>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
