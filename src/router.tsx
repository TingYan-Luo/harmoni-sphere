import Index from './pages/index';
import Home from "./pages/home/index";

/*
 * @author: tingyan.lty
 * @description: 路由配置
 */
export default [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/index',
    element: <Index />,
  }
]