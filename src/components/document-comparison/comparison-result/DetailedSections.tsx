
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface DetailedSectionsProps {
  sections: Record<string, string>;
  highlightDifferences: (text: string) => string;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  excludedSections: string[];
}

const DetailedSections = ({ 
  sections, 
  highlightDifferences, 
  activeSection, 
  setActiveSection,
  excludedSections 
}: DetailedSectionsProps) => {
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full"
      value={activeSection}
      onValueChange={setActiveSection}
    >
      {Object.entries(sections).map(([title, content], index) => {
        // 已经单独显示的部分不再在手风琴中显示
        if (excludedSections.includes(title)) {
          return null;
        }
        
        return (
          <AccordionItem key={index} value={`section-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="whitespace-pre-line overflow-auto">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightDifferences(content) 
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default DetailedSections;
