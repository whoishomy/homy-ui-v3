#!/bin/bash

SPRINT_TAG="Sprint-24.15"
TARGET_DIR="docs/screenshots/sprints/$SPRINT_TAG"
README_FILE="$TARGET_DIR/README.md"

# README.md yoksa oluştur
if [ ! -f "$README_FILE" ]; then
  echo "# 📸 $SPRINT_TAG Screenshot Log" > "$README_FILE"
  echo "" >> "$README_FILE"
fi

# PNG dosyalarını sırayla işle
find "$TARGET_DIR" -name '*.png' | while read -r FILE; do
  FILENAME=$(basename "$FILE")
  COMPONENT=$(echo "$FILENAME" | awk -F '_' '{print $NF}' | sed 's/.png//')
  ISSUE_ID=$(echo "$FILENAME" | cut -d '#' -f2 | cut -d '_' -f1)

  MARKDOWN="- 🖼️ \`$FILENAME\` – [${COMPONENT} Bileşeni](../../src/components/**/${COMPONENT}.tsx)"

  # Satır daha önce eklenmemişse yaz
  if ! grep -Fq "$FILENAME" "$README_FILE"; then
    echo "$MARKDOWN" >> "$README_FILE"
    echo "Eklendi: $MARKDOWN"
  fi
done

echo "✅ README.md başarıyla güncellendi: $README_FILE"