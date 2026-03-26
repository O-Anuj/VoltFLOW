
import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Loader2, FileText, Image as ImageIcon } from 'lucide-react';

interface FilePreviewModalProps {
  file: {
    name: string;
    type: string;
    mimeType: string;
    downloadURL: string;
  } | null;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (file) {
      setIsLoading(true);
    }
  }, [file]);

  if (!file) return null;

  const isImage = file.type === 'image' || file.mimeType.startsWith('image/');
  const isPDF = file.type === 'pdf' || file.mimeType === 'application/pdf';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(file.downloadURL, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-[85vh] bg-transparent flex flex-col animate-in zoom-in-95 duration-200 pointer-events-none">
        
        {/* Header (Floating) */}
        <div className="flex items-center justify-between mb-4 pointer-events-auto px-2">
          <div className="flex items-center gap-3 text-white overflow-hidden">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              {isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <h3 className="font-semibold text-lg truncate drop-shadow-md">{file.name}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title="Download / Open Original"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => window.open(file.downloadURL, '_blank')}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              title="Open in New Tab"
            >
              <ExternalLink size={20} />
            </button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <button 
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-red-500/20 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-900/50 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl backdrop-blur-sm pointer-events-auto flex items-center justify-center">
            
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-emerald-500 z-0">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            )}

            {isImage && (
              <img 
                src={file.downloadURL} 
                alt={file.name}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
              />
            )}

            {isPDF && (
              <iframe 
                src={`${file.downloadURL}#toolbar=0`}
                title={file.name}
                className="w-full h-full bg-white"
                onLoad={() => setIsLoading(false)}
              />
            )}

            {!isImage && !isPDF && (
               <div className="text-center text-slate-400">
                 <p className="mb-4">Preview not available for this file type.</p>
                 <button 
                   onClick={handleDownload}
                   className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors"
                 >
                   Download File
                 </button>
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
