import React from "react";

const features = [
  {
    name: "Funcionalidad",
    description:
      "La capacidad del software de cumplir con las funciones para satisfacer las necesidades explícitas e implícitas cuando es utilizado en condiciones específicas",
  },
  {
    name: "Fiabilidad",
    description:
      "Capacidad para asegurar un nivel de funcionamiento adecuado cuando el software es utilizado",
  },
  {
    name: "Usabilidad",
    description:
      "Capacidad del software de ser entendido, aprendido, y usado en forma fácil y atractiva",
  },
  {
    name: "Eficiencia",
    description:
      "La forma del desempeño adecuado, de acuerdo al número de recursos utilizados según las condiciones planteadas",
  },
  {
    name: "Portabilidad y calidad de uso",
    description:
      "Posibilidad de ser trasladado a otro entorno o sistema. Junto con el logro de metas bajo eficacia, productividad, seguridad y satisfacción en contextos específicos de uso",
  },
  {
    name: "Capacidad de mantenimiento",
    description: "Cualidad del software para ser modificado, incluyendo correcciones o mejoras",
  },
];

export function Info1() {
  return (
    <section className="bg-blue-100 py-16 px-6 sm:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Conoce los parámetros evaluados
            </h2>
            <p className="text-base text-gray-600 max-w-lg">
              La función de adaptación de los valores de los parámetros te permite ajustar los criterios
              de evaluación de tu software. Optimiza tu desempeño al comprender cada uno de ellos.
            </p>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="p-6 bg-white shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section (Image) */}
          <div className="mt-6 lg:mt-0 flex justify-center">
            <img
              src="./img/img8.png"
              alt="Imagen representativa"
              className="rounded-lg shadow-lg max-w-xs sm:max-w-sm lg:max-w-md transform hover:scale-105 transition-all duration-300"
              style={{ width: '80%', height: 'auto' }} // Ajuste para tamaño correcto
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Info1;
