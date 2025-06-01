import { useState } from 'react';
import {
  Container,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
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
      <VStack spacing={8} align="stretch">
        {hasIncompleteTagging && (
          <Alert status="warning">
            <AlertIcon />
            <AlertTitle>AI Tagging Incomplete</AlertTitle>
            <AlertDescription>
              Some screenshots are missing AI-generated descriptions or tags. Run the tagging script
              to complete the metadata.
            </AlertDescription>
          </Alert>
        )}
        <TagFilter
          availableTags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
          onTagRemove={handleTagRemove}
        />
        <GalleryGrid screenshots={screenshots} selectedTags={selectedTags} />
      </VStack>
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
