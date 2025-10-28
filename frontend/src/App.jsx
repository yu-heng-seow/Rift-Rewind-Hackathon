import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from '@/layout/Landing';
import Loading from '@/layout/Loading';
import Statistics from '@/layout/Statistics';
import TestLayout from '@/layout/TestLayout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestLayout />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/test" element={<TestLayout />} />
        {/* Handle 404 Not Found pages */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}