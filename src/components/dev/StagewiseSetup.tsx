import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import type { StagewiseConfig } from '../../types/stagewise';

const StagewiseSetup: React.FC = () => {
  useEffect(() => {
    // Only run in development mode
    if (import.meta.env.DEV) {
      const initStagewise = async () => {
        try {
          const { StagewiseToolbar } = await import('@stagewise/toolbar-react');
          
          // Create a separate container for the toolbar
          const toolbarContainer = document.createElement('div');
          toolbarContainer.id = 'stagewise-toolbar-root';
          document.body.appendChild(toolbarContainer);
          
          // Configuration for stagewise toolbar
          const stagewiseConfig: StagewiseConfig = {
            plugins: []
          };
          
          // Create a separate React root for the toolbar
          const toolbarRoot = createRoot(toolbarContainer);
          toolbarRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
          
          console.log('Stagewise toolbar initialized');
        } catch (error) {
          console.warn('Failed to initialize stagewise toolbar:', error);
        }
      };
      
      initStagewise();
    }
    
    // Cleanup function
    return () => {
      const existingContainer = document.getElementById('stagewise-toolbar-root');
      if (existingContainer) {
        existingContainer.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default StagewiseSetup; 