import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebDAVRestoreModalProps {
    show: boolean;
    onClose: () => void;
    backups: string[];
    onRestore: (filename: string) => Promise<void>;
}

const WebDAVRestoreModal: React.FC<WebDAVRestoreModalProps> = ({
    show,
    onClose,
    backups,
    onRestore,
}) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-200 flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-[#FCFBFC] w-full max-w-sm rounded-[28px] p-8 space-y-6 paper-shadow border border-[#DBDCD7] flex flex-col max-h-[80vh]"
                    >
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-serif text-[#413A2C] italic">Pick a Backup</h2>
                            <p className="text-sm text-[#726C62]">Select a snapshot to restore.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {backups.map((filename) => (
                                <button
                                    key={filename}
                                    onClick={() => onRestore(filename)}
                                    className="w-full text-left p-4 bg-[#E9E8E2]/30 hover:bg-[#E9E8E2]/50 border border-[#DBDCD7] rounded-2xl transition-all group"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono text-[#413A2C] truncate pr-2">{filename}</span>
                                        <span className="text-[10px] text-[#A3BB96] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Restore →</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 text-[#726C62] font-semibold text-sm uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WebDAVRestoreModal;
