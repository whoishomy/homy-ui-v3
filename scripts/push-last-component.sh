#!/bin/bash

# @raycast.schemaVersion 1
# @raycast.title Push Last Component
# @raycast.mode silent
# @raycast.packageName Homy Dev Tools
# @raycast.icon 📤
# @raycast.author Furkan
# @raycast.description Son oluşturulan bileşeni GitHub'a gönder

# === PATH AYARLARI ===
MEMORY_PATH="$HOME/Desktop/RunStart_Pack/memory/lastComponent.json"
PROJECT_PATH="$HOME/homy-ui-v3"
GIT_BRANCH="main"

# === GIT CHECK ===
if [ ! -d "$PROJECT_PATH/.git" ]; then
  echo "❌ HATA: $PROJECT_PATH bir Git deposu değil."
  exit 1
fi

# === JSON VAR MI ===
if [ ! -f "$MEMORY_PATH" ]; then
  echo "❌ HATA: $MEMORY_PATH bulunamadı."
  exit 1
fi

# === BİLEŞEN BİLGİLERİNİ AL ===
COMPONENT=$(jq -r '.component' "$MEMORY_PATH")
VERSION=$(jq -r '.version' "$MEMORY_PATH")
RELATIVE_PATH=$(jq -r '.path' "$MEMORY_PATH")

# === DOSYA YOLUNU HAZIRLA ===
TARGET_PATH="$PROJECT_PATH/src/$RELATIVE_PATH/${COMPONENT}.tsx"

if [ ! -f "$TARGET_PATH" ]; then
  echo "❌ HATA: $TARGET_PATH bulunamadı. Commit edilecek dosya yok."
  exit 1
fi

# === GIT OPERASYONLARI ===
cd "$PROJECT_PATH"
git add "$TARGET_PATH"
git commit -m "🚀 Add $COMPONENT ($VERSION)"
git push origin $GIT_BRANCH

echo "✅ $COMPONENT ($VERSION) başarıyla $GIT_BRANCH dalına pushlandı."