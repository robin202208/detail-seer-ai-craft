
import React from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';

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
        </div>
        <FileUploader />
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
