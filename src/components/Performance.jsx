import { performanceImages, performanceImgPositions } from '../constants'
import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Performance = () => {
  const sectionRef = useRef();

  useGSAP(() => {
    // Mobile text animation (for all screen sizes)
    gsap.fromTo(
      ".content p",
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".content",
          start: "top 80%",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        },
      }
    );

    // Mobile image fade-in animation (for screens smaller than 1025px)
    const mm = gsap.matchMedia();

    mm.add("(max-width: 1024px)", () => {
      performanceImages.forEach((img, index) => {
        if (img.id === 'p5') return; // Skip p5 as requested

        gsap.fromTo(
          `#${img.id}`,
          { autoAlpha: 0, scale: 0.8, y: 30 },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: `#${img.id}`,
              start: "top 85%",
              toggleActions: "play none none reverse",
              invalidateOnRefresh: true,
            }
          }
        );
      });
    });

    // Desktop animation with scrubbed timeline (min-width: 1025px)
    mm.add("(min-width: 1025px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + sectionRef.current.offsetHeight * 2,      // 👈 scroll distance control
          scrub: 1,
          pin: true,          // 👈 section stays fixed while animating
          anticipatePin: 1,
        }
      });
      // Initial state: all images stacked and faded
      gsap.set(".wrapper img", {
        autoAlpha: 0,
        scale: 0.85,
        left: "50%",
        bottom: "45%",
        xPercent: -50,
        yPercent: -50
      });


      // Animate each image to its final position from constants
      // Filter out p5 as requested
      const imagesToAnimate = performanceImages.filter(img => img.id !== 'p5');

      imagesToAnimate.forEach(img => {
        const position = performanceImgPositions[img.id];
        if (position) {
          tl.fromTo(
            `#${img.id}`,
            {
              autoAlpha: 0,
              scale: 0.8,
              x: 0,
              y: 50,
              rotation: -5
            },
            {
              autoAlpha: 1,
              scale: 1,
              left: position.left || "auto",
              right: position.right || "auto",
              bottom: position.bottom || "auto",
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              duration: 1,
              ease: "power2.out"
            },
            "<0.2" // Stagger the animations slightly
          );

          // Add transform properties if they exist in constants
          if (position.transform) {
            tl.to(
              `#${img.id}`,
              {
                ...position.transform,
                duration: 1,
                ease: "power2.out"
              },
              "<"
            );
          }
        }
      });

      // Text animation for desktop with scrub
      tl.fromTo(
        ".content p",
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        },
        ">0.3" // Start after images have begun animating
      );
    });
  }, { scope: sectionRef });

  return (
    <section id="performance" ref={sectionRef}>
      <h2>Next Level Graphics Performance, Game On</h2>

      <div className="wrapper">
        {performanceImages.map(({ id, src }) => (
          <img
            key={id}
            id={id}
            className={`performance-img ${id}`}
            src={src}
            alt={id}
          />
        ))}
      </div>

      <div className="content">
        <p>
          Run graphics-intensive apps and games with ease on the new MacBook Pro,
          powered by the blazing-fast M4 Pro and M4 Max chips.
          <span className="text-white">
            Experience up to
            12-core CPU performance and up to 38-core GPU performance, delivering
            up to 4x faster graphics performance than the previous generation.
          </span>
          Whether you're editing 8K video, rendering complex 3D scenes, or
          playing the latest games, the MacBook Pro handles it all with incredible
          speed and efficiency.
        </p>
      </div>
    </section>
  )
}

export default Performance