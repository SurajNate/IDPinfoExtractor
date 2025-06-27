
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, User, Calendar, DollarSign, Building, BookOpen } from 'lucide-react';

interface DocumentSummaryProps {
  extractedText: string;
  fileName: string;
}

interface DocumentAnalysis {
  documentType: string;
  summary: string;
  nlpDescription: string;
  authorizedParties: string[];
  keyDates: string[];
  amounts: string[];
  organizations: string[];
}

const DocumentSummary: React.FC<DocumentSummaryProps> = ({ extractedText, fileName }) => {
  const analyzeDocument = (text: string): DocumentAnalysis => {
    const lowerText = text.toLowerCase();
    
    // Determine document type with enhanced logic
    let documentType = 'Unknown Document';
    let documentPurpose = '';
    
    if (lowerText.includes('invoice') || lowerText.includes('bill')) {
      documentType = 'Invoice/Bill';
      documentPurpose = 'financial transaction';
    } else if (lowerText.includes('receipt')) {
      documentType = 'Receipt';
      documentPurpose = 'payment confirmation';
    } else if (lowerText.includes('contract') || lowerText.includes('agreement')) {
      documentType = 'Contract/Agreement';
      documentPurpose = 'legal binding agreement';
    } else if (lowerText.includes('certificate')) {
      documentType = 'Certificate';
      documentPurpose = 'official certification or achievement';
    } else if (lowerText.includes('license')) {
      documentType = 'License';
      documentPurpose = 'official permission or authorization';
    } else if (lowerText.includes('report')) {
      documentType = 'Report';
      documentPurpose = 'informational analysis or findings';
    } else if (lowerText.includes('letter') || lowerText.includes('correspondence')) {
      documentType = 'Letter/Correspondence';
      documentPurpose = 'formal communication';
    } else if (lowerText.includes('policy') || lowerText.includes('procedure')) {
      documentType = 'Policy/Procedure';
      documentPurpose = 'organizational guidelines';
    }

    // Extract authorized parties (names) with improved patterns
    const namePatterns = [
      /\b([A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g,
      /\b([A-Z][A-Z]+\s+[A-Z][A-Z]+)\b/g,
    ];
    const authorizedParties: Set<string> = new Set();
    namePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match.length > 5 && !match.includes('LLC') && !match.includes('Inc') && 
              !match.includes('Corp') && !match.includes('THE') && !match.includes('AND')) {
            authorizedParties.add(match);
          }
        });
      }
    });

    // Extract dates with enhanced patterns
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
      /\b\d{4}-\d{2}-\d{2}\b/g,
      /\b\d{1,2}-\d{1,2}-\d{4}\b/g,
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/g,
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/g,
    ];
    const keyDates: Set<string> = new Set();
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => keyDates.add(match));
      }
    });

    // Extract amounts with improved patterns
    const amountPatterns = [
      /\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g,
      /USD\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g,
      /\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*USD/g,
      /€\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g,
      /£\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g,
    ];
    const amounts: Set<string> = new Set();
    amountPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => amounts.add(match));
      }
    });

    // Extract organizations with enhanced patterns
    const orgPatterns = [
      /\b([A-Z][a-zA-Z\s]+(LLC|Inc|Corp|Company|Co\.|Ltd|LLP|LP)\.?)\b/g,
      /\b([A-Z][A-Z\s]+(LLC|INC|CORP|COMPANY|CO\.|LTD|LLP|LP)\.?)\b/g,
      /\b([A-Z][a-zA-Z\s]+(?:Corporation|Incorporated|Limited))\b/g,
    ];
    const organizations: Set<string> = new Set();
    orgPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => organizations.add(match));
      }
    });

    // Generate enhanced NLP-based description
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = Math.round(wordCount / sentenceCount);
    
    // Analyze document complexity and tone
    const complexWords = text.match(/\b\w{8,}\b/g)?.length || 0;
    const complexityRatio = complexWords / wordCount;
    let complexityLevel = 'Simple';
    if (complexityRatio > 0.15) complexityLevel = 'Complex';
    else if (complexityRatio > 0.08) complexityLevel = 'Moderate';

    // Analyze document intent and content
    const hasLegalTerms = /\b(hereby|whereas|aforementioned|pursuant|therefore|notwithstanding)\b/i.test(text);
    const hasFinancialTerms = /\b(payment|invoice|amount|total|due|balance|credit|debit)\b/i.test(text);
    const hasDateReferences = keyDates.size > 0;
    const hasPersonalInfo = authorizedParties.size > 0;

    const nlpDescription = `This document appears to be a ${documentType.toLowerCase()} serving as a ${documentPurpose}. The text contains approximately ${wordCount} words across ${sentenceCount} sentences with an average of ${avgWordsPerSentence} words per sentence. The document exhibits ${complexityLevel.toLowerCase()} language complexity. ${hasLegalTerms ? 'It contains formal legal terminology indicating a formal or contractual nature. ' : ''}${hasFinancialTerms ? 'The document includes financial terminology suggesting monetary transactions or obligations. ' : ''}${hasDateReferences ? `It references ${keyDates.size} specific date${keyDates.size > 1 ? 's' : ''}, indicating time-sensitive information. ` : ''}${hasPersonalInfo ? `The document mentions ${authorizedParties.size} individual${authorizedParties.size > 1 ? 's' : ''}, suggesting personal or professional relationships. ` : ''}The overall structure and content suggest this is ${documentType === 'Unknown Document' ? 'a formal document' : `a typical ${documentType.toLowerCase()}`} that would be used in ${documentPurpose.includes('transaction') ? 'business or commercial' : documentPurpose.includes('legal') ? 'legal or contractual' : 'professional or official'} contexts.`;

    // Generate summary
    const summary = `This ${documentType.toLowerCase()} contains ${text.length} characters of content. ${
      authorizedParties.size > 0 ? `Involves ${authorizedParties.size} parties. ` : ''
    }${
      amounts.size > 0 ? `Contains ${amounts.size} monetary amounts. ` : ''
    }${
      keyDates.size > 0 ? `References ${keyDates.size} dates. ` : ''
    }${
      organizations.size > 0 ? `Mentions ${organizations.size} organizations. ` : ''
    }`;

    return {
      documentType,
      summary,
      nlpDescription,
      authorizedParties: Array.from(authorizedParties).slice(0, 10),
      keyDates: Array.from(keyDates).slice(0, 10),
      amounts: Array.from(amounts).slice(0, 10),
      organizations: Array.from(organizations).slice(0, 10),
    };
  };

  if (!extractedText) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No document content to analyze</p>
        </CardContent>
      </Card>
    );
  }

  const analysis = analyzeDocument(extractedText);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Document Type</h4>
          <p className="text-sm bg-blue-50 px-3 py-2 rounded-lg">{analysis.documentType}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Summary</h4>
          <p className="text-sm text-gray-600">{analysis.summary}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Document Analysis (NLP)
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed bg-purple-50 p-3 rounded-lg border border-purple-200">
            {analysis.nlpDescription}
          </p>
        </div>

        {analysis.authorizedParties.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <User className="h-4 w-4" />
              Authorized Parties
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.authorizedParties.map((party, index) => (
                <span key={index} className="text-xs bg-green-50 px-2 py-1 rounded-full">
                  {party}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.organizations.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Building className="h-4 w-4" />
              Organizations
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.organizations.map((org, index) => (
                <span key={index} className="text-xs bg-purple-50 px-2 py-1 rounded-full">
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.keyDates.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Key Dates
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keyDates.map((date, index) => (
                <span key={index} className="text-xs bg-yellow-50 px-2 py-1 rounded-full">
                  {date}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis.amounts.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Monetary Amounts
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.amounts.map((amount, index) => (
                <span key={index} className="text-xs bg-red-50 px-2 py-1 rounded-full">
                  {amount}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentSummary;
