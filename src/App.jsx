import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
