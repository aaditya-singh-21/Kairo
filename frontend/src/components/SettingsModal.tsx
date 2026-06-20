import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('kairo_gemini_key') || '';
      setApiKey(storedKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('kairo_gemini_key', apiKey.trim());
    } else {
      localStorage.removeItem('kairo_gemini_key');
    }
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-pitch/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-paper border border-pitch-10 p-8 max-w-md w-full relative shadow-2xl"
            >
              <h2 className="font-sans font-medium text-pitch text-xl mb-2">
                Settings
              </h2>
              <p className="font-mono text-[11px] text-pitch-40 mb-6 uppercase tracking-[0.05em]">
                Bring Your Own Key
              </p>

              <div className="flex flex-col gap-2 mb-8">
                <label className="font-mono text-[10px] text-pitch-60 uppercase tracking-[0.1em]">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-transparent border-b border-pitch-20 px-0 py-2 font-mono text-sm text-pitch placeholder-pitch-20 focus:outline-none focus:border-pitch transition-colors"
                />
                <p className="font-mono text-[10px] text-pitch-40 mt-1">
                  Your key is stored securely in your browser's local storage and is sent directly to the server during generation. Using your own key prevents credit deduction. (Note: Only Google Gemini API keys are currently supported).
                </p>
              </div>

              <div className="flex justify-end gap-4 items-center">
                <AnimatePresence>
                  {showToast && (
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="font-mono text-[10px] text-green-600 uppercase tracking-[0.1em]"
                    >
                      Saved successfully
                    </motion.span>
                  )}
                </AnimatePresence>
                
                <button
                  onClick={onClose}
                  className="font-mono text-[11px] tracking-[0.1em] uppercase text-pitch-60 hover:text-pitch transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-swiss text-[11px] py-2 px-6"
                >
                  <span>Save</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
