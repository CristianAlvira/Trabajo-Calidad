import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { Footer } from "./Footer.jsx";
import axios from "axios";
import { EliminarEvaluacionModal } from "./EliminarEvaluacionModal.jsx";

export const Evaluacion = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [modelos, setModelos] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvaluacionId, setSelectedEvaluacionId] = useState(null);

  useEffect(() => {
    obtenerEvaluaciones();
    obtenerModelos();
  }, [loggedInUser]);

  const handleOpenModal = (evaluacionId) => {
    console.log("Evaluación cargada en modal:", evaluacionId);
    setModalOpen(true);
    setSelectedEvaluacionId(evaluacionId);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const actualizarEvaluaciones = async () => {
    obtenerEvaluaciones();
  };

  const obtenerEvaluaciones = async () => {
    if (loggedInUser && loggedInUser._id) {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/evaluaciones/usuarioEvaluaciones/${loggedInUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const evaluaciones = response.data;
        setEvaluaciones(evaluaciones);
        console.log("Evaluaciones cargas: ", evaluaciones);
      } catch (error) {
        console.error("Error obteniendo evaluaciones");
      }
    }
  };

  const obtenerModelos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/modelos/obtenerModelos"
      );
      const modelos = response.data.reduce((acc, modelo) => {
        acc[modelo._id] = modelo.nombreModelo;
        return acc;
      }, {});
      setModelos(modelos);
      console.log("Modelos obtenidos formateados: ", modelos);
    } catch (error) {
      console.error("Error obteniendo modelos");
    }
  };

  const eliminarEvaluacionesSinCalificacion = async () => {
    // Filtrar las evaluaciones para obtener solo aquellas que tienen valorCalificacion definido
    const evaluacionesConCalificacion = evaluaciones.filter(
      (evaluacion) => evaluacion.valorCalificacion != null
    );

    // Obtener los IDs de las evaluaciones sin calificación
    const evaluacionesSinCalificacionIds = evaluaciones
      .filter((evaluacion) => evaluacion.valorCalificacion == null)
      .map((evaluacion) => evaluacion._id);

    try {
      // Enviar una solicitud DELETE para eliminar las evaluaciones sin calificación
      await Promise.all(
        evaluacionesSinCalificacionIds.map(async (evaluacionId) => {
          await axios.delete(
            `http://localhost:3000/api/evaluaciones/${evaluacionId}`
          );
          console.log(`Evaluación eliminada: ${evaluacionId}`);
        })
      );

      // Actualizar el estado de las evaluaciones para reflejar solo las evaluaciones con calificación
      setEvaluaciones(evaluacionesConCalificacion);

      console.log("Evaluaciones sin calificación eliminadas correctamente");
    } catch (error) {
      console.error(
        "Error al eliminar las evaluaciones sin calificación",
        error
      );
    }
  };
  useEffect(() => {
    eliminarEvaluacionesSinCalificacion();
  }, evaluaciones);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        isPopoverOpen={isPopoverOpen}
        handlePopoverOpen={handlePopoverOpen}
        handlePopoverClose={handlePopoverClose}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
      <div className="max-w-7xl mx-auto py-10 px-6" data-aos="zoom-in">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 relative transition-all duration-500 ease-in-out">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Apartado de evaluaciones
          </h3>
          <p className="text-gray-600 mb-4">
            En esta sección podrás ver todas las evaluaciones que has hecho.
          </p>
          <div className="text-right mb-6">
            <Link
              to={loggedInUser ? "/nuevaEvaluacion" : "/login"}
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform transition duration-300 hover:scale-105"
            >
              Hacer una evaluación
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow divide-y divide-gray-200">
              <div className="grid grid-cols-8 gap-4 text-gray-700 font-semibold">
                <span>Id</span>
                <span>Modelo</span>
                <span>Ciudad</span>
                <span>Fecha</span>
                <span>Nombre empresa</span>
                <span>Nombre software</span>
                <span>Valor</span>
                <span>Acciones</span>
              </div>
              {evaluaciones.map((evaluacion) => (
                <div
                  key={evaluacion._id}
                  className="grid grid-cols-8 gap-4 text-gray-600 py-4 items-center hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <span>{evaluacion._id.slice(0, 10)}...</span>
                  <span>{modelos[evaluacion.modelo] || evaluacion.modelo}</span>
                  <span>{evaluacion.ciudad}</span>
                  <span>{evaluacion.createdAt.slice(0, 10)}</span>
                  <span>{evaluacion.nombreEmpresa}</span>
                  <span>{evaluacion.nombreSoftware}</span>
                  <span>
                    {evaluacion.valorCalificacion
                      ? `${evaluacion.valorCalificacion}%`
                      : "No hay"}
                  </span>
                  <span className="flex justify-center">
                    <button
                      onClick={() => handleOpenModal(evaluacion._id)}
                      className="text-blue-400 hover:text-blue-600 transition duration-200"
                    >
                      <img
                        className="h-6 w-6"
                        src="/img/newTrash.svg"
                        alt="Trash icon"
                        onMouseOver={(e) => {
                          e.currentTarget.src = "/img/newTrash1.svg";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.src = "/img/newTrash.svg";
                        }}
                      />
                    </button>
                  </span>
                </div>
              ))}
            </div>
            {modalOpen && (
              <EliminarEvaluacionModal
                onClose={handleCloseModal}
                evaluacionId={selectedEvaluacionId}
                actualizarEvaluaciones={actualizarEvaluaciones}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};