import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import CertificateCourses from './pages/CertificateCourses';
import AdvancedCertificateCourses from './pages/AdvancedCertificateCourses';
import NVQCourses from './pages/NVQCourses';
import Diplomas from './pages/Diplomas';
import VCare from './pages/VCare';
import Elevate from './pages/Elevate';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import RequireAdmin from './admin/RequireAdmin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminCourses from './admin/pages/AdminCourses';
import AdminImages from './admin/pages/AdminImages';
import AdminText from './admin/pages/AdminText';
import AdminSettings from './admin/pages/AdminSettings';
import AdminInquiries from './admin/pages/AdminInquiries';
import AdminAccount from './admin/pages/AdminAccount';
import AdminNews from './admin/pages/AdminNews';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { CourseCatalogProvider } from './context/CourseCatalogContext';

function App() {
  return (
    <AdminAuthProvider>
      {/* SiteContentProvider loads every editable document once, so it must sit
          above CourseCatalogProvider, which reads the catalog out of it. */}
      <SiteContentProvider>
        <CourseCatalogProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* The portal sits outside the public Layout - it has its own
                  chrome, and RequireAdmin gates everything beneath it. */}
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/:category" element={<AdminCourses />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="images" element={<AdminImages />} />
                <Route path="text" element={<AdminText />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="account" element={<AdminAccount />} />
              </Route>

              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutUs />} />
                {/* 'Courses' overview page removed; navigation uses dropdown links */}
                <Route path="certificate-courses" element={<CertificateCourses />} />
                <Route path="advanced-certificate-courses" element={<AdvancedCertificateCourses />} />
                <Route path="nvq-courses" element={<NVQCourses />} />
                <Route path="diplomas" element={<Diplomas />} />
                <Route path="v-care" element={<VCare />} />
                <Route path="elevate" element={<Elevate />} />
                <Route path="contact" element={<Contact />} />
                <Route path="news" element={<News />} />
                <Route path="news/:slug" element={<NewsArticle />} />
              </Route>
            </Routes>
          </Router>
        </CourseCatalogProvider>
      </SiteContentProvider>
    </AdminAuthProvider>
  );
}

export default App;
