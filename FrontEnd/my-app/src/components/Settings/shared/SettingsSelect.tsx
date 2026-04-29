interface SettingsSelectProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: string[];
    icon?: React.ReactNode;
}

export default function SettingsSelect({
    label,
    value,
    onChange,
    options,
    icon,
}: SettingsSelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </span>
                )}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition appearance-none
                        ${icon ? "pl-9 pr-3 py-2.5" : "px-3 py-2.5"}`}
                >
                    {options.map(o => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
