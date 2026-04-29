import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { course, CourseRequest } from "../../Interfaces/course";
import { DEPARTMENT_VALUES } from "../../constants/departments";
import { toInputDate } from "../../utils/dateUtils";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CourseRequest) => void;
    isPending: boolean;
    editCourse?: course | null;
    teacherUserName: string;
    submitError?: string | null;
}

const EMPTY: Omit<CourseRequest, "teacherUserName"> = {
    name: "", description: "", courseCode: "",
    startDate: new Date(), endDate: new Date(),
    departmentName: "", creditHours: 3, maxStudents: 30,
};

export function CourseFormModal({ isOpen, onClose, onSubmit, isPending, editCourse, teacherUserName, submitError }: Props) {
    const [form, setForm] = useState(EMPTY);
   console.log("course Credits:", form.creditHours);
    useEffect(() => {
        if (editCourse) {
            setForm({
                name:           editCourse.name,
                description:    editCourse.description,
                courseCode:     editCourse.courseCode,
                startDate:      new Date(editCourse.startDate),
                endDate:        new Date(editCourse.endDate),
                departmentName: editCourse.department,
                creditHours:    editCourse.credits,
                maxStudents:    editCourse.maxStudents,
            });
        } else {
            setForm(EMPTY);
        }
    }, [editCourse, isOpen]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === "creditHours" || name === "maxStudents" ? Number(value) : value,
        }));
    }

    function handleDateChange(field: "startDate" | "endDate", value: string) {
        setForm(prev => ({ ...prev, [field]: new Date(value) }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log({ ...form, teacherUserName });
        onSubmit({ ...form, teacherUserName });
    }

    const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition";
    const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    />

                    {/* modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* modal header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-bold text-gray-800">
                                    {editCourse ? "Edit Course" : "Create New Course"}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            {/* form */}
                            <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-5 flex flex-col gap-4">

                                {/* row: name + code */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Course Name *</label>
                                        <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Data Structures" className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Course Code *</label>
                                        <input name="courseCode" required value={form.courseCode} onChange={handleChange} placeholder="e.g. CS301" className={inputCls} />
                                    </div>
                                </div>

                                {/* description */}
                                <div>
                                    <label className={labelCls}>Description</label>
                                    <textarea name="description" rows={2} value={form.description} onChange={handleChange} placeholder="Brief course description..." className={`${inputCls} resize-none`} />
                                </div>

                                {/* department */}
                                <div>
                                    <label className={labelCls}>Department *</label>
                                    <select name="departmentName" required value={form.departmentName} onChange={handleChange} className={inputCls}>
                                        <option value="">Select department</option>
                                        {DEPARTMENT_VALUES.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>

                                {/* row: dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Start Date *</label>
                                        <input type="date" required value={toInputDate(form.startDate)} onChange={e => handleDateChange("startDate", e.target.value)} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>End Date *</label>
                                        <input type="date" required value={toInputDate(form.endDate)} onChange={e => handleDateChange("endDate", e.target.value)} className={inputCls} />
                                    </div>
                                </div>

                                {/* row: credits + capacity */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelCls}>Credit Hours *</label>
                                        <input type="number" name="creditHours" required min={1} max={6} value={form.creditHours} onChange={handleChange} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Max Students *</label>
                                        <input type="number" name="maxStudents" required min={1} value={form.maxStudents} onChange={handleChange} className={inputCls} />
                                    </div>
                                </div>

                                {submitError && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                        {submitError}
                                    </div>
                                )}

                                {/* footer */}
                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                    >
                                        {isPending && (
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                        )}
                                        {editCourse ? "Save Changes" : "Create Course"}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
