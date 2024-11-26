import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import { Footer } from "./Footer.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const NuevaEvaluacion = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  const navigate = useNavigate();
  const [modelos, setModelos] = useState(null);

  //const location = useLocation();
  //const loggedInUser = location.state.loggedInUser;
  const [evaluacion, setEvaluacion] = useState({
    usuario: loggedInUser._id,
    nombreEmpresa: "",
    ciudad: "",
    nombreSoftware: "",
    objetivosGenerales: "",
    objetivosEspecíficos: "",
    modelo: "",
    parametrosEvaluacion: [],
  });

  const [respuestaBackend, setRespuestaBackend] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvaluacion((prevEvaluacion) => ({
      ...prevEvaluacion,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log("Evaluación enviada: ", evaluacion);
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://trabajo-calidad.vercel.app/api/evaluaciones/",
        evaluacion,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Respuesta de la creación de evaluación:", response.data);
      setRespuestaBackend({ tipo: "success", mensaje: response.data.mensaje });

      // Limpiar el estado de la evaluación
      setTimeout(() => {
        setEvaluacion({
          usuario: loggedInUser._id,
          nombreEmpresa: "",
          ciudad: "",
          nombreSoftware: "",
          objetivosGenerales: "",
          objetivosEspecíficos: "",
          modelo: "",
        });
        setRespuestaBackend(null);
      }, 1000);

      const evaluacionId = response.data.evaluacion?._id;
      if (!evaluacionId) {
        console.error(
          "ID de evaluación no encontrado en la respuesta:",
          response.data
        );
        return;
      }

      // Buscar el modelo seleccionado usando el ID del modelo
      const modeloSeleccionado = modelos.find(
        (modelo) => modelo._id === evaluacion.modelo
      );
      console.log("Modelo seleccionado:", modeloSeleccionado);

      // Redirigir según el nombre del modelo
      if (modeloSeleccionado?.nombreModelo === "IEEE 730") {
        navigate(`/ajusteParametros/${evaluacionId}`);
      } else if (
        modeloSeleccionado?.nombreModelo === "ISO/IEC 25000 (SQuaRE)"
      ) {
        navigate(`/ajusteParametros2/${evaluacionId}`);
      } else if (modeloSeleccionado?.nombreModelo === "FURPS") {
        navigate(`/ajusteParametros3/${evaluacionId}`);
      } else if (modeloSeleccionado?.nombreModelo === "Calidad de McCall") {
        navigate(`/ajusteParametros4/${evaluacionId}`);
      } else {
        console.error(
          "Modelo no reconocido o no especificado correctamente:",
          modeloSeleccionado?.nombreModelo
        );
      }
    } catch (error) {
      console.error("Error al crear la evaluación:", error);
      setRespuestaBackend({
        tipo: "error",
        mensaje: "Error al crear la evaluación",
      });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (loggedInUser && loggedInUser._id) {
      axios
        .get(`https://trabajo-calidad.vercel.app/api/modelos/obtenerModelos`)
        .then((response) => {
          setModelos(response.data);
          console.log("Modelos encontrados: ", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [loggedInUser]);

  return (
    <div className="bg-gray-50">
      <div data-aos="zoom-out">
        <Navbar
          isPopoverOpen={isPopoverOpen}
          handlePopoverOpen={handlePopoverOpen}
          handlePopoverClose={handlePopoverClose}
          loggedInUser={loggedInUser}
        />
      </div>

      <div data-aos="zoom-in">
        <div
          className={`my-20 mb-96 max-w-6xl mx-auto relative overflow-hidden transition-all duration-500 ease-in-out ${
            isPopoverOpen ? "mt-128" : "my-20"
          }`}
        >
          <div
            className={`px-4 sm:px-0 relative overflow-hidden transition-all duration-500 ease-in-out ${
              isPopoverOpen ? "mt-0" : "mt-0"
            }`}
          >
            <h3 className="text-4xl font-semibold text-center text-blue-800 leading-tight">
              Hacer una nueva evaluación
            </h3>
            <p className="mt-4 max-w-2xl text-xl text-gray-700 text-center ml-60">
              Completa los siguientes campos para realizar la evaluación de
              manera detallada.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Selección de Modelo */}
              <div className="col-span-1">
                <label
                  htmlFor="modelo"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Modelo
                </label>
                <div className="mt-2.5">
                  <select
                    name="modelo"
                    id="modelo"
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    value={evaluacion.modelo}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Selecciona un modelo
                    </option>
                    {modelos?.map((modelo) => (
                      <option key={modelo._id} value={modelo._id}>
                        {modelo.nombreModelo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nombre de la empresa */}
              <div className="col-span-1">
                <label
                  htmlFor="nombreEmpresa"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Nombre de la empresa
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="nombreEmpresa"
                    id="nombreEmpresa"
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    value={evaluacion.nombreEmpresa}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Nombre del software */}
              <div className="col-span-1">
                <label
                  htmlFor="nombreSoftware"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Nombre del software
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="nombreSoftware"
                    id="nombreSoftware"
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    value={evaluacion.nombreSoftware}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Ciudad */}
              <div className="col-span-1">
                <label
                  htmlFor="ciudad"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Ciudad
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="ciudad"
                    id="ciudad"
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    value={evaluacion.ciudad}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Objetivos generales */}
              <div className="col-span-1">
                <label
                  htmlFor="objetivosGenerales"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Objetivos generales
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="objetivosGenerales"
                    id="objetivosGenerales"
                    rows={4}
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    value={evaluacion.objetivosGenerales}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Objetivos específicos */}
              <div className="col-span-1">
                <label
                  htmlFor="objetivosEspecíficos"
                  className="block text-sm font-semibold text-gray-800"
                >
                  Objetivos específicos
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="objetivosEspecíficos"
                    id="objetivosEspecíficos"
                    rows={4}
                    className="block w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                    value={evaluacion.objetivosEspecíficos}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Botón de Enviar */}
            <div className="text-center mt-6">
              <button
                type="submit"
                className=" py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Enviar evaluación
              </button>
            </div>
          </form>

          {/* Respuesta Backend */}
          {respuestaBackend && (
            <div
              className={`mt-4 text-center text-sm font-medium ${
                respuestaBackend.tipo === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {respuestaBackend.mensaje}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
