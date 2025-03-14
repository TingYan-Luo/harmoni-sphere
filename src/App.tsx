import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './router';
import './App.less';

const MRouter = () => {
  const routerRender = useRoutes(routes);
  return routerRender;
}

function App() {
  return (
    <div>
      <BrowserRouter>
        <MRouter />
      </BrowserRouter>
    </div>
  );
}

export default App
