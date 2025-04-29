
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileAnalyzer from './FileAnalyzer';
import { FileIcon, ImageIcon, FileTextIcon, Settings2Icon } from 'lucide-react';

const FileUploader = () => {
  return (
    <div className="container max-w-5xl py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Extract Details from Your Files</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        Upload various file types and let our AI detect and extract all the fine-grained details within them.
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
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Images</span>
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
              Document analysis feature will be available in the next version.
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Image Analysis</CardTitle>
              <CardDescription>
                Upload images to detect objects, text, people, and other details.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Image analysis feature will be available in the next version.
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
