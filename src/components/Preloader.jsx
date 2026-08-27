"use client";

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import webLogo from '@/assets/web-logo.png';

export default function Preloader() {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const progressBarRef = useRef(null);
  const text1Ref = useRef(null); // INFRONIX
  const text2Ref = useRef(null); // INTRODUCING...
  const text3Ref = useRef(null); // LOADING...

  useEffect(() => {
    // Only run on initial session load
    const hasPlayed = sessionStorage.getItem('infronix_preloader_played');
    if (!hasPlayed) {
      setShouldRender(true);
    }
  }, []);

  useGSAP(() => {
    if (!shouldRender) return;

    let mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('infronix_preloader_played', 'true');
          setShouldRender(false);
        }
      });

      // 1. Initial setups
      gsap.set([text1Ref.current, text2Ref.current, text3Ref.current], { opacity: 0, y: 20 });
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' });

      const counter = { val: 0 };

      tl.to(text1Ref.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })
        .to(text2Ref.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, "-=0.5")
        .to(text3Ref.current, {
          opacity: 0.6,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }, "-=0.6")
        // Blink loading text
        .to(text3Ref.current, {
          opacity: 1,
          duration: 0.5,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut'
        }, "-=0.8")
        // Counter & Progress Bar
        .to(counter, {
          val: 100,
          duration: 2.5,
          ease: 'power2.inOut',
          onUpdate: function () {
            if (counterRef.current) {
              // padStart ensures 00, 01, ..., 100
              counterRef.current.innerText = Math.round(counter.val).toString().padStart(2, '0') + '%';
            }
          }
        }, "-=1.2")
        .to(progressBarRef.current, {
          scaleX: 1,
          duration: 2.5,
          ease: 'power2.inOut'
        }, "<") // Start exactly at the same time as counter
        .to([text1Ref.current, text2Ref.current, text3Ref.current], {
          opacity: 0,
          y: -10,
          duration: 0.5,
          ease: 'power2.in',
          delay: 0.2 // Brief pause at 100%
        })
        .to(counterRef.current, {
          opacity: 0,
          duration: 0.3
        }, "<")
        .to(progressBarRef.current, {
          opacity: 0,
          duration: 0.3
        }, "<")
        // Finally, slide up the whole preloader
        .to(containerRef.current, {
          yPercent: -100,
          duration: 1,
          ease: 'power4.inOut'
        });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Reduced motion: Just fade out quickly
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('infronix_preloader_played', 'true');
          setShouldRender(false);
        }
      });
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 1 // show for 1s then fade
      });
    });

    return () => mm.revert();
  }, { dependencies: [shouldRender], scope: containerRef });

  if (!shouldRender) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-navy-muted flex flex-col justify-between p-8 md:p-16"
      aria-hidden="true"
    >
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <div ref={text1Ref} className="mb-6 flex justify-center">
          <img
            src={webLogo.src || webLogo}
            alt="Infronix Logo"
            className="h-24 sm:h-32 md:h-40 lg:h-48 w-auto object-contain brightness-0 invert drop-shadow-lg"
          />
        </div>
        <p
          ref={text2Ref}
          className="font-label-caps text-xs sm:text-sm text-champagne-light tracking-[0.3em] uppercase font-bold"
        >
          Introducing the Infronix Web Agency
        </p>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <span
            ref={text3Ref}
            className="font-label-caps text-[10px] sm:text-xs text-slate-400 tracking-widest uppercase font-bold"
          >
            Loading your experience...
          </span>
          <span
            ref={counterRef}
            className="font-headline-lg text-2xl sm:text-4xl text-champagne-light font-bold"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            00%
          </span>
        </div>

        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
          <div
            ref={progressBarRef}
            className="absolute top-0 left-0 h-full w-full bg-champagne-light origin-left scale-x-0"
          ></div>
        </div>
      </div>
    </div>
  );
}
