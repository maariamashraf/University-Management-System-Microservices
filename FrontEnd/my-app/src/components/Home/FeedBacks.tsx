import FeedBackCard from "./FeedBackCard";
import useGetRecentFeedBacks from "../../CustomeHooks/FeedBacks/UseGetRecentFeedBacks";

export default function FeedBacks() {

    const { data: feedbacks, isLoading, error } = useGetRecentFeedBacks();

    return (
        <section className="w-full bg-gray-100 py-20 min-h-[calc(100vh-50rem)] overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8  overflow-hidden">
                <div className="flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-bold  mb-4 text-blue-600">FeedBacks</h2>
                
                    <p className="text-gray-600 text-2xl">Hear from our students and faculty about their experience at our university</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">

                    {feedbacks.map((feedBack) => (
                        <FeedBackCard key={feedBack.id}
                            name={feedBack.userName}
                            description={feedBack.comment}
                            role={feedBack.role} />
                    ))}
                </div>
            </div>
        </section>
    )

}