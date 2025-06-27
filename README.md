
# AI Document Extractor

An intelligent web application that extracts textual data from images, PDFs, and invoices using Google's Gemini-1.5-flash AI model. Perfect for digitizing receipts, invoices, and documents.

## Features

- 📄 Extract text from images (PNG, JPG, JPEG, WEBP)
- 📋 Process PDF documents
- 🧾 Handle invoices and receipts with structured output
- 🎯 Real-time document preview
- 🚀 Fast processing with Google's Gemini-1.5-flash model
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **AI Processing**: Google Generative AI (Gemini-1.5-flash)
- **File Handling**: react-dropzone
- **PDF Viewing**: react-pdf

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn package manager

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. API Key Configuration

**Location of API Key**: The Google AI API key is hardcoded in the file:
```
src/utils/geminiProcessor.ts
```

**Current API Key**: `AIzaSyBhwQX2LAHJ1TXttmYKLkXG-JbUgar30dE`

To change the API key:
1. Open `src/utils/geminiProcessor.ts`
2. Find the line: `const GOOGLE_AI_API_KEY = 'AIzaSyBhwQX2LAHJ1TXttmYKLkXG-JbUgar30dE';`
3. Replace the key with your own Google AI API key

### 4. Getting Your Own Google AI API Key

If you need to get your own API key:
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Replace the hardcoded key in `src/utils/geminiProcessor.ts`

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

1. **Upload a Document**: 
   - Drag and drop a file onto the upload area, or
   - Click the upload area to select a file
   - Supported formats: Images (PNG, JPG, JPEG, WEBP), PDFs, Text files

2. **Extract Text**:
   - After uploading, click the "Extract Text" button
   - The AI will process your document and extract all textual content
   - For invoices/receipts, it provides structured JSON output

3. **View Results**:
   - The original document appears in the left panel
   - Extracted text appears in the right panel
   - You can copy the extracted text for use elsewhere

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── ApiKeyInput.tsx     # API key input component (not used)
│   ├── FileUpload.tsx      # File upload component
│   ├── FileViewer.tsx      # Document preview component
│   └── ExtractedText.tsx   # Text display component
├── pages/
│   ├── Index.tsx           # Main application page
│   └── NotFound.tsx        # 404 page
├── utils/
│   └── geminiProcessor.ts  # 🔑 API key location & AI processing logic
├── hooks/
└── lib/
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

This project can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

For deployment via Lovable:
1. Open your project in Lovable
2. Click "Share" → "Publish"
3. Your app will be live with a public URL

## API Limits and Costs

- The Google AI API has usage limits and may incur costs
- Monitor your usage in the [Google Cloud Console](https://console.cloud.google.com/)
- The current API key is shared, so please use responsibly

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**:
   - Check that your API key is correctly set in `src/utils/geminiProcessor.ts`
   - Ensure the API key has proper permissions

2. **"API quota exceeded" error**:
   - You've hit the API usage limit
   - Wait for the quota to reset or upgrade your plan

3. **File upload issues**:
   - Check file size (max 10MB)
   - Ensure file format is supported

4. **Build errors**:
   - Delete `node_modules/` and run `npm install` again
   - Clear browser cache and restart dev server

### Getting Help

- Check the browser console for error messages
- Review the network tab for API request details
- Ensure all dependencies are properly installed

## License

This project is built with Lovable and uses various open-source libraries. Please check individual package licenses for specific terms.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This application processes documents using AI. Always ensure you have permission to process any documents you upload, especially if they contain sensitive information.
