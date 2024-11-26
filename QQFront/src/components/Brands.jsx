import React from "react";

export const Brands = () => {
  return (
    <div className="bg-blue-100 py-10 sm:pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">
          Prestamos servicios a las siguientes empresas
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="col-span-2 max-h-15 w-full object-contain lg:col-span-1"
            src="/img/dropbox.svg"
            alt="Zoom"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-15 w-full object-contain lg:col-span-1"
            src="/img/republic-services-logo-2.svg"
            alt="Adobe"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 max-h-17 w-full object-contain lg:col-span-1"
            src="/img/chocolates.svg"
            alt="Tuple"
            width={178}
            height={68}
          />
          <img
            className="col-span-2 max-h-13 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="/img/ar-logo-1.svg"
            alt="Samsung"
            width={158}
            height={48}
          />
          <img
            className="col-span-2 col-start-2 max-h-15 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="/img/mindshare.svg"
            alt="Oracle"
            width={158}
            height={48}
          />
        </div>
      </div>
    </div>
  );
};
