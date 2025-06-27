
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText, Phone, Mail, MapPin, Hash } from 'lucide-react';

interface EntityExtractorProps {
  extractedText: string;
}

interface ExtractedEntities {
  emails: string[];
  phoneNumbers: string[];
  addresses: string[];
  identificationNumbers: string[];
  urls: string[];
}

const EntityExtractor: React.FC<EntityExtractorProps> = ({ extractedText }) => {
  const extractEntities = (text: string): ExtractedEntities => {
    // Email extraction
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = [...new Set(text.match(emailPattern) || [])];

    // Phone number extraction
    const phonePatterns = [
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/g,
      /\+\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
    ];
    const phoneNumbers: Set<string> = new Set();
    phonePatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => phoneNumbers.add(match));
    });

    // Address extraction (basic patterns)
    const addressPatterns = [
      /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl)\b/gi,
      /\b\d{5}(?:-\d{4})?\b/g, // ZIP codes
    ];
    const addresses: Set<string> = new Set();
    addressPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => {
        if (match.length > 8) { // Filter out short matches
          addresses.add(match);
        }
      });
    });

    // Identification numbers (SSN, Tax ID, etc.)
    const idPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN format
      /\b\d{2}-\d{7}\b/g, // Tax ID format
      /\b[A-Z]{2}\d{6,10}\b/g, // License format
      /\b\d{9,12}\b/g, // Generic ID numbers
    ];
    const identificationNumbers: Set<string> = new Set();
    idPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => {
        // Avoid adding simple numbers that might not be IDs
        if (!/^\d+$/.test(match) || match.length >= 9) {
          identificationNumbers.add(match);
        }
      });
    });

    // URL extraction
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = [...new Set(text.match(urlPattern) || [])];

    return {
      emails: emails.slice(0, 10),
      phoneNumbers: Array.from(phoneNumbers).slice(0, 10),
      addresses: Array.from(addresses).slice(0, 10),
      identificationNumbers: Array.from(identificationNumbers).slice(0, 10),
      urls: urls.slice(0, 10),
    };
  };

  if (!extractedText) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Important Entities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No document content to analyze for entities</p>
        </CardContent>
      </Card>
    );
  }

  const entities = extractEntities(extractedText);
  const totalEntities = Object.values(entities).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Important Entities ({totalEntities})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entities.emails.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email Addresses ({entities.emails.length})
            </h4>
            <div className="space-y-1">
              {entities.emails.map((email, index) => (
                <div key={index} className="text-sm bg-blue-50 px-3 py-2 rounded border">
                  {email}
                </div>
              ))}
            </div>
          </div>
        )}

        {entities.phoneNumbers.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Phone className="h-4 w-4" />
              Phone Numbers ({entities.phoneNumbers.length})
            </h4>
            <div className="space-y-1">
              {entities.phoneNumbers.map((phone, index) => (
                <div key={index} className="text-sm bg-green-50 px-3 py-2 rounded border">
                  {phone}
                </div>
              ))}
            </div>
          </div>
        )}

        {entities.addresses.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Addresses ({entities.addresses.length})
            </h4>
            <div className="space-y-1">
              {entities.addresses.map((address, index) => (
                <div key={index} className="text-sm bg-yellow-50 px-3 py-2 rounded border">
                  {address}
                </div>
              ))}
            </div>
          </div>
        )}

        {entities.identificationNumbers.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <Hash className="h-4 w-4" />
              ID Numbers ({entities.identificationNumbers.length})
            </h4>
            <div className="space-y-1">
              {entities.identificationNumbers.map((id, index) => (
                <div key={index} className="text-sm bg-red-50 px-3 py-2 rounded border">
                  {id}
                </div>
              ))}
            </div>
          </div>
        )}

        {entities.urls.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <FileText className="h-4 w-4" />
              URLs ({entities.urls.length})
            </h4>
            <div className="space-y-1">
              {entities.urls.map((url, index) => (
                <div key={index} className="text-sm bg-purple-50 px-3 py-2 rounded border break-all">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalEntities === 0 && (
          <p className="text-gray-500 text-sm">No important entities detected in this document</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityExtractor;
