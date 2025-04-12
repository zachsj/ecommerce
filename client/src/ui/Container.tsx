import React from 'react'
import { twMerge } from "tailwind-merge"; //from tailwind-merge library, helps merge Tailwind CSS classes without conflicts.
interface Props {
    children: React.ReactNode;  //Represents any React elements (HTML, text, or components) passed inside <Container>
    className?: string;  //Allows passing additional Tailwind CSS classes for further customization.
}

const Container = ({ children, className }: Props) => { //function component, takes a props object as an argument, destructured which enforces what props Container expects.
    const newClassName = twMerge(
        "max-w-screen-xl mx-auto py-10 px-4 lg:px-0",  //max-w-screen-xl → will scale its width to fit the screen while never exceeding the maximum width defined for large displays, typically around 1280 pixels wide
        //mx-auto → Centers the container horizontally. py-10 → Adds vertical padding (top & bottom).
        //px-4 → Adds horizontal padding (left & right).lg:px-0 → Removes horizontal padding for large screens.
        className
    );
    return <div className={newClassName}>{children}</div>; //Wraps content inside a <div> with the computed className. Displays any children inside the container.
}


export default Container