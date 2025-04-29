
import React from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <FileUploader />
      </main>
      <footer className="py-6 border-t border-border">
        <div className="container text-center text-sm text-muted-foreground">
          DetailSeer - AI文档分析工具 © 2025
        </div>
      </footer>
    </div>
  );
};

export default Index;
