import type { UpcomingEventsProps } from "../../Interfaces/dashboard";
import {
    getEventTypeColor,
    getEventDateColor,
    getEventDateTextColor,
    getEventDateBgColor,
} from "../../utils/eventUtils";

export default function UpcomingEvents({ events }: UpcomingEventsProps) {

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Upcoming Deadlines & Events</h2>
                <button className="text-blue-500 text-sm font-medium hover:underline">
                    View Calendar
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {events.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                        <div className="flex gap-4 items-start">
                            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 ${getEventDateColor(event.type)}`}>
                                <span className={`text-[10px] font-bold uppercase w-full text-center py-0.5 ${getEventDateBgColor(event.type)} text-white`}>
                                    {event.date.month}
                                </span>
                                <span className={`text-xl font-bold ${getEventDateTextColor(event.type)} flex-1 flex items-center`}>
                                    {event.date.day}
                                </span>
                            </div>
                            
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm text-gray-800">{event.title}</h3>
                                <p className="text-xs text-gray-500 mt-0.5 mb-2">{event.subtitle}</p>
                                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                    {event.type}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
