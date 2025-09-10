import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
export default function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Landing />
        }
    ])
    return <RouterProvider router={router} />
}