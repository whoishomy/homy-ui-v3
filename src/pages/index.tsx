import { useState } from 'react';
import { Container, Box, Alert, Text, Heading } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import type { GetStaticProps } from 'next';
import GalleryGrid from '../components/GalleryGrid';
import TagFilter from '../components/TagFilter';
import { loadScreenshots } from '../lib/load-screenshots';
import type { Screenshot } from '../components/ScreenshotCard';

interface HomeProps {
  screenshots: Screenshot[];
  allTags: string[];
  hasIncompleteTagging: boolean;
}

export default function Home({ screenshots, allTags, hasIncompleteTagging }: HomeProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagSelect = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box display="flex" flexDirection="column" gap={8}>
        {hasIncompleteTagging && (
          <Box
            p={4}
            bg="orange.100"
            color="orange.800"
            borderRadius="md"
            display="flex"
            alignItems="center"
          >
            <WarningIcon />
            <Box ml={3}>
              <Heading size="sm">AI Tagging Incomplete</Heading>
              <Text mt={1}>
                Some screenshots are missing AI-generated descriptions or tags. Run the tagging
                script to complete the metadata.
              </Text>
            </Box>
          </Box>
        )}
        <TagFilter
          availableTags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
        />
        <GalleryGrid screenshots={screenshots} selectedTags={selectedTags} />
      </Box>
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { screenshots, hasIncompleteTagging } = await loadScreenshots();
  const allTags = Array.from(new Set(screenshots.flatMap((s) => s.tags))).sort();

  return {
    props: {
      screenshots,
      allTags,
      hasIncompleteTagging,
    },
    // Revalidate every hour
    revalidate: 3600,
  };
};
