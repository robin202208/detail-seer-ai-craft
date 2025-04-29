
import React from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';
import CompareDocuments from '@/components/CompareDocuments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileDiff, FileText } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container max-w-5xl py-8">
          <h1 className="text-4xl font-bold mb-2 text-center">DetailSeer</h1>
          <p className="text-xl text-muted-foreground text-center mb-8">
            AI-powered document analysis and comparison
          </p>
          
          <Tabs defaultValue="upload" className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                文档分析
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <FileDiff className="h-4 w-4" />
                文档比对
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <FileUploader />
            </TabsContent>
            <TabsContent value="compare">
              <CompareDocuments />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          DetailSeer - AI文档分析与比对工具 © 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;
