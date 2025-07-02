'use strict';

import Sidebar from '../components/sidebar';
import { Outlet } from 'react-router';

export default function LayoutApp() {
    return (
        <div className="flex flex-row min-h-screen w-full">
            <Sidebar className="grow-0 p-4 shrink" />
            <div
                className="
                    border-l grow p-6 shrink
                    border-text
                    dark:border-text-dark
                "
            >
                <Outlet />
            </div>
        </div>
    );
}
