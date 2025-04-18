import React, { useRef } from 'react'
import NavBar from './components/NavBar/NavBar';
import Home from './components/homep/Home';
import Features from './components/Featuresp/Features';
import OurService from  './components/OurServicep/OurService';
import AboutUs from './components/Contac/AboutUs';



const App = () => {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const serviceRef = useRef(null);
  const featuresRef = useRef(null);
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
    <NavBar
      onHomeClick={() => scrollToSection(homeRef)}
      onServiceClick={() => scrollToSection(serviceRef)}
      onFeaturesClick={() => scrollToSection(featuresRef)}
      onAboutClick={() => scrollToSection(aboutRef)}

    />

    <div ref={homeRef}>
      <Home />
    </div>
    <div ref={serviceRef}>
      <OurService />
    </div>
    <div ref={featuresRef}>
      <Features />
    </div>

  
    <div ref={aboutRef}>
      <AboutUs />
    </div>

  </div>

  )
}

export default App
