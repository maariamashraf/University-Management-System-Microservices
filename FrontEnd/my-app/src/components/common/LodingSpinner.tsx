interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    color?: "blue" | "white" | "gray" | "green" | "red";
    fullScreen?: boolean;
    text?: string;
}

export default function LoadingSpinner({ 
    size = "md", 
    color = "blue", 
    fullScreen = false,
    text 
}: LoadingSpinnerProps) {
    
    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-3",
        lg: "w-16 h-16 border-4",
        xl: "w-24 h-24 border-4"
    };

    const colorClasses = {
        blue: "border-blue-600 border-t-transparent",
        white: "border-white border-t-transparent",
        gray: "border-gray-600 border-t-transparent",
        green: "border-green-600 border-t-transparent",
        red: "border-red-600 border-t-transparent"
    };

    const textColorClasses = {
        blue: "text-blue-600",
        white: "text-white",
        gray: "text-gray-600",
        green: "text-green-600",
        red: "text-red-600"
    };

    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <div 
                className={`
                    ${sizeClasses[size]} 
                    ${colorClasses[color]} 
                    rounded-full 
                    animate-spin
                `}
            />
            {text && (
                <p className={`text-sm font-medium ${textColorClasses[color]}`}>
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}

// Alternative spinner styles for variety
export function DotsSpinner({ 
    size = "md", 
    color = "blue" 
}: Pick<LoadingSpinnerProps, "size" | "color">) {
    
    const dotSizeClasses = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4",
        xl: "w-6 h-6"
    };

    const colorClasses = {
        blue: "bg-blue-600",
        white: "bg-white",
        gray: "bg-gray-600",
        green: "bg-green-600",
        red: "bg-red-600"
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <div 
                className={`${dotSizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
                style={{ animationDelay: "0ms" }}
            />
            <div 
                className={`${dotSizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
                style={{ animationDelay: "150ms" }}
            />
            <div 
                className={`${dotSizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
                style={{ animationDelay: "300ms" }}
            />
        </div>
    );
}

export function PulseSpinner({ 
    size = "md", 
    color = "blue" 
}: Pick<LoadingSpinnerProps, "size" | "color">) {
    
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    const colorClasses = {
        blue: "bg-blue-600",
        white: "bg-white",
        gray: "bg-gray-600",
        green: "bg-green-600",
        red: "bg-red-600"
    };

    return (
        <div className="relative flex items-center justify-center">
            <div 
                className={`
                    ${sizeClasses[size]} 
                    ${colorClasses[color]} 
                    rounded-full 
                    opacity-75 
                    animate-ping
                `}
            />
            <div 
                className={`
                    absolute
                    ${sizeClasses[size]} 
                    ${colorClasses[color]} 
                    rounded-full 
                    opacity-100
                `}
            />
        </div>
    );
}
