import React from "react";
import Model from "./Model";

const PageExperience = () => {
  return (
    <section className="w-full relative min-h-screen">
      {/* 3D fixed behind EVERYTHING */}
      <div className="fixed inset-0 z-0">
        <Model />
      </div>

      {/* Grid lines floating between model and text */}
      <div className="size-full absolute inset-0 flex justify-evenly pointer-events-none z-10 opacity-20">
        <div className="h-full shrink-0 w-px bg-white"></div>
        <div className="h-full shrink-0 w-px bg-white"></div>
        <div className="h-full shrink-0 w-px bg-white"></div>
        <div className="h-full shrink-0 w-px bg-white"></div>
        <div className="h-full shrink-0 w-px bg-white"></div>
      </div>

      <div className="relative z-20">
        <div className="h-screen w-full flex items-end p-12">
          <h1 className="text-[12vw] tracking-tight text-white leading-none uppercase italic font-black drop-shadow-2xl">
            Precision
          </h1>
        </div>

        <div className=" w-full py-24 space-y-24 text-white">
          <div className="flex p-12">
            <div className="max-w-sm">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Iconic Racing
              </h2>
              <p className="text-lg opacity-70">
                The BMW M3 GTR is a legend of the track, famous for its dominance
                in the American Le Mans Series and its iconic V8 engine.
              </p>
            </div>
          </div>

          <div className="flex p-12 justify-end">
            <div className="max-w-sm">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Peak Performance
              </h2>
              <p className="text-lg opacity-70">
                Engineered for speed and agility, every line of the M3 GTR
                was designed to maximize aerodynamic downforce and cooling.
              </p>
            </div>
          </div>

          <div className="flex p-12">
            <div className="max-w-sm">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                German Engineering
              </h2>
              <p className="text-lg opacity-70">
                A masterpiece of automotive design, combining aggressive
                styling with a chassis built for pure competitive racing.
              </p>
            </div>
          </div>

          <div className="flex p-12 justify-end">
            <div className="max-w-sm">
              <h2 className="text-4xl font-bold tracking-tight mb-4">
                Street Legend
              </h2>
              <p className="text-lg opacity-70">
                Immortalized in automotive culture, the GTR remains one
                of the most recognizable silhouettes in racing history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageExperience;
