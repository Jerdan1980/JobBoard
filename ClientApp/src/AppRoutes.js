import ApiAuthorzationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import Home from './react-pages/Home';
import Jobs from './react-pages/jobs/Jobs';
import JobCreate from './react-pages/jobs/JobCreate';
import JobUpdate from './react-pages/jobs/JobUpdate';
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
import CompetitionAward from './react-pages/competitions/CompetitionAward';
import Swagger from './react-pages/Swagger';

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: '/jobs',
    element: <Jobs />,
  },
  {
    path: '/jobs/create',
    requireAuth: true,
    element: <JobCreate />,
  },
  {
    path: '/jobs/edit',
    requireAuth: true,
    element: <JobUpdate />,
  },
  {
    path: '/competitions',
    element: <Competitions />,
  },
  {
    path: '/competition',
    element: <CompetitionHome />,
  },
  {
    path: '/competitions/create',
    requireAuth: true,
    element: <CompetitionCreate />,
  },
  {
    path: '/competitions/edit',
    requireAuth: true,
    element: <CompetitionUpdate />,
  },
  {
    path: '/competitions/award',
    requireAuth: true,
    element: <CompetitionAward />,
  },
  {
    path: 'tags',
    element: <Tags />,
  },
  {
    path: 'tags/create',
    requireAuth: true,
    element: <TagCreate />,
  },
  {
    path: 'tags/edit',
    requireAuth: true,
    element: <TagUpdate />,
  },
  {
    path: 'industries',
    element: <Industries />,
  },
  {
    path: 'self/resume',
    requireAuth: true,
    element: <ResumeSettings />,
  },
  {
    path: 'self/preferences',
    requireAuth: true,
    element: <PreferencesSettings />,
  },
  {
    path: 'self/awards',
    requireAuth: true,
    element: <Awards />,
  },
  {
    path: 'self/bio',
    requireAuth: true,
    element: <BioSettings />,
  },
  {
    path: 'self',
    requireAuth: true,
    element: <Dashboard />,
  },
  {
    path: 'swag',
    element: <Swagger />,
  },
  ...ApiAuthorzationRoutes,
];

export default AppRoutes;
