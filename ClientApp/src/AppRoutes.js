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
import TagCreate from './react-pages/tags/TagCreate';
import TagUpdate from './react-pages/tags/TagUpdate';
import Industries from './react-pages/industries/Industries';
import ResumeSettings from './react-pages/user/ResumeSettings';
import PreferencesSettings from './react-pages/user/PreferencesSettings';
import Dashboard from './react-pages/user/Dashboard';
import Awards from './react-pages/user/Awards';
import BioSettings from './react-pages/user/BioSettings';

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
	{
		path: 'self/resume',
		requireAuth: true,
		element: <ResumeSettings />
	},
	{
		path: 'self/preferences',
		requireAuth: true,
		element: <PreferencesSettings />
	},
	{
		path: 'self/awards',
		requireAuth: true,
		element: <Awards />
	},
	{
		path: 'self/bio',
		requireAuth: true,
		element: <BioSettings />
	},
	{
		path: 'self',
		requireAuth: true,
		element: <Dashboard />
	},
  ...ApiAuthorzationRoutes
];

export default AppRoutes;
