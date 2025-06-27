import React, { useState, useRef } from 'react';
import FileUpload from '../components/FileUpload';
import FileViewer from '../components/FileViewer';
import ExtractedText from '../components/ExtractedText';
import DocumentSummary from '../components/DocumentSummary';
import SignatureDetector from '../components/SignatureDetector';
import StampDetector from '../components/StampDetector';
import EntityExtractor from '../components/EntityExtractor';
import Footer from '../components/Footer';
import { processFile } from '../utils/geminiProcessor';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Zap, BarChart3, PenTool, Stamp, Users } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState('');

  // Handle file upload and create preview URL
  const handleFileUpload = (file: File) => {
    console.log('File uploaded:', file.name, file.type);
    setUploadedFile(file);
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
    } else {
      setFilePreviewUrl('');
    }
    
    // Clear previous extracted text
    setExtractedText('');
    toast.success(`File "${file.name}" uploaded successfully!`);
  };

  // Process the uploaded file using Gemini AI
  const handleProcessFile = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    console.log('Starting file processing with Gemini AI...');

    try {
      const result = await processFile(uploadedFile);
      setExtractedText(result);
      toast.success('Text extracted successfully!');
      console.log('Text extraction completed');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Document Extractor - <a href="https://surajnate.github.io/surajnateportfolio/" target="_blank">[ <u>surajnate</u> ]</a>
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl">
            Upload images, PDFs, or invoices to extract textual data using Google's Gemini-1.5-flash AI model. 
            Perfect for digitizing receipts, invoices, and documents with advanced analysis.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* File Upload Section */}
        <Card className="mb-8 p-6 bg-white shadow-lg border-0">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
          </div>
          <FileUpload onFileUpload={handleFileUpload} />
          
          {uploadedFile && (
            <div className="mt-6 flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-600">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleProcessFile}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Extract Text
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Document Analysis Section */}
        {uploadedFile && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* File Viewer Section */}
            <Card className="p-6 bg-white shadow-lg border-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Document Preview
              </h2>
              <FileViewer 
                file={uploadedFile} 
                previewUrl={filePreviewUrl}
              />
            </Card>

            {/* Analysis Results Section with Tabs */}
            <Card className="p-6 bg-white shadow-lg border-0">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Document Analysis
              </h2>
              
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="text" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="text-xs">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="signatures" className="text-xs">
                    <PenTool className="h-3 w-3 mr-1" />
                    Signs
                  </TabsTrigger>
                  <TabsTrigger value="stamps" className="text-xs">
                    <Stamp className="h-3 w-3 mr-1" />
                    Stamps
                  </TabsTrigger>
                  <TabsTrigger value="entities" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Entities
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-4">
                  <ExtractedText 
                    text={extractedText} 
                    isLoading={isProcessing}
                  />
                </TabsContent>
                
                <TabsContent value="summary" className="mt-4">
                  <DocumentSummary 
                    extractedText={extractedText}
                    fileName={uploadedFile.name}
                  />
                </TabsContent>
                
                <TabsContent value="signatures" className="mt-4">
                  <SignatureDetector extractedText={extractedText} />
                </TabsContent>
                
                <TabsContent value="stamps" className="mt-4">
                  <StampDetector extractedText={extractedText} />
                </TabsContent>
                
                <TabsContent value="entities" className="mt-4">
                  <EntityExtractor extractedText={extractedText} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Index;
