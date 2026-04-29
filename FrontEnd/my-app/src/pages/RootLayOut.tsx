import Nav from "../components/common/Nav";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";
import { useRef } from "react";
import type { RefObject } from "react";

export type HomeScrollRefs = {
    scrollRefToCourses: RefObject<HTMLDivElement | null>;
    scrollRefToDepartments: RefObject<HTMLDivElement | null>;
    scrollRefToFeedBacks: RefObject<HTMLDivElement | null>;
    scrollRefToFooter: RefObject<HTMLDivElement | null>;
};

export default function RootLayOut() {
    const scrollRefToCourses = useRef<HTMLDivElement | null>(null);
    const scrollRefToDepartments = useRef<HTMLDivElement | null>(null);
    const scrollRefToFeedBacks = useRef<HTMLDivElement | null>(null);
    const scrollRefToFooter = useRef<HTMLDivElement | null>(null);

    const executeScrollToCourses = () => {
        scrollRefToCourses.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const executeScrollToDepartments = () => {
        scrollRefToDepartments.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const executeScrollToFeedBacks = () => {
        scrollRefToFeedBacks.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const executeScrollToFooter = () => {
        scrollRefToFooter.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-200 flex flex-col">
            <Nav
                onScrollToCourses={executeScrollToCourses}
                onScrollToDepartments={executeScrollToDepartments}
                onScrollToFeedBacks={executeScrollToFeedBacks}
                onScrollToFooter={executeScrollToFooter}
            />
            <main>
                <Outlet context={{ scrollRefToCourses, scrollRefToDepartments, scrollRefToFeedBacks, scrollRefToFooter } as HomeScrollRefs} />
            </main>
            <div ref={scrollRefToFooter}>
                <Footer />
            </div>
        </div>
    );
}