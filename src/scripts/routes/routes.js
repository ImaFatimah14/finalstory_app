import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page';
import AddPage from '../pages/add/add-page';
import StoryDetailPage from '../pages/story/story-detail-page';
import MapPage from '../pages/mapPage';
import SavedStoriesPage from '../pages/saved/saved-page';
import NotFoundPage from '../pages/not-found/not-found-page';

const routes = {
  '/404': NotFoundPage,
  '/': LoginPage,
  '/home': HomePage,
  '/about': AboutPage,
  '/tambah': AddPage,
  '/register': RegisterPage,
  '/story/:id': StoryDetailPage,
  '/map': MapPage,
  '/saved': SavedStoriesPage,
};


export default routes;