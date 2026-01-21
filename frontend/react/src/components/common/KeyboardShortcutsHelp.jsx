import { useState, useEffect } from 'react';

// Keyboard shortcuts help modal
export function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + ? to toggle help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Ctrl/Cmd', 'K'], description: 'Focus search' },
    { keys: ['Ctrl/Cmd', 'D'], description: 'Go to Dashboard' },
    { keys: ['Ctrl/Cmd', 'B'], description: 'Go to Blogs' },
    { keys: ['Ctrl/Cmd', 'P'], description: 'Go to Profile' },
    { keys: ['Ctrl/Cmd', 'R'], description: 'Go to Resources' },
    { keys: ['Ctrl/Cmd', 'L'], description: 'Go to Local Guide' },
    { keys: ['Ctrl/Cmd', '/'], description: 'Show this help' },
    { keys: ['Esc'], description: 'Close modals / Logout (double press)' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="shortcuts-title" className="text-xl font-bold">Keyboard Shortcuts</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b">
              <span className="text-gray-600">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <kbd
                    key={keyIndex}
                    className="px-2 py-1 bg-gray-100 rounded text-sm font-mono"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
