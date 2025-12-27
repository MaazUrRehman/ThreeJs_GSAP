import { useMediaQuery } from '@mui/material';
import gsap from "gsap";
import useGSAP from "../hooks/useGSAP";
import { useRef } from "react";


const Showcase = () => {
    const isTablet = useMediaQuery('(max-width: 1024px)');
    const showcaseRef = useRef();
    const contentRef = useRef();
    const maskRef = useRef();


    useGSAP(() => {
        if (!isTablet) {

            gsap.set(contentRef.current, { opacity: 0, y: 80 });
            gsap.set(maskRef.current, { opacity: 0 });

            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: showcaseRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    pin: true,

                    onEnter: () => showcaseRef.current.classList.add("is-active"),
                    onLeaveBack: () => showcaseRef.current.classList.remove("is-active"),
                }
            });

            timeline
                .to(maskRef.current, { opacity: 1 }, 0)
                .to(maskRef.current.querySelector("img"), { scale: 1.1 }, 0)
                .to(contentRef.current, { opacity: 1, y: 0, ease: "power1.out" }, 0.2);

        }
    }, [isTablet]);



    return (
        <section id="showcase" ref={showcaseRef}>
            <div className="media">
                <video src="/videos/game.mp4" loop muted autoPlay playsInline />
                <div className="mask" ref={maskRef}>
                    <img src="/mask-logo.svg" alt="Mask Logo" />
                </div>
            </div>

            <div className="content" ref={contentRef}>
                <div className="wrapper">
                    <div className="lg:max-w-md">
                        <h2>Rocket Chip</h2>
                        <div className="space-y-5 mt-7 pe-10">
                            <p>
                                Introducing {" "}
                                <span className="text-white">
                                    M4, the nest generation of Apple Silicon
                                </span>
                                . M4 powers
                            </p>
                            <p>
                                It drive Apple Intelligence on iPad Pro, so you can write, create and acomplish with more ease. All in a design that's unbelievably thin, light and powerful.
                            </p>
                            <p>
                                A brand new display engine delivers stunning color accuracy and higher brightness for your HDR content. And with M4's advanced power efficiency, iPad Pro now offers up to 12 hours of battery life.
                            </p>
                            <p className="text-primary">Learn more about Apple Inteligence</p>
                        </div>
                    </div>
                    <div className="max-w-3xs space-y-14">
                        <div className="space-y-2">
                            <p>Up to</p>
                            <h3>4x faster</h3>
                            <p>Pro rendering performance than M2</p>
                        </div>
                        <div className="space-y-2">
                            <p>Up to</p>
                            <h3>1.5x faster</h3>
                            <p>CPU performance than M2</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Showcase;