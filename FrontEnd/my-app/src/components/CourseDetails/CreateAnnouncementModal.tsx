import { useEffect, useState, type FormEvent } from "react";

interface CreateAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: { title: string; content: string }) => Promise<void>;
    isPending: boolean;
    errorMessage?: string | null;
}

export default function CreateAnnouncementModal({
    isOpen,
    onClose,
    onSubmit,
    isPending,
    errorMessage,
}: CreateAnnouncementModalProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        setTitle("");
        setContent("");
        setFormError(null);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle || !trimmedContent) {
            setFormError("Title and content are required.");
            return;
        }

        setFormError(null);
        await onSubmit({ title: trimmedTitle, content: trimmedContent });
    };

    return (
        <>
            <button
                aria-label="Close modal backdrop"
                onClick={onClose}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                        <h3 className="text-lg font-semibold text-slate-800">Create Announcement</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
                        <div className="space-y-1">
                            <label htmlFor="announcementTitle" className="text-sm font-medium text-slate-700">
                                Title
                            </label>
                            <input
                                id="announcementTitle"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Enter announcement title"
                                maxLength={120}
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="announcementContent" className="text-sm font-medium text-slate-700">
                                Content
                            </label>
                            <textarea
                                id="announcementContent"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                placeholder="Write announcement content..."
                                maxLength={1200}
                            />
                        </div>

                        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
                        {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isPending ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
