import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Existing pages
import Home from './Pages/Home';
import Convert from './Pages/Convert';
import LearnSign from './Pages/LearnSign';
import Videos from './Pages/Videos';
import Video from './Pages/Video';
import CreateVideo from './Pages/CreateVideo';

// Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

// 🔹 New pages you added
import Practice from "./Pages/practice";
import Dictionary from "./Pages/dictionary";
import About from "./Pages/about";
import Challenges from "./Pages/challenges";
import Dashboard from "./Pages/dashboard";
import AvatarLab from "./Pages/avatarlab";
import Playground from "./Pages/playground";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        
        <Routes>
          {/* Existing routes */}
          <Route exact path='/sensebridge-nexus/home' element={<Home />} />
          <Route exact path='/sensebridge-nexus/convert' element={<Convert />} />
          <Route exact path='/sensebridge-nexus/learn-sign' element={<LearnSign />} />
          <Route exact path='/sensebridge-nexus/all-videos' element={<Videos />} />
          <Route exact path='/sensebridge-nexus/video/:videoId' element={<Video />} />
          <Route exact path='/sensebridge-nexus/create-video' element={<CreateVideo />} />

          {/* 🔹 New pages */}
          <Route exact path='/sensebridge-nexus/practice' element={<Practice />} />
          <Route exact path='/sensebridge-nexus/dictionary' element={<Dictionary />} />
          <Route exact path='/sensebridge-nexus/about' element={<About />} />
          <Route exact path='/sensebridge-nexus/challenges' element={<Challenges />} />
          <Route exact path='/sensebridge-nexus/dashboard' element={<Dashboard />} />
          <Route exact path='/sensebridge-nexus/avatar-lab' element={<AvatarLab />} />
          <Route exact path='/sensebridge-nexus/playground' element={<Playground />} />

          {/* Default fallback */}
          <Route path='*' element={<Home />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
