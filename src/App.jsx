import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductView from "./components/ProductView";
import Showcase from "./components/ShowCase";

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
            
        </main>
    );
}

export default App;