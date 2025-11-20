import React from 'react';
import { HistoryIcon, TrashIcon } from './Icons';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
    showHistory: boolean;
    onClose: () => void;
    history: HistoryItem[];
    onLoad: (item: HistoryItem) => void;
    onRemove: (id: string, e: React.MouseEvent) => void;
    onClear: () => void;
    t: any;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ 
    showHistory, 
    onClose, 
    history, 
    onLoad, 
    onRemove, 
    onClear,
    t 
}) => {
    return (
        <>
            <div 
                className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-800 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col border-l border-slate-200 dark:border-slate-700 ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        <HistoryIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        {t.historyTitle}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                        <p className="text-center text-slate-400 dark:text-slate-500 mt-8 italic">{t.historyEmpty}</p>
                    ) : (
                        history.map(item => (
                            <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-colors group cursor-pointer" onClick={() => onLoad(item)}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate max-w-[180px]">{item.fileName}</span>
                                    <button 
                                        onClick={(e) => onRemove(item.id, e)} 
                                        className="text-slate-300 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{item.date}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-mono">{item.preview}</p>
                            </div>
                        ))
                    )}
                </div>
                {history.length > 0 && (
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                        <button onClick={onClear} className="w-full py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            {t.historyClear}
                        </button>
                    </div>
                )}
            </div>

            {showHistory && (
                <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-30 transition-opacity" onClick={onClose}></div>
            )}
        </>
    );
};

export default HistoryDrawer;
