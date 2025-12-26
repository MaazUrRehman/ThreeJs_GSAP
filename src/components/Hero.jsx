import {useRef, useEffect} from 'react';

const Hero = () => {
    const videoRef = useRef();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 2;
        }
    }, []);

  return (
    <section id='hero' className='pt-30'>
        <div>
            <h1>Mac Book Pro</h1>
            <img src="/title.png" alt="Macbook Title" />
        </div>
        <video ref={videoRef} src="/videos/hero.mp4" autoPlay muted playsInline></video>
        <button>Buy Now</button>
        <p>From $1999 or $41.62/mo. for 24 mo. after trade-in</p>
    </section>
  )
}

export default Hero