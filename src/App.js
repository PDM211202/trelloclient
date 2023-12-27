import './css/main.css'

import { createBrowserHistory } from "history";
import { Router, Switch } from "react-router-dom";
import Login from './pages/Login/Login';
import HomeTemplates from './templates/HomeTemplates/HomeTemplates';
import Home from './pages/Home/Home';


export const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Switch>
        <Login path="/login" />
        <HomeTemplates path="/home" exact Component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
