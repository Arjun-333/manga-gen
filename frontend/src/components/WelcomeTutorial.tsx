import { motion } from 'framer-motion';
import { FiBook, FiImage, FiSettings, FiUsers, FiX } from 'react-icons/fi';

interface WelcomeTutorialProps {
  onClose: () => void;
}

export default function WelcomeTutorial({ onClose }: WelcomeTutorialProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Manga Gen! 🎨</h2>
            <p className="text-gray-500 dark:text-gray-400">Your AI-powered manga creation studio</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Feature 1 */}
          <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FiBook size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">1. Create Your Story</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click <strong>"New Project"</strong> → Enter your story idea → AI generates a complete manga script with panels and dialogue!
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
              <FiImage size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">2. Generate Images</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Click <strong>"Generate Images"</strong> → AI creates artwork for each panel. Edit descriptions anytime to regenerate!
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
              <FiUsers size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">3. Character Consistency</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your characters stay consistent across panels! The AI remembers their appearance throughout your story.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
              <FiSettings size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">4. Configure API Keys</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Go to <strong>Profile → Workspace Settings</strong> to add your API keys:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-4 list-disc">
                <li><strong>Gemini Project Key</strong>: For script & character generation</li>
                <li><strong>Hugging Face Token</strong>: For image generation (free tier available!)</li>
              </ul>
            </div>
          </div>

          {/* Storage Info */}
          <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">📁 Where are my projects stored?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All your projects are saved in the <strong>Library</strong> tab. You can load, edit, or export them as PDFs anytime!
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Let's Create! 🚀
        </button>
      </motion.div>
    </div>
  );
}
