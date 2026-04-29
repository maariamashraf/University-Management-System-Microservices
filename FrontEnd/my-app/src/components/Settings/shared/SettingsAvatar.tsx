type AvatarSize = "sm" | "md" | "lg";

interface SettingsAvatarProps {
    name?: string;
    size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
    sm: "w-9 h-9 text-sm",
    md: "w-14 h-14 text-lg",
    lg: "w-20 h-20 text-2xl",
};

function getInitials(name?: string): string {
    if (!name) return "?";
    return name
        .split(" ")
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function SettingsAvatar({ name, size = "lg" }: SettingsAvatarProps) {
    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-600 to-purple-600
                flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg`}
        >
            {getInitials(name)}
        </div>
    );
}
