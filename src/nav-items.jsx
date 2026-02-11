import { HomeIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Benmodel from "./pages/Benmodel.jsx";
import Yemodel from "./pages/Yemodel.jsx";
import Jiamodel from "./pages/Jiamodel.jsx";
import Mubiaopage from "./pages/Mubiaopage.jsx";
import Kaifatoolpage from "./pages/Kaifatoolpage.jsx";
import Yingshepage from "./pages/Yingshepage.jsx";
import Ceshipage from "./pages/Ceshipage.jsx";
import Gongnengpage from "./pages/Gongnengpage.jsx";
import Anquanpage from "./pages/Anquanpage.jsx";
import Zhishipage from "./pages/Zhishipage.jsx";
import LawToolchain from "./pages/LawToolchain.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
/**
* Central place for defining the navigation items. Used for navigation components and routing.
*/
export const navItems = [
{
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
},
{
    title: "Register",
    to: "/register",
    page: <Register />,
},
{
    title: "Login",
    to: "/login",
    page: <Login />,
},
{
    title: "LawToolchain",
    to: "/law-toolchain",
    page: <LawToolchain />,
},
{
    title: "Benmodel",
    to: "/benmodel",
    page: <Benmodel />,
},
{
    title: "Yemodel",
    to: "/yemodel",
    page: <Yemodel />,
},
{
    title: "Jiamodel",
    to: "/jiamodel",
    page: <Jiamodel />,
},

{
    title: "Mubiaopage",
    to: "/mubiaopage",
    page: <Mubiaopage />,
},
{
    title: "Kaifatoolpage",
    to: "/kaifatoolpage",
    page: <Kaifatoolpage />,
},
{
    title: "Yingshepage",
    to: "/yingshepage",
    page: <Yingshepage />,
},
{
    title: "Ceshipage",
    to: "/testing-platform",
    page: <Ceshipage />,
},
{
    title: "Gongnengpage",
    to: "/gongnengpage",
    page: <Gongnengpage />,
},
{
    title: "Anquanpage",
    to: "/anquanpage",
    page: <Anquanpage />,
},
{
    title: "Zhishipage",
    to: "/intellectual-property",
    page: <Zhishipage />,
},
];
