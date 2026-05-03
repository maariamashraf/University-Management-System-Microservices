import type { UserTypeFilter } from "../../domain/interfaces";

interface FilterBarProps {
    selectedFilter: UserTypeFilter;
    onFilterChange: (value: UserTypeFilter) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const filters: Array<{ label: string; value: UserTypeFilter }> = [
    { label: "All Users", value: "all" },
    { label: "Students", value: "students" },
    { label: "Teachers", value: "teachers" },
];

export default function FilterBar({ selectedFilter, onFilterChange, searchTerm, onSearchChange }: FilterBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => onFilterChange(filter.value)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            selectedFilter === filter.value
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by username..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:w-72"
            />
        </div>
    );
}
