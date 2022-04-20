import React from "react";
import { RouteObject } from 'react-router-dom'
import Dashboard from '../pages/dashboard';
import Intro from '../pages/intro';
import Template from "@/pages/template";
import Edit from "../pages/edit";

const routes: RouteObject[] = [
    {
      path: "/",
      element: <Intro />,
    //   children: [
    //     { index: true, element: <Home /> },
    //     {
    //       path: "/courses",
    //       element: <Courses />,
    //       children: [
    //         { index: true, element: <CoursesIndex /> },
    //         { path: "/courses/:id", element: <Course /> },
    //       ],
    //     },
    //     { path: "*", element: <NoMatch /> },
    //   ],
    },
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/template',
      element: <Template />
    },
    {
      path: '/edit',
      element: <Edit />
    },
  ];

export default routes