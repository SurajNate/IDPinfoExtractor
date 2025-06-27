
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PenTool } from 'lucide-react';

interface SignatureDetectorProps {
  extractedText: string;
}

interface SignatureInfo {
  type: string;
  content: string;
  context: string;
  confidence: 'High' | 'Medium' | 'Low';
}

const SignatureDetector: React.FC<SignatureDetectorProps> = ({ extractedText }) => {
  const detectSignatures = (text: string): SignatureInfo[] => {
    const signatures: SignatureInfo[] = [];
    const lines = text.split('\n');

    // Enhanced patterns for signature detection
    const signaturePatterns = [
      {
        pattern: /signature[:\s]*(.{5,50})/gi,
        type: 'Direct Signature Reference',
        confidence: 'High' as const
      },
      {
        pattern: /signed[:\s]*(.{5,50})/gi,
        type: 'Signed Reference',
        confidence: 'High' as const
      },
      {
        pattern: /electronically signed by[:\s]*(.{5,50})/gi,
        type: 'Electronic Signature',
        confidence: 'High' as const
      },
      {
        pattern: /digitally signed by[:\s]*(.{5,50})/gi,
        type: 'Digital Signature',
        confidence: 'High' as const
      },
      {
        pattern: /authorized by[:\s]*(.{5,50})/gi,
        type: 'Authorization Signature',
        confidence: 'Medium' as const
      },
      {
        pattern: /([A-Z][a-z]+ [A-Z][a-z]+)\s*\n.*signature/gi,
        type: 'Name Above Signature Line',
        confidence: 'Medium' as const
      },
      {
        pattern: /witness[:\s]*(.{5,50})/gi,
        type: 'Witness Signature',
        confidence: 'Medium' as const
      },
      {
        pattern: /notarized by[:\s]*(.{5,50})/gi,
        type: 'Notary Signature',
        confidence: 'High' as const
      }
    ];

    signaturePatterns.forEach(({ pattern, type, confidence }) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[1].trim().length > 2) {
          const lineIndex = lines.findIndex(line => line.includes(match[0]));
          const context = lineIndex >= 0 ? 
            lines.slice(Math.max(0, lineIndex - 1), lineIndex + 2).join(' ') : 
            match[0];
          
          signatures.push({
            type,
            content: match[1].trim(),
            context: context.trim(),
            confidence
          });
        }
      });
    });

    // Enhanced signature block patterns
    const signatureBlockPatterns = [
      {
        pattern: /___+\s*\n\s*([A-Z][a-z]+ [A-Z][a-z]+)/g,
        type: 'Signature Block (Name Below Line)',
        confidence: 'High' as const
      },
      {
        pattern: /([A-Z][a-z]+ [A-Z][a-z]+)\s*\n\s*___+/g,
        type: 'Signature Block (Name Above Line)',
        confidence: 'High' as const
      },
      {
        pattern: /X\s*([A-Z][a-z]+ [A-Z][a-z]+)/g,
        type: 'X-Mark Signature',
        confidence: 'Medium' as const
      },
      {
        pattern: /\[signature\]\s*([A-Z][a-z]+ [A-Z][a-z]+)/gi,
        type: 'Bracketed Signature',
        confidence: 'Medium' as const
      }
    ];

    signatureBlockPatterns.forEach(({ pattern, type, confidence }) => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          signatures.push({
            type,
            content: match[1].trim(),
            context: match[0].trim(),
            confidence
          });
        }
      });
    });

    // Look for initials
    const initialsPattern = /\b([A-Z]\.[A-Z]\.?)\b/g;
    const initialsMatches = [...text.matchAll(initialsPattern)];
    initialsMatches.forEach(match => {
      signatures.push({
        type: 'Initials',
        content: match[1],
        context: match[0],
        confidence: 'Low' as const
      });
    });

    // Remove duplicates and sort by confidence
    const uniqueSignatures = signatures.filter((sig, index, arr) => 
      arr.findIndex(s => s.content === sig.content && s.type === sig.type) === index
    );

    return uniqueSignatures
      .sort((a, b) => {
        const confidenceOrder = { High: 3, Medium: 2, Low: 1 };
        return confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
      })
      .slice(0, 15);
  };

  if (!extractedText) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Signatures Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No document content to analyze for signatures</p>
        </CardContent>
      </Card>
    );
  }

  const signatures = detectSignatures(extractedText);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'bg-green-100 border-green-400 text-green-800';
      case 'Medium': return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'Low': return 'bg-gray-100 border-gray-400 text-gray-800';
      default: return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="h-5 w-5" />
          Signatures Detected ({signatures.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {signatures.length === 0 ? (
          <p className="text-gray-500 text-sm">No signatures detected in this document</p>
        ) : (
          <div className="space-y-3">
            {signatures.map((sig, index) => (
              <div key={index} className={`border-l-4 pl-4 py-2 rounded-r ${getConfidenceColor(sig.confidence)}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-1 rounded">
                    {sig.type}
                  </span>
                  <span className="text-xs font-bold">
                    {sig.confidence}
                  </span>
                </div>
                <p className="font-medium text-sm">{sig.content}</p>
                <p className="text-xs mt-1 italic">
                  Context: {sig.context.substring(0, 100)}...
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatureDetector;
