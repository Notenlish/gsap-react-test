"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

export default function GSAPComponent() {
  const container = useRef<HTMLDivElement>(null);

  // timeline, stored in a ref to allow access in other context-safe functions or other useGSAP hooks
  const tl = useRef<gsap.core.Timeline>();

  const smile2 = useRef<HTMLDivElement>(null);
  const hoverAnim = useRef<gsap.core.Tween>();
  const smile4 = useRef<HTMLDivElement>(null);

  const ghostSize = 100;

  useGSAP(
    () => {
      tl.current = gsap
        .timeline()
        .to(".box", { x: 360 })
        .to(".box", { x: 0 })
        .fromTo(
          ".smile1",
          { translateY: -60 },
          {
            translateY: 60,
            repeat: -1,
            yoyo: true,
            // see: https://gsap.com/docs/v3/Eases/
            // aka easeinout
            // cubic-bezier(0.42, 0, 0.58, 1).
            yoyoEase: "power1.inOut",
            ease: "power1.inOut",
            duration: 1.0,
          }
        )
        .fromTo(
          ".smile3",
          { scaleX: 1.1, scaleY: 0.9, translateY: 10 },
          {
            scaleX: 0.7,
            scaleY: 1.2,
            translateY: -100,
            ease: "power4.in",
            duration: 1.0,
          }
        )
        .to(".smile3", { x: "+=5", duration: 0.1, repeat: -1, yoyo: true })
        .to(".smile3", { x: "-=5", duration: 0.1, repeat: -1, yoyo: true })
        .to(".smile3", { y: "+=8", duration: 0.1, repeat: -1, yoyo: true })
        .to(".smile3", { y: "-=4", duration: 0.1, repeat: -1, yoyo: true });
    },

    // default is [], runs after 1st render
    // give null to make it run every time(eg: no need to refresh)
    { dependencies: [], scope: container }
  ); // <-- scope is to make selectors scoped to that component

  useGSAP(
    () => {
      hoverAnim.current = gsap.to(smile2.current, {
        scale: 1.5,
        ease: "power3.inOut",
        paused: true,
      });

      return () => {
        hoverAnim.current?.kill();
      };
    },
    { dependencies: [], scope: container }
  );
  // defining scope is important to avoid css selector problems.

  useGSAP(
    () => {
      let setGhostX = gsap.quickTo(".smile4", "x", { duration: 0.5, ease: "power1" }),
        setGhostY = gsap.quickTo(".smile4", "y", { duration: 0.5, ease: "power1" });

      const base = smile4.current?.getBoundingClientRect() as DOMRect;
      base.x += ghostSize / 2;
      base.y += ghostSize / 2;

      window.addEventListener("mousemove", (e) => {
        setGhostX(e.clientX - base.x);
        setGhostY(e.clientY - base.y);
      });
    },
    { dependencies: [], scope: container }
  );

  return (
    <div ref={container}>
      <div ref={smile4}>
        <Image
          className="absolute smile4 size-24"
          src="/smile-ghost.svg"
          width={ghostSize}
          height={ghostSize}
          alt="Smiley face"
        />
      </div>
      <div className="relative flex flex-col gap-16">
        <div className="box size-24 text-center grid place-content-center bg-green-600">
          Move x to 360
        </div>

        <div className="flex gap-12">
          <Image
            className="smile1 size-24"
            src="/smile.svg"
            width={100}
            height={100}
            alt="Smiley face"
          />
          <div ref={smile2}>
            <Image
              onMouseEnter={() => {
                hoverAnim.current?.play();
              }}
              onMouseLeave={() => {
                hoverAnim.current?.reverse();
              }}
              className="smile2 size-24 cursor-pointer"
              src="/smile-rect-eyes.svg"
              width={100}
              height={100}
              alt="Smiley face"
            />
          </div>
          <Image
            className="smile3 size-24"
            src="/smile-home.svg"
            width={100}
            height={100}
            alt="Smiley face"
          />
        </div>
      </div>
    </div>
  );
}
