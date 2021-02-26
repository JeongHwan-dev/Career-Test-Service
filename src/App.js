import Test from './components/Test';
import Result from './components/Result';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <HashRouter>
        <Route path="/" exact={true} component={Test} />
        <Route path="/result" component={Result} />
      </HashRouter>
    </>
  );
}

export default App;
