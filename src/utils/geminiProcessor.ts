import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Hardcoded API key
const GOOGLE_AI_API_KEY = 'No Dear use Your Key Please ☺ ☺ ☺';

// Model configuration matching your Python setup
const MODEL_CONFIG = {
  temperature: 0.2,
  topP: 1,
  topK: 32,
  maxOutputTokens: 4096,
};

// Safety settings matching your Python setup
const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH", 
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];

/**
 * Convert file to format compatible with Gemini AI
 * @param file - File object to process
 * @returns Promise with file data in Gemini format
 */
const fileToGenerativePart = async (file: File): Promise<Part> => {
  console.log('Converting file to Gemini format:', file.name, file.type);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        const base64Data = (result as string).split(',')[1]; // Remove data URL prefix
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
        console.log('File converted successfully');
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Process file using Gemini-1.5-flash model with hardcoded API key
 * @param file - File to process 
 * @returns Promise with extracted text
 */
export const processFile = async (file: File): Promise<string> => {
  console.log('Starting Gemini AI processing for:', file.name);
  
  try {
    // Initialize Google Generative AI with hardcoded API key
    const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
    
    // Get the Gemini-1.5-flash model with configuration
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: MODEL_CONFIG,
      safetySettings: SAFETY_SETTINGS as any,
    });

    // System prompt for document understanding (matching your Python setup)
    const systemPrompt = `
      You are a specialist in comprehending receipts, invoices, and documents.
      Input images or documents will be provided to you,
      and your task is to extract and return all textual content from the input.
      Convert the data into a well-structured, readable format.
      If it's an invoice or receipt, organize the information clearly with proper formatting.
    `;

    // User prompt for text extraction
    const userPrompt = `
      Please extract all textual content from this document.
      If it's an invoice or receipt, convert the data into a well-organized JSON format 
      with appropriate tags for items, amounts, dates, vendor information, etc.
      If it's a regular document, extract all the text content in a readable format.
      Maintain the structure and hierarchy of the information.
    `;

    // Convert file to Gemini format
    const imagePart = await fileToGenerativePart(file);

    // Create the input prompt array with proper types
    const inputPrompt: (string | Part)[] = [systemPrompt, imagePart, userPrompt];

    console.log('Sending request to Gemini AI...');
    
    // Generate content using Gemini AI
    const result = await model.generateContent(inputPrompt);
    const response = await result.response;
    const extractedText = response.text();

    console.log('Gemini AI processing completed successfully');
    console.log('Extracted text length:', extractedText.length);
    
    return extractedText;
    
  } catch (error) {
    console.error('Error in Gemini AI processing:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        throw new Error('Invalid API key. Please check your Google AI API key.');
      } else if (error.message.includes('QUOTA')) {
        throw new Error('API quota exceeded. Please check your usage limits.');
      } else if (error.message.includes('PERMISSION')) {
        throw new Error('Permission denied. Please check your API key permissions.');
      } else {
        throw new Error(`Processing failed: ${error.message}`);
      }
    } else {
      throw new Error('Unknown error occurred during processing');
    }
  }
};
