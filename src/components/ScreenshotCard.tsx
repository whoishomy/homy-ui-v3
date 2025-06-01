import { Box, Badge, Image, Text, Stack } from '@chakra-ui/react';

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
  return (
    <Box
      bg="white"
      _dark={{ bg: 'gray.800' }}
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
    >
      <Image
        src={`/api/screenshots/${screenshot.path}`}
        alt={`${screenshot.component} screenshot`}
        width="100%"
        height="auto"
        objectFit="cover"
      />

      <Box p={6}>
        <Box display="flex" alignItems="baseline">
          <Badge colorScheme="teal" borderRadius="full" px={2}>
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

        <Box display="flex" flexWrap="wrap" gap={2} mt={4}>
          {screenshot.tags.map((tag) => (
            <Badge key={tag} bg="gray.100" _dark={{ bg: 'gray.700' }} borderRadius="full" px={2}>
              {tag}
            </Badge>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
