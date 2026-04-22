import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Image, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

import { exportDashboardSnapshot, exportDataReport, type ReportSection } from '../services/reportExporter';
import { hasFeature } from '../services/subscriptionService';

interface ExportToolbarProps {
  tabName: string;
  sections?: ReportSection[];
}

const ExportToolbar: React.FC<ExportToolbarProps> = ({ tabName, sections }) => {
  const [exporting, setExporting] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  if (!hasFeature('hasPdfExport')) return null;

  const handleSnapshot = async () => {
    setExporting('snapshot');
    setShowMenu(false);
    try {
      await exportDashboardSnapshot();
    } finally {
      setExporting(null);
    }
  };

  const handleDataReport = () => {
    setExporting('data');
    setShowMenu(false);
    try {
      exportDataReport({
        title: `تقرير ${tabName}`,
        subtitle: 'Top1 Quantum AI — Advanced Analytics',
        sections: sections ?? [],
        includeTimestamp: true,
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-xs font-medium text-gray-300 transition-colors disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        تصدير
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 min-w-[180px] py-1"
          >
            <button
              onClick={() => { void handleSnapshot(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors text-right"
            >
              <Image className="w-4 h-4 text-blue-400" />
              لقطة الشاشة (PDF)
            </button>
            {sections && sections.length > 0 && (
              <button
                onClick={handleDataReport}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 transition-colors text-right"
              >
                <FileText className="w-4 h-4 text-green-400" />
                تقرير بيانات (PDF)
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportToolbar;
