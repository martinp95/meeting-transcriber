import React from 'react';
import { CheckIcon } from './Icons';

interface ToggleOptionProps {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ label, checked, onChange }) => (
    <div 
        onClick={() => onChange(!checked)} 
        className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 hover:border-teal-500/50"
    >
        <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-teal-600 dark:bg-teal-500 border-teal-600 dark:border-teal-500' : 'bg-transparent border-slate-400'}`}>
            {checked && <CheckIcon className="w-3.5 h-3.5 text-white" />}
        </div>
    </div>
);

export default ToggleOption;
