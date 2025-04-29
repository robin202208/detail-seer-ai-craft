
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="py-6 border-b border-border">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-detailseer" />
          <h1 className="text-2xl font-bold tracking-tight">DetailSeer</h1>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">AI-powered Document Analysis</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
