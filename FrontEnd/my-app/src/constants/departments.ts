/**
 * Raw department name values used as API keys / form values.
 */
export const DEPARTMENT_VALUES = [
    "Computer_Science",
    "Information_Systems",
    "Software_Engineering",
    "Artificial_Intelligence",
    "Data_Science",
    "Cybersecurity",
    "Information_Technology",
] as const;

export type DepartmentValue = (typeof DEPARTMENT_VALUES)[number];

/**
 * Department options for filter/select dropdowns that need a human-readable label.
 * Includes an "All Departments" sentinel at position 0.
 */
export const DEPARTMENT_OPTIONS: { value: string; label: string }[] = [
    { value: "all",                    label: "All Departments" },
    { value: "Computer_Science",       label: "Computer Science" },
    { value: "Information_Systems",    label: "Information Systems" },
    { value: "Software_Engineering",   label: "Software Engineering" },
    { value: "Artificial_Intelligence",label: "Artificial Intelligence" },
    { value: "Data_Science",           label: "Data Science" },
    { value: "Cybersecurity",          label: "Cybersecurity" },
    { value: "Information_Technology", label: "Information Technology" },
];
