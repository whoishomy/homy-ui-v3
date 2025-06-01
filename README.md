# 🧹 CleanShot AI Toolkit

AI-powered screenshot management toolkit for CleanShot X with Notion integration.

[![CI](https://github.com/whoishomy/cleanshot-ai-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/whoishomy/cleanshot-ai-toolkit/actions/workflows/ci.yml)
[![Vercel](https://vercelbadge.vercel.app/api/runboyrun/cleanshot-ai-toolkit)](https://cleanshot-ai-toolkit.vercel.app)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)
[![Notion](https://img.shields.io/badge/Notion-000000?logo=notion&logoColor=white)](https://developers.notion.com)

## ✨ Features

- 📸 **Screenshot Management**: Automated organization of CleanShot screenshots
- 🤖 **AI Tagging**: Smart component tagging using OpenAI
- 📤 **Notion Export**: Seamless integration with Notion databases
- 🧪 **Testing**: Comprehensive test suite for screenshot management
- 🎨 **Gallery**: Visual showcase of your component library

## 🚀 Quick Start

1. Clone the repository:

```bash
git clone https://github.com/whoishomy/cleanshot-ai-toolkit.git
cd cleanshot-ai-toolkit
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

4. Run the toolkit:

```bash
# Start the gallery
npm run dev

# Tag screenshots with AI
npm run tag

# Export to Notion
npm run export

# Complete processing pipeline
npm run process
```

## 🛠️ Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `NOTION_TOKEN`: Notion integration token
- `NOTION_DATABASE_ID`: Target Notion database ID
- `SCREENSHOTS_DIR`: Screenshots directory (default: docs/screenshots)
- `CLEANSHOT_DIR`: CleanShot directory (default: ~/Pictures/CleanShot)

### Vercel Deployment

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy to Vercel:

```bash
vercel
```

3. Configure environment variables in Vercel:
   - Go to Project Settings → Environment Variables
   - Add the following variables:
     - `OPENAI_API_KEY`
     - `NOTION_TOKEN`
     - `NOTION_DATABASE_ID`

### GitHub Actions Setup

To enable CI/CD, add the following secrets to your GitHub repository:

1. Go to your repository's Settings
2. Navigate to Secrets and Variables → Actions
3. Add the following secrets:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NOTION_TOKEN`: Your Notion integration token
   - `NOTION_DATABASE_ID`: Your Notion database ID

### Notion Database Schema

Required properties for the Notion database:

- `Component` (Title)
- `Description` (Text)
- `Tags` (Multi-select)
- `Screenshot Count` (Number)
- `Last Updated` (Date)

## 📚 Scripts

- `npm run dev`: Start the gallery
- `npm run tag`: Run AI tagging on screenshots
- `npm run export`: Export to Notion database
- `npm run process`: Complete screenshot processing pipeline
- `npm test`: Run test suite
- `npm run build`: Build TypeScript files

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CleanShot X](https://cleanshot.com/) for the amazing screenshot tool
- [OpenAI](https://openai.com/) for AI capabilities
- [Notion API](https://developers.notion.com/) for database integration
- [Vercel](https://vercel.com) for hosting the gallery
