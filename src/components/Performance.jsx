import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Performance = () => {
  const sectionRef = useRef();
  const images = [
    { id: "p1", src: "/performance1.png", title: "QATAR, 2024", text: "First podium finish" },
    { id: "p2", src: "/performance2.png", title: "MONACO, 2023", text: "Street mastery" },
    { id: "p3", src: "/performance3.png", title: "MIAMI, 2024", text: "Pole Position" },
    { id: "p4", src: "/performance4.png", title: "BRITAIN, 2025", text: "Home glory" },
    { id: "p5", src: "/performance5.jpg", title: "FIA PRIZE, 2024", text: "World recognition" },
    { id: "p6", src: "/performance6.png", title: "ABU DHABI, 2023", text: "Season finale" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial positions - IMAGES VISIBLE FROM START
      images.forEach((img, i) => {
        const isTop = i % 2 === 0;
        
        gsap.set(`#${img.id}`, {
          x: 1000, // Start from right
          y: isTop ? -200 : 200,
          scale: 0.6,
          rotation: isTop ? 12 : -12,
          opacity: 0 // Hidden initially, animate to visible
        });
        
        gsap.set(`.text-${img.id}`, {
          x: 250,
          opacity: 0,
          scale: 0.85
        });
      });

      // SINGLE PIN - Fixed height, no double space
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=150%", // Reduced space
          scrub: 1,
          pin: true,
          pinSpacing: true, // Single spacer only
          anticipatePin: 1
        }
      });

      // Wave animation - all images become visible
      images.forEach((img, i) => {
        const isTop = i % 2 === 0;
        const delay = i * 0.25;
        
        // Images fly in and become visible
        tl.to(`#${img.id}`, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: "back.out(1.7)"
        }, delay);
        
        // Text follows
        tl.to(`.text-${img.id}`, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)"
        }, delay + 0.3);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="performance" // Use your Tailwind classes
      style={{
        backgroundColor: '#000000', // BLACK BG
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      
      {/* Single sticky container - NO DOUBLE */}
      <div className="sticky top-0 w-full h-screen flex items-center justify-center relative">
        <h2 className="absolute top-24 left-1/2 -translate-x-1/2 text-white text-5xl font-semibold z-20">
          PERFORMANCE
        </h2>

        <div className="spread w-full h-full relative flex items-center justify-center">
          {images.map((img, i) => {
            const isTop = i % 2 === 0;
            const widths = [16, 14, 18, 15, 20, 14];
            
            return (
              <div 
                key={img.id}
                className={`spread-item ${isTop ? "top" : "bottom"}`}
                style={{
                  left: `${8 + i * 14}%`,
                  width: `${widths[i]}rem`,
                  zIndex: 20 - i,
                  filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.6))'
                }}
              >
                <img 
                  id={img.id}
                  src={img.src}
                  alt=""
                  className="w-full h-[22rem] md:h-[24rem] object-cover rounded-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300"
                />
                <div 
                  className={`spread-text text-${img.id}`}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="font-bold text-lg text-red-400 mb-1">
                    {img.title}
                  </div>
                  <div className="text-sm opacity-90 italic">
                    {img.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Performance;
