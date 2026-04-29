interface SettingsToggleProps {
    label: string;
    desc: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}

export default function SettingsToggle({ label, desc, checked, onChange }: SettingsToggleProps) {
    return (
        <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
            <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                role="switch"
                aria-checked={checked}
                aria-label={label}
                className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors
                    ${checked ? "bg-blue-600" : "bg-gray-200"}`}
            >
                <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all
                        ${checked ? "left-6" : "left-1"}`}
                />
            </button>
        </div>
    );
}
