import Welcome from "../components/Home/Welcome";
import Indicator from "../components/Home/Indicator";
import PopularCourses from "../components/Home/PopularCourses";
import Departments from "../components/Home/Departments";
import FeedBacks from "../components/Home/FeedBacks";
import FinalSecion from "../components/Home/FinalSecion";
import { useOutletContext } from "react-router-dom";
import type { HomeScrollRefs } from "./RootLayOut";

export default function Home() {
    const { scrollRefToCourses, scrollRefToDepartments, scrollRefToFeedBacks } =
        useOutletContext<HomeScrollRefs>();

    const executeScrollToCourses = () => {
        scrollRefToCourses.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>   
            <Welcome scrollToSection={executeScrollToCourses} />
            <Indicator />
            <div ref={scrollRefToCourses}>
                <PopularCourses />
            </div>
            <div ref={scrollRefToDepartments}>
                <Departments />
            </div>
            <div ref={scrollRefToFeedBacks}>
                <FeedBacks />
            </div>
            <FinalSecion />
        </>
    );


}
