import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { PropertyDetails } from './pages/PropertyDetails';
import { AuthPage } from './pages/AuthPages';
import { UserProvider } from './components/UserContext';
import { NotFound } from './pages/notFound';
import { UploadForm } from './components/UploadForm';
import { UpDateForm } from './components/UpdateForm';
import { FavoritesPage } from './pages/FavoritePage';

export default function App() {
  return (
    <UserProvider>
      <Navbar /> {/* Navbar appears on all pages */}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/property/:propertyId" element={<PropertyDetails />} />
        <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
        <Route path="/sign-in" element={<AuthPage mode="sign-in" />} />
        <Route path="/upload" element={<UploadForm />} />
        <Route path="/update/:propertyId" element={<UpDateForm />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  );
}
