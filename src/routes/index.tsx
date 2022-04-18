import { RouteObject } from 'react-router-dom'
import Dashboard from '../pages/dashboard';
import Intro from '../pages/intro';

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
    }
  ];

export default routes