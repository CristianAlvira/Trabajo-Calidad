import React from "react";

export const Comments = () => {
  return (
    <section className="bg-blue-100 px-6 py-16 sm:py-24 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.purple.700),white)] opacity-10" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-amber-600/10 ring-1 ring-amber-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <img className="mx-auto h-22" src="/img/2.svg" />
        <figure className="mt-10">
          <blockquote className="text-center text-xl font-medium leading-8 text-gray-900 sm:text-1xl sm:leading-9">
            <p>
            La evaluación de la calidad de software a menudo se percibe como un proceso monótono y repetitivo, 
            pero en TechAssess buscamos cambiar esa percepción. Nuestra misión es desarrollar un sistema funcional y 
            repleto de soluciones innovadoras y eficientes para tus necesidades de software. Prepárate para 
            sorprenderte con los resultados que podemos ofrecer.
            </p>
          </blockquote>
          <figcaption className="mt-10">
            <img className="mx-auto h-20 w-20 rounded-full" src="./img/logo.jpg" />
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900">Felipe Diaz - Cristian Alvira - Jhon Pulido - Maiker</div>
              <svg
                viewBox="0 0 2 2"
                width={3}
                height={3}
                aria-hidden="true"
                className="fill-gray-900"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <div className="text-gray-600">CEO Fundadores</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};
