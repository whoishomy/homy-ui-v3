import { SimpleGrid, Container, Heading, Text } from '@chakra-ui/react';
import ScreenshotCard, { Screenshot } from './ScreenshotCard';

interface GalleryGridProps {
  screenshots: Screenshot[];
  selectedTags: string[];
}

export default function GalleryGrid({ screenshots, selectedTags }: GalleryGridProps) {
  const filteredScreenshots =
    selectedTags.length > 0
      ? screenshots.filter((screenshot) =>
          selectedTags.some((tag) => screenshot.tags.includes(tag))
        )
      : screenshots;

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={2}>Screenshot Gallery</Heading>
      <Text mb={8} color="gray.600">
        {filteredScreenshots.length} screenshots found
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8} mb={8}>
        {filteredScreenshots.map((screenshot) => (
          <ScreenshotCard key={screenshot.path} screenshot={screenshot} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
