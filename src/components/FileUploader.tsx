
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileAnalyzer from './FileAnalyzer';
import { FileIcon, FileDiff, FileTextIcon, Settings2Icon } from 'lucide-react';

const FileUploader = () => {
  return (
    <div className="container max-w-5xl py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Extract & Compare Document Details</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Upload various file types for AI analysis or compare multiple documents to identify detailed differences between them.
      </p>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileIcon className="h-4 w-4" />
            <span className="hidden sm:inline">All Files</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <FileDiff className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings2Icon className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <FileAnalyzer />
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Analysis</CardTitle>
              <CardDescription>
                Upload PDFs, DOCs, or other document formats for detailed analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>Select the "All Files" tab to analyze documents with AI.</p>
              <p className="mt-2">Our AI system automatically extracts key information, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Document structure and organization</li>
                <li>Key topics and main points</li>
                <li>Entities such as people, organizations, and dates</li>
                <li>Statistical information and numerical data</li>
                <li>Document metadata and contextual information</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Document Comparison</CardTitle>
              <CardDescription>
                Compare any two documents to identify differences and similarities in their content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select the "All Files" tab and choose the "Compare Documents" option to use our advanced AI-powered document comparison.
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">What you can compare:</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Content structure and organization</li>
                  <li>Key points and arguments</li>
                  <li>Factual information and data</li>
                  <li>Language usage and style differences</li>
                  <li>Identify missing or additional content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Settings</CardTitle>
              <CardDescription>
                Configure AI detection preferences and output formats.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                Settings configuration will be available in the next version.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileUploader;
