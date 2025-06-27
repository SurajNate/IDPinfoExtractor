
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Key, AlertCircle } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, onApiKeyChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-blue-600" />
        <Label htmlFor="apiKey" className="text-lg font-semibold text-gray-900">
          Google AI API Key
        </Label>
      </div>
      
      <div className="space-y-3">
        <Input
          id="apiKey"
          type="password"
          placeholder="Enter your Google AI API key (AIza...)"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="font-mono text-sm h-12 px-4 border-2 border-gray-200 focus:border-blue-500"
        />
        
        <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">API Key Required</p>
            <p>
              You need a Google AI API key to use the Gemini-1.5-flash model. 
              Get yours from the{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-amber-900 font-medium"
              >
                Google AI Studio
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;
