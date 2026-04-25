import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Bubbles from './components/Bubbles';

function App() {
  return (
    <Router>
      <Bubbles />
      {/* Background is handled in index.css body. No dark mode classes. */}
      <div className="min-h-screen flex flex-col relative z-10">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
