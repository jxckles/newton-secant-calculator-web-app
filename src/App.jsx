import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import HomePage from './routes/HomePage.jsx';
import MethodComparisonPage from './routes/MethodComparisonPage.jsx';
import NewtonRaphsonPage from './routes/NewtonRaphsonPage.jsx';
import SecantMethodPage from './routes/SecantMethodPage.jsx';
import AboutPage from './routes/AboutPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="newton-raphson" element={<NewtonRaphsonPage />} />
        <Route path="secant-method" element={<SecantMethodPage />} />
        <Route path="comparison" element={<MethodComparisonPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;