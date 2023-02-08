import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./react-pages/Counter";
import { FetchData } from "./react-pages/FetchData";
import { Home } from "./react-pages/Home";
import Jobs from './react-pages/Jobs';

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    requireAuth: true,
    element: <FetchData />
  },
	{
		path: '/jobs',
		element: <Jobs />
	},
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
