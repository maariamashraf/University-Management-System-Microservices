import type { UpcomingEventResponse } from "../../Interfaces/upComingEvent";
import {
    getDaysLeft,
    getUrgencyFromDaysLeft,
    getUrgencyStyle,
    getDateBoxStyle,
} from "../../utils/deadlineUtils";

interface CourseDeadlinesProps {
    events: UpcomingEventResponse[];
}

function DeadlineItem({ event }: { event: UpcomingEventResponse }) {
    const date = new Date(event.date);
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();

    const daysLeft = getDaysLeft(event.date);
    const urgency = getUrgencyFromDaysLeft(daysLeft, event.type?.toUpperCase());
    const dateStyle = getDateBoxStyle(urgency);

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl overflow-hidden shrink-0 ${dateStyle.bg}`}>
                <span className={`text-[9px] font-bold uppercase w-full text-center py-0.5 ${dateStyle.monthBg} text-white`}>
                    {month}
                </span>
                <span className={`text-lg font-bold ${dateStyle.dayText} leading-none mt-1`}>
                    {day}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
                <p className="text-xs text-gray-500 truncate">{event.description}</p>
            </div>

            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${getUrgencyStyle(urgency)}`}>
                {urgency}
            </span>
        </div>
    );
}

export default function CourseDeadlines({ events }: CourseDeadlinesProps) {
    const sorted = [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-800">Upcoming Deadlines</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">
                    View all
                </button>
            </div>

            {sorted.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No upcoming deadlines.</p>
            ) : (
                <div>
                    {sorted.slice(0, 5).map((event) => (
                        <DeadlineItem key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
