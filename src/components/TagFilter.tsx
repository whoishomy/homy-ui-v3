import { HStack, Tag, TagLabel, TagCloseButton, Wrap } from '@chakra-ui/react';

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
    <Wrap spacing={2} mb={6}>
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Tag
            key={tag}
            size="md"
            borderRadius="full"
            variant={isSelected ? 'solid' : 'subtle'}
            colorScheme={isSelected ? 'teal' : 'gray'}
            cursor="pointer"
            onClick={() => (isSelected ? onTagRemove(tag) : onTagSelect(tag))}
          >
            <TagLabel>{tag}</TagLabel>
            {isSelected && <TagCloseButton onClick={() => onTagRemove(tag)} />}
          </Tag>
        );
      })}
    </Wrap>
  );
}
