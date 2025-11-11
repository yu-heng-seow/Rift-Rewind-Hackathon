import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '@/layout/Landing';
import TestLayout from '@/layout/TestLayout';
import TestAPI from '@/layout/TestAPI';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test" element={<TestAPI />} />
        <Route path="/" element={<Landing />} />
        <Route path="/yes" element={<TestLayout />} />
        <Route path="/riot.txt" element={<RiotText />} />
        {/* Handle 404 Not Found pages */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}