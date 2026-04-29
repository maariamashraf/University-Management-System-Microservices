interface SettingsInputProps {
    label: string;
    value: string;
    onChange?: (val: string) => void;
    type?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export default function SettingsInput({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon,
    disabled,
}: SettingsInputProps) {
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
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition
                        ${icon ? "pl-9 pr-3 py-2.5" : "px-3 py-2.5"}
                        ${disabled ? "cursor-not-allowed text-gray-400 bg-gray-100" : ""}`}
                />
            </div>
        </div>
    );
}
