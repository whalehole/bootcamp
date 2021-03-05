import React from 'react';
import ReactDOM from 'react-dom';
// REDUX
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reduxStore';
// ROUTER
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
// BOOTSTRAP
// COMPONENTS
import HomePage from './Components/home_page';
import UserGatePage from './Components/usergate_page';
import SubmissionPage from './Components/submission_page';
import CharartPage from './Components/charart_page';
import CharPage from './Components/char_page';
import SearchResultPage from './Components/searchresult_page';
import SettingsPage from './Components/settings_page';
import DashboardPage from './Components/dashboard_page';
// MIX
import './index.css';
import reportWebVitals from './reportWebVitals';
import { QueryClientProvider, QueryClient } from 'react-query';

const queryClient = new QueryClient()

const store = createStore(rootReducer)

// DECCRA APP 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <Router>
          <Route path="/" component={UserGatePage}/>
          <Route exact path={["/", "/chars", "/feed"]} component={HomePage}/>
          <Route path="/" component={SubmissionPage}/>
          <Route path="/charart" component={CharartPage}/>
          <Route path="/char" component={CharPage}/>
          <Route path="/search" component={SearchResultPage}/>
          <Route path="/settings" component={SettingsPage}/>
          <Route path="/dashboard" component={DashboardPage}/>
      </Router>
    </Provider>
  </QueryClientProvider>
)




ReactDOM.render(
  <React.StrictMode><App /></React.StrictMode>, document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
