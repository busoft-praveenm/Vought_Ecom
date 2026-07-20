"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function AnimatedLogo() {
  const container = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const shards = gsap.utils.toArray('.animated-shard');
    const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

    // Set initial randomized states for the shatter effect
    shards.forEach((el: any) => {
      gsap.set(el, {
        x: getRandom(-400, 400),
        y: getRandom(-400, 400),
        z: getRandom(-200, 200),
        rotationX: getRandom(-360, 360),
        rotationY: getRandom(-360, 360),
        rotationZ: getRandom(-360, 360),
        scale: 0,
        opacity: 0,
        transformOrigin: "50% 50%"
      });
    });

    timeline.current = gsap.timeline({
      repeat: -1,
      yoyo: true,
    });

    timeline.current.to(shards, {
      x: 0,
      y: 0,
      z: 0,
      opacity: 1,
      scale: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      duration: 1.2,
      stagger: 0.01,
      ease: "power4.inOut"
    });

    // Hold the assembled state for 2 seconds before yoyoing backward
    timeline.current.to({}, { duration: 2 });

  }, { scope: container });

  const text = "Vought India";

  return (
    <div 
      ref={container} 
      className="w-full max-w-xl mb-6 relative perspective-1000"
    >
      <h1 className="text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg flex flex-wrap whitespace-pre">
        {text.split('').map((char, index) => {
          if (char === ' ') {
            return <span key={index} className="inline-block w-4"></span>;
          }
          return (
            <span key={index} className="relative inline-block">
              {/* Invisible placeholder to maintain layout flow */}
              <span className="invisible">{char}</span>
              
              {/* Four shards using CSS clip-path to break the letter into triangles */}
              <span className="animated-shard absolute inset-0 text-white" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }}>{char}</span>
              <span className="animated-shard absolute inset-0 text-white" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}>{char}</span>
              <span className="animated-shard absolute inset-0 text-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)' }}>{char}</span>
              <span className="animated-shard absolute inset-0 text-white" style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}>{char}</span>
            </span>
          );
        })}
      </h1>
    </div>
  );
}
