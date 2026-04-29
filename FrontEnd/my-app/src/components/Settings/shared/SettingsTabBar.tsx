interface Tab {
    key: string;
    label: string;
}

interface SettingsTabBarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function SettingsTabBar({ tabs, activeTab, onTabChange }: SettingsTabBarProps) {
    return (
        <div className="border-b border-gray-100 px-5 flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                        ${activeTab === tab.key
                            ? "text-blue-600 border-blue-600"
                            : "text-gray-400 border-transparent hover:text-gray-700"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
