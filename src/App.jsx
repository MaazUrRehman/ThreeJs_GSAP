import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductView from "./components/ProductView";
import Showcase from "./components/ShowCase";
import Performance from "./components/Performance";
import Features from "./components/Features";
import Highlights from "./components/Highlights";
import Footer from "./components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  return (
        <main>
            <Navbar />
            <Hero />
            <ProductView />
            <Showcase />
            <Performance />
            <Features />
            <Highlights />
            <Footer />
            
        </main>
    );
}

export default App;