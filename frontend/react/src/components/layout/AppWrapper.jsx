import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { OfflineBanner } from '../common/OfflineBanner';
import { KeyboardShortcutsHelp } from '../common/KeyboardShortcutsHelp';

// App wrapper component for global features
export function AppWrapper({ children }) {
  useKeyboardShortcuts();
  
  return (
    <>
      <OfflineBanner />
      <KeyboardShortcutsHelp />
      {children}
    </>
  );
}
