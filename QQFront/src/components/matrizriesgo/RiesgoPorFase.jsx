import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import ModalCreacionRiesgo from "./ModalCreacionRiesgos";
import ModalEdicionRiesgo from "./ModalEdicionRiesgo";
import ConfigurarMatriz from "./ConfigurarMatriz";
import axios from "axios";

const RiesgosPorFase = ({ isAdmin, loggedInUser }) => {
  const [riesgosPorFase, setRiesgosPorFase] = useState({
    Análisis: [],
    Diseño: [],
    Codificación: [],
    Prueba: [],
    Entrega: [],
  });
  const [riesgosSeleccionados, setRiesgosSeleccionados] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal para creación
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal para edición
  const [riesgoSeleccionado, setRiesgoSeleccionado] = useState(null); // Riesgo para editar
  const [mostrarConfigurarMatriz, setMostrarConfigurarMatriz] = useState(false); // Controla cuál componente mostrar
  const [nombreSoftware, setNombreSoftware] = useState(""); // Nombre del software

  // Cargar riesgos desde el backend
  const fetchRiesgos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/riesgos");
      const riesgos = response.data;

      // Organizar riesgos por fase
      const riesgosAgrupados = {
        Análisis: [],
        Diseño: [],
        Codificación: [],
        Prueba: [],
        Entrega: [],
      };

      riesgos.forEach((riesgo) => {
        if (riesgosAgrupados[riesgo.faseAfectada]) {
          riesgosAgrupados[riesgo.faseAfectada].push(riesgo);
        }
      });

      setRiesgosPorFase(riesgosAgrupados);
    } catch (error) {
      console.error("Error al obtener los riesgos:", error);
    }
  };

  useEffect(() => {
    fetchRiesgos();
  }, []);

  const handleCheckboxChange = (fase, riesgo) => {
    setRiesgosSeleccionados((prev) => ({
      ...prev,
      [riesgo._id]: prev[riesgo._id] ? null : riesgo,
    }));
  };

  const handleDelete = async (fase, id) => {
    try {
      await axios.delete(`http://localhost:3000/api/riesgos/${id}`);
      setRiesgosPorFase((prev) => ({
        ...prev,
        [fase]: prev[fase].filter((riesgo) => riesgo._id !== id),
      }));
    } catch (error) {
      console.error("Error al eliminar el riesgo:", error);
    }
  };

  const handleEdit = (riesgo) => {
    setRiesgoSeleccionado(riesgo); // Guardar el riesgo seleccionado
    setIsEditModalOpen(true); // Abrir el modal de edición
  };

  const irAConfigurarMatriz = () => {
    const seleccionados = Object.values(riesgosSeleccionados).filter(
      (riesgo) => riesgo !== null
    );

    if (seleccionados.length > 0 && nombreSoftware.trim() !== "") {
      // Agregar el campo nombreSoftware a cada riesgo seleccionado
      const riesgosConSoftware = seleccionados.map((riesgo) => ({
        ...riesgo,
        nombreSoftware,
      }));

      setMostrarConfigurarMatriz(true); // Cambia la vista para mostrar ConfigurarMatriz
    } else {
      alert("Por favor, selecciona al menos un riesgo y completa el nombre del software.");
    }
  };

  // Si mostrarConfigurarMatriz es true, renderizar ConfigurarMatriz
  if (mostrarConfigurarMatriz) {
    const seleccionados = Object.values(riesgosSeleccionados).filter(
      (riesgo) => riesgo !== null
    );
    const riesgosConSoftware = seleccionados.map((riesgo) => ({
      ...riesgo,
      nombreSoftware,
    }));
    return <ConfigurarMatriz riesgosSeleccionados={riesgosConSoftware} loggedInUser={loggedInUser} />;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Seleccionar Riesgos por Fase</h2>

      {/* Campo para ingresar el nombre del software solo si no es admin */}
      {!isAdmin && (
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Nombre del Software:
          </label>
          <input
            type="text"
            value={nombreSoftware}
            onChange={(e) => setNombreSoftware(e.target.value)}
            placeholder="Ingresa el nombre del software"
            className="w-full p-2 border rounded-md"
          />
        </div>
      )}

      {isAdmin && (
        <div className="mb-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setIsModalOpen(true)}
          >
            Agregar Riesgo
          </button>
        </div>
      )}

      {Object.entries(riesgosPorFase).map(([fase, riesgos]) => (
        <div key={fase} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{fase}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {riesgos.map((riesgo) => (
              <div
                key={riesgo._id}
                className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl transition duration-200 ease-in-out w-[250px] min-h-[120px] flex flex-col justify-between"
              >
                <div className="flex-grow">
                  <p className="text-lg font-medium overflow-hidden text-ellipsis">
                    {riesgo.descripcion}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {isAdmin ? (
                    <div className="flex gap-2">
                      <FaEdit
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                        onClick={() => handleEdit(riesgo)}
                      />
                      <FaTrashAlt
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDelete(fase, riesgo._id)}
                      />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={!!riesgosSeleccionados[riesgo._id]}
                      onChange={() => handleCheckboxChange(fase, riesgo)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {!isAdmin && (
        <button
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={irAConfigurarMatriz}
        >
          Continuar →
        </button>
      )}

      {isModalOpen && (
        <ModalCreacionRiesgo
          closeModal={() => setIsModalOpen(false)}
          fetchRiesgos={fetchRiesgos}
        />
      )}

      {isEditModalOpen && (
        <ModalEdicionRiesgo
          closeModal={() => setIsEditModalOpen(false)}
          riesgo={riesgoSeleccionado}
          fetchRiesgos={fetchRiesgos}
        />
      )}
    </div>
  );
};

export default RiesgosPorFase;