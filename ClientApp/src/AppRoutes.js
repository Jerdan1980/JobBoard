import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { Counter } from "./react-pages/Counter";
import { FetchData } from "./react-pages/FetchData";
import Home from "./react-pages/Home";
import Jobs from './react-pages/Jobs';
import Competitions from './react-pages/competitions/Competitions';
import CompetitionHome from './react-pages/competitions/CompetitionHome';
import CompetitionCreate from './react-pages/competitions/CompetitionCreate';
import CompetitionUpdate from './react-pages/competitions/CompetitionUpdate';
import Tags from './react-pages/tags/Tags';
import TagHome from './react-pages/tags/TagHome';
import TagCreate from './react-pages/tags/TagCreate';
import TagUpdate from './react-pages/tags/TagUpdate';
import Industries from './react-pages/industries/Industries';

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
	{
		path: '/competitions',
		element: <Competitions />
	},
	{
		path: '/competition',
		element: <CompetitionHome />
	},
	{
		path: '/competitions/create',
		requireAuth: true,
		element: <CompetitionCreate />
	},
	{
		path: '/competitions/edit',
		requireAuth: true,
		element: <CompetitionUpdate />
	},
	{
		path: 'tags',
		element: <Tags />
	},
	{
		path: 'tag',
		element: <TagHome />
	},
	{
		path: 'tags/create',
    requireAuth: true,
		element: <TagCreate />
	},
	{
		path: 'tags/edit',
    requireAuth: true,
		element: <TagUpdate />
	},
	{
		path: 'industries',
		element: <Industries />
	},
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
