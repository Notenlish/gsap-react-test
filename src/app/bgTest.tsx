"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

export default function Background() {
  const pawSize = 100;
  const stepSize = 100;
  const container = useRef<HTMLDivElement>(null);
  const paw = useRef<HTMLDivElement>(null);

  const pawY = useRef(0);
  const pawX = useRef(0);

  useGSAP(
    () => {
      gsap.set(".paw1", { transformOrigin: "50% 50%" });

      let animPawX = gsap.quickTo(".paw1", "x", { duration: 0.005, ease: "power1" }),
        animPawY = gsap.quickTo(".paw1", "y", { duration: 0.005, ease: "power1" }),
        animPawRot = gsap.quickTo(".paw1", "rotation", {
          duration: 0.005,
          ease: "power1",
        });

      // const base = container.current?.getBoundingClientRect() as DOMRect;
      const pawrect = paw.current?.getBoundingClientRect() as DOMRect;
      // center
      pawrect.x += pawSize / 2;
      pawrect.y += pawSize / 2;

      window.addEventListener("mousemove", (e) => {
        const absStartX = pawX.current;
        const absStartY = pawY.current;

        const absTargetX = e.clientX;
        const absTargetY = e.clientY;

        const relTargetX = e.clientX - pawrect.x;
        const relTargetY = e.clientY - pawrect.y;

        const difx = absStartX - absTargetX,
          dify = absStartY - absTargetY;
        const diflen = Math.sqrt(difx ** 2 + dify ** 2);

        // normalized difference(vector2)
        const norDifX = difx / diflen,
          nordifY = dify / diflen;

        const rotRad = Math.atan2(-norDifX, nordifY);
        const rotDegrees = (rotRad / 2 / Math.PI) * 360;

        if (diflen > stepSize) {
          animPawX(relTargetX);
          pawX.current = absTargetX;
          animPawY(relTargetY);
          pawY.current = absTargetY;
          animPawRot(rotDegrees);
        }
      });
    },
    { dependencies: [], scope: container }
  );

  return (
    <div ref={container}>
      <div className="absolute paw1" ref={paw}>
        <Image width={pawSize} height={pawSize} src="/paw.svg" alt="Paw Vector" />
      </div>
    </div>
  );
}
