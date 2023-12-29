import './css/main.css'
import './css/workspace.css'
import './css/project.css'

import { createBrowserHistory } from "history";
import { Router, Switch } from "react-router-dom";
import Login from './pages/Login/Login';
import HomeTemplates from './templates/HomeTemplates/HomeTemplates';
import Home from './pages/Home/Home';
import Project from './pages/Project/Project';
import Workspace from './pages/workspace/Workspace';


export const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Login path="/login" />
        <HomeTemplates path="/home" exact Component={Home} />
        <HomeTemplates path="/project" exact Component={Project} />
        <HomeTemplates path="/workspacemanager" exact Component={Workspace} />
      </Switch>
    </Router>
  );
}

export default App;
