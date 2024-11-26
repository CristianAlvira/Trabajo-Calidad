import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

export const AfterNav = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-blue-100 transition-all duration-500 ease-in-out ${
        isPopoverOpen ? "mt-128" : "mt-0"
      }`}
    >
      <div
        className={`relative flex flex-col lg:flex-row items-center max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-32 bg-blue-100`}
      >
        {/* Text Section */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1
            data-aos="fade-right"
            className="font-bold text-4xl text-gray-700 sm:text-6xl leading-tight"
          >
            Mejora la calidad de tu software de manera efectiva
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            TechAsses te ayuda a evaluar la calidad de tus aplicaciones en
            múltiples dimensiones, permitiéndote gestionar parámetros clave y
            generar informes personalizados. Con nuestro sistema, puedes
            asegurar la confiabilidad y rendimiento de tu software.
          </p>

          {/* Call to action button */}
          <div className="mt-8">
            <Link
              to={{
                pathname: `${loggedInUser ? "/evaluacion" : "/login"}`,
                state: {
                  loggedInUser,
                  isPopoverOpen,
                  handlePopoverOpen,
                  handlePopoverClose,
                },
              }}
              className="inline-block rounded-md bg-blue-800 px-8 py-3 text-lg font-medium text-white hover:bg-blue-900 transform transition-all duration-300 ease-in-out hover:scale-105"
            >
              Evalúa ahora
            </Link>
          </div>
        </div>

        {/* Image Section with Circular Shape */}
        <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center relative">
          <div className="h-80 w-80 rounded-full overflow-hidden shadow-xl border-4 border-white">
            <img
              src="./img/img7.jpg"
              alt="Persona trabajando en laptop"
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Decorative Shape */}
          <div className="absolute -bottom-8 -right-8 h-48 w-48 bg-white rounded-full opacity-100 transform rotate-12"></div>
        </div>
      </div>
    </div>
  );
};
