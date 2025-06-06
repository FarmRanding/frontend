declare module '@stagewise/toolbar-react' {
  export interface StagewiseConfig {
    plugins: any[];
  }

  export interface StagewiseToolbarProps {
    config: StagewiseConfig;
  }

  export const StagewiseToolbar: React.FC<StagewiseToolbarProps>;
} 