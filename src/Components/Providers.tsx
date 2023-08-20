"use client"

import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface IProvidersProps {
    children: ReactNode
}

const Providers: React.FunctionComponent<IProvidersProps> = ({ children }) => {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />{children}
        </>);
};

export default Providers;
