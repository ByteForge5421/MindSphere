
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'ghost', 
  size = 'icon',
  showLabel = false 
}) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const getIcon = () => {
    switch (actualTheme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="relative transition-all duration-300 hover:scale-105"
        >
          {getIcon()}
          {showLabel && <span className="ml-2">{getLabel()}</span>}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light Mode</span>
          {theme === 'light' && (
            <div className="ml-auto w-2 h-2 bg-wellness-green rounded-full"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark Mode</span>
          {theme === 'dark' && (
            <div className="ml-auto w-2 h-2 bg-wellness-green rounded-full"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto w-2 h-2 bg-wellness-green rounded-full"></div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Simple toggle button version (just switches between light/dark)
export const SimpleThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'ghost', 
  size = 'icon' 
}) => {
  const { actualTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(actualTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="relative transition-all duration-300 hover:scale-105"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};