
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Stamp } from 'lucide-react';

interface StampDetectorProps {
  extractedText: string;
}

interface StampInfo {
  type: string;
  content: string;
  context: string;
}

const StampDetector: React.FC<StampDetectorProps> = ({ extractedText }) => {
  const detectStamps = (text: string): StampInfo[] => {
    const stamps: StampInfo[] = [];
    const lines = text.split('\n');

    // Patterns for stamp detection
    const stampPatterns = [
      {
        pattern: /stamp[:\s]*(.{5,50})/gi,
        type: 'Generic Stamp'
      },
      {
        pattern: /(official seal|seal|stamped)/gi,
        type: 'Official Seal'
      },
      {
        pattern: /(notary|notarized|notarization)/gi,
        type: 'Notary Stamp'
      },
      {
        pattern: /(certified|certification)/gi,
        type: 'Certification Stamp'
      },
      {
        pattern: /(approved|approval)/gi,
        type: 'Approval Stamp'
      },
      {
        pattern: /(received|filing|filed)/gi,
        type: 'Filing Stamp'
      },
      {
        pattern: /(paid|payment)/gi,
        type: 'Payment Stamp'
      },
      {
        pattern: /([A-Z]{2,}\s+[A-Z]{2,}\s+[A-Z]{2,})/g,
        type: 'Official Marking'
      }
    ];

    stampPatterns.forEach(({ pattern, type }) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const matchText = match[1] || match[0];
        if (matchText && matchText.trim().length > 2) {
          const lineIndex = lines.findIndex(line => line.includes(match[0]));
          const context = lineIndex >= 0 ? 
            lines.slice(Math.max(0, lineIndex - 1), lineIndex + 2).join(' ') : 
            match[0];
          
          stamps.push({
            type,
            content: matchText.trim(),
            context: context.trim()
          });
        }
      });
    });

    // Look for date-based stamps (common in official documents)
    const dateStampPattern = /\b(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s+\d{1,2}\s+\d{4}\b/g;
    const dateMatches = [...text.matchAll(dateStampPattern)];
    dateMatches.forEach(match => {
      stamps.push({
        type: 'Date Stamp',
        content: match[0],
        context: match[0]
      });
    });

    // Look for reference numbers (often stamped)
    const refNumberPattern = /(?:ref|reference|file|doc|document)[\s#:]*([A-Z0-9\-]{6,})/gi;
    const refMatches = [...text.matchAll(refNumberPattern)];
    refMatches.forEach(match => {
      if (match[1]) {
        stamps.push({
          type: 'Reference Stamp',
          content: match[1],
          context: match[0]
        });
      }
    });

    // Remove duplicates and limit results
    const uniqueStamps = stamps.filter((stamp, index, arr) => 
      arr.findIndex(s => s.content === stamp.content && s.type === stamp.type) === index
    );

    return uniqueStamps.slice(0, 10);
  };

  if (!extractedText) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stamp className="h-5 w-5" />
            Stamps Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No document content to analyze for stamps</p>
        </CardContent>
      </Card>
    );
  }

  const stamps = detectStamps(extractedText);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stamp className="h-5 w-5" />
          Stamps & Seals Detected ({stamps.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {stamps.length === 0 ? (
          <p className="text-gray-500 text-sm">No stamps or seals detected in this document</p>
        ) : (
          <div className="space-y-3">
            {stamps.map((stamp, index) => (
              <div key={index} className="border-l-4 border-green-400 pl-4 py-2 bg-green-50 rounded-r">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium bg-green-200 px-2 py-1 rounded">
                    {stamp.type}
                  </span>
                </div>
                <p className="font-medium text-sm text-gray-800">{stamp.content}</p>
                <p className="text-xs text-gray-600 mt-1 italic">
                  Context: {stamp.context.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StampDetector;
