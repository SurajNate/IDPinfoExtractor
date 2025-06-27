
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExtractedTextProps {
  text: string;
  isLoading: boolean;
}

const ExtractedText: React.FC<ExtractedTextProps> = ({ text, isLoading }) => {
  // Copy text to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard!');
      console.log('Text copied to clipboard');
    } catch (error) {
      console.error('Failed to copy text:', error);
      toast.error('Failed to copy text');
    }
  };

  // Download text as file
  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
    console.log('Text file downloaded');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-lg font-medium">Processing document...</p>
        <p className="text-sm">Extracting text using Gemini AI</p>
      </div>
    );
  }

  // Empty state
  if (!text) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <FileText className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium text-gray-600">No text extracted yet</p>
        <p className="text-sm">Upload a file and click "Extract Text" to see results</p>
      </div>
    );
  }

  // Text content state
  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button
          onClick={downloadText}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      {/* Extracted text content */}
      <Card className="p-4 bg-gray-50 border-2 border-gray-200">
        <div className="max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
            {text}
          </pre>
        </div>
      </Card>

      {/* Character count */}
      <div className="text-xs text-gray-500 text-right">
        {text.length} characters extracted
      </div>
    </div>
  );
};

export default ExtractedText;
