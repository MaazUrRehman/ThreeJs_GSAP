import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Performance = () => {
  const sectionRef = useRef();
  const containerRef = useRef();
  
  const images = [
    { id: "p1", src: "/performance1.png", title: "QATAR, 2024", text: "First podium finish" },
    { id: "p2", src: "/performance2.png", title: "MONACO, 2023", text: "Street mastery" },
    { id: "p3", src: "/performance3.png", title: "MIAMI, 2024", text: "Pole Position" },
    { id: "p4", src: "/performance4.png", title: "BRITAIN, 2025", text: "Home glory" },
    { id: "p5", src: "/performance5.jpg", title: "FIA PRIZE, 2024", text: "World recognition" },
    { id: "p6", src: "/performance6.png", title: "ABU DHABI, 2023", text: "Season finale" },
  ];

  useEffect(() => {
    // Clear existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    const ctx = gsap.context(() => {
      // Set initial positions - show images initially
      gsap.set('.performance-image', {
        x: 800,
        opacity: 0,
        scale: 0.8,
        rotation: 0
      });

      gsap.set('.performance-text', {
        x: 200,
        opacity: 0,
        scale: 0.9
      });

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center",
          end: "+=150%",
          scrub: 1,
          pin: containerRef.current,
          anticipatePin: 1,
          markers: false,
        }
      });

      // Wave sequence animation
      images.forEach((img, i) => {
        const isTop = i % 2 === 0;
        const waveDelay = i * 0.2;
        const yoyoScale = 1 + (i % 3) * 0.1;
        
        // Image animation
        tl.to(`#${img.id}`, {
          x: 0,
          y: 0,
          scale: yoyoScale,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        }, waveDelay);
        
        // Yo-yo effect
        tl.to(`#${img.id}`, {
          scale: 1,
          y: isTop ? -15 : 15,
          duration: 0.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1
        }, waveDelay + 0.4);
        
        // Text animation
        tl.to(`.text-${img.id}`, {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, waveDelay + 0.3);
      });

      // Remove continuous wave motion to prevent conflicts
      // Add smooth scrolling wave effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          
          images.forEach((img, i) => {
            const isTop = i % 2 === 0;
            const waveHeight = Math.sin(progress * Math.PI * 2 + i * 0.5) * 20;
            
            gsap.to(`#${img.id}`, {
              y: waveHeight * (isTop ? -1 : 1),
              duration: 0.1,
              overwrite: "auto"
            });
          });
        }
      });

    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      style={{
        width: '100vw',
        height: '150vh', // Reduced height for single container
        backgroundColor: '#000000', // Black background
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Single container with sticky positioning */}
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h2 style={{
          position: 'absolute',
          top: '3rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '4rem',
          fontWeight: 900,
          zIndex: 100,
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          textShadow: '0 10px 30px rgba(0,0,0,0.8)',
          background: 'linear-gradient(45deg, #ffffff, #cccccc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          PERFORMANCE
        </h2>

        {/* Image container */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {images.map((img, i) => {
            const isTop = i % 2 === 0;
            const widths = [16, 14, 18, 15, 20, 14];
            const leftPositions = [5, 22, 39, 56, 73, 90];
            
            return (
              <div 
                key={img.id}
                style={{
                  position: 'absolute',
                  left: `${leftPositions[i]}%`,
                  top: isTop ? '15%' : 'auto',
                  bottom: isTop ? 'auto' : '15%',
                  width: `${widths[i]}rem`,
                  zIndex: 10 - i
                }}
              >
                <img 
                  id={img.id}
                  src={img.src}
                  alt=""
                  className="performance-image"
                  style={{
                    width: '100%',
                    height: isTop ? '24rem' : '20rem',
                    objectFit: 'cover',
                    borderRadius: '0.75rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                    filter: 'brightness(0.95) saturate(1.1)',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255,255,255,0.15)',
                    display: 'block' // Ensure image is shown
                  }}
                  onMouseEnter={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      filter: 'brightness(1.2) saturate(1.3)',
                      borderColor: 'rgba(255,255,255,0.3)',
                      duration: 0.3
                    });
                  }}
                  onMouseLeave={(e) => {
                    gsap.to(e.currentTarget, {
                      scale: 1,
                      filter: 'brightness(0.95) saturate(1.1)',
                      borderColor: 'rgba(255,255,255,0.15)',
                      duration: 0.3
                    });
                  }}
                />
                <div 
                  className={`performance-text text-${img.id}`}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    [isTop ? 'bottom' : 'top']: '-5rem',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '0.8rem',
                    width: '100%',
                    textAlign: 'left',
                    backdropFilter: 'blur(8px)',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'block' // Ensure text is shown
                  }}
                >
                  <div style={{ 
                    fontWeight: 800, 
                    marginBottom: '0.25rem',
                    fontSize: '1rem',
                    color: '#ff6b6b'
                  }}>
                    {img.title}
                  </div>
                  <div style={{ 
                    fontStyle: 'italic',
                    opacity: 0.95,
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em'
                  }}>
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