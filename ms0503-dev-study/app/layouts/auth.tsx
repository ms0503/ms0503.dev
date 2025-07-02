'use strict';

import { Outlet } from 'react-router';

export default function LayoutAuth() {
    return (
        <div className="flex flex-col grow items-center justify-center">
            <Outlet />
        </div>
    );
}
