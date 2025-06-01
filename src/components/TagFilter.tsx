import { Box, Button, HStack, Text } from '@chakra-ui/react';

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onTagRemove: (tag: string) => void;
}

export default function TagFilter({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagRemove,
}: TagFilterProps) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2} mb={6}>
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Button
            key={tag}
            size="sm"
            variant={isSelected ? 'solid' : 'outline'}
            colorScheme={isSelected ? 'teal' : 'gray'}
            onClick={() => (isSelected ? onTagRemove(tag) : onTagSelect(tag))}
            rightIcon={isSelected ? <Text fontSize="lg">&times;</Text> : undefined}
          >
            {tag}
          </Button>
        );
      })}
    </Box>
  );
}
