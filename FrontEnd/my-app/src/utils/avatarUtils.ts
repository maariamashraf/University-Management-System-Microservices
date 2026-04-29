const AVATAR_COLORS: string[] = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33A1FF",
    "#A133FF", "#FF3388", "#8833FF", "#3388FF", "#FF8833",
];

/** Returns a random colour from the avatar palette. */
export function getRandomColor(): string {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)] as string;
}

/** Returns the first two letters of a name in uppercase (used for avatar initials). */
export function getAvatarInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
}
