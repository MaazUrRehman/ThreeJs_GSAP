import { PresentationControls } from "@react-three/drei";
import { useRef } from "react"
import MacBookModel16 from "../models/Macbook-16";
import MacBookModel14 from "../models/Macbook-14";
import gsap from "gsap";
import useGSAP from "../../hooks/useGSAP";

const ANIMATION_DURATION = 1;
const OFFSET_DISTANCE = 5;

const fadeMeshes = (group, opacity) => {
    if (!group) return;

    // Jab show karna ho
    if (opacity === 1) group.visible = true;

    group.traverse((child) => {
        if (child.isMesh) {
            child.material.transparent = true;

            gsap.to(child.material, {
                opacity,
                duration: ANIMATION_DURATION,
                ease: "power2.out",
                onComplete: () => {
                    if (opacity === 0) {
                        group.visible = false;   // 🔥 yeh hi missing tha
                    }
                }
            });
        }
    });
};




const moveGroup = (group, x) => {
    if (!group) return;

    gsap.to(group.position, { x, duration: ANIMATION_DURATION, ease: "power2.out" });
}

const ModelSwitcher = ({ scale, isMobile }) => {
    const smallMacBookRef = useRef();
    const largeMacBookRef = useRef();

    const showLargeMacBook = scale === 0.08 || scale === 0.05;

    useGSAP(() => {

        if (showLargeMacBook) {
            // ---- SHOW LARGE ----
            smallMacBookRef.current.visible = true;
            largeMacBookRef.current.visible = true;

            // Place large off-screen RIGHT first
            gsap.set(largeMacBookRef.current.position, { x: OFFSET_DISTANCE });
            fadeMeshes(largeMacBookRef.current, 1);

            // Animate large to center
            moveGroup(largeMacBookRef.current, 0);

            // Animate small to LEFT and fade out
            moveGroup(smallMacBookRef.current, -OFFSET_DISTANCE);
            fadeMeshes(smallMacBookRef.current, 0);

            // Fully hide small after fade
            gsap.delayedCall(ANIMATION_DURATION, () => {
                smallMacBookRef.current.visible = false;
            });

        } else {
            // ---- SHOW SMALL ----
            smallMacBookRef.current.visible = true;
            largeMacBookRef.current.visible = true;

            // Place small off-screen LEFT first
            gsap.set(smallMacBookRef.current.position, { x: -OFFSET_DISTANCE });
            fadeMeshes(smallMacBookRef.current, 1);

            // Animate small to center
            moveGroup(smallMacBookRef.current, 0);

            // Animate large to RIGHT and fade out
            moveGroup(largeMacBookRef.current, OFFSET_DISTANCE);
            fadeMeshes(largeMacBookRef.current, 0);

            // Fully hide large after fade
            gsap.delayedCall(ANIMATION_DURATION, () => {
                largeMacBookRef.current.visible = false;
            });
        }

    }, [scale]);


    const controlsConfig = {
        snap: true,
        speed: 1,
        zoom: 1,
        azimuth: [-Infinity, Infinity],
        config: { mass: 1, tension: 0, friction: 26 },
    };

    return (
        <>
            <PresentationControls {...controlsConfig}>
                <group ref={largeMacBookRef}>
                    <MacBookModel16 scale={isMobile ? 0.05 : 0.08} />
                </group>
            </PresentationControls>
            <PresentationControls {...controlsConfig}>
                <group ref={smallMacBookRef}>
                    <MacBookModel14 scale={isMobile ? 0.03 : 0.06} />
                </group>
            </PresentationControls>
        </>
    )
}

export default ModelSwitcher