import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Courses from './pages/Courses';
import CertificateCourses from './pages/CertificateCourses';
import AdvancedCertificateCourses from './pages/AdvancedCertificateCourses';
import NVQCourses from './pages/NVQCourses';
import Diplomas from './pages/Diplomas';
import VCare from './pages/VCare';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="courses" element={<Courses />} />
          <Route path="certificate-courses" element={<CertificateCourses />} />
          <Route path="advanced-certificate-courses" element={<AdvancedCertificateCourses />} />
          <Route path="nvq-courses" element={<NVQCourses />} />
          <Route path="diplomas" element={<Diplomas />} />
          <Route path="v-care" element={<VCare />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
