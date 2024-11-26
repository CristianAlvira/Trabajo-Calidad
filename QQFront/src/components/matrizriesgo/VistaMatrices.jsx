import React, { useEffect, useState } from "react";
import TablaMatrizRiesgo from "./TablaMatrizRiesgo";
import axios from "axios";
import { downloadPDF } from "../utils/pdfUtils2"; // Importar la función desde utils

const VistaMatrices = ({ riesgos, loggedInUser }) => {
  const [usuarioId, setUsuarioId] = useState(null);
  const fases = ["Análisis", "Diseño", "Codificación", "Prueba", "Entrega"];
  const riesgosPorFase = fases.reduce((acc, fase) => {
    acc[fase] = riesgos.filter((riesgo) => riesgo.faseAfectada === fase);
    return acc;
  }, {});

  useEffect(() => {
    if (loggedInUser && loggedInUser._id) {
      setUsuarioId(loggedInUser._id);
    }
  }, [loggedInUser]);

  const guardarMatriz = async () => {
    if (!usuarioId) {
      alert("Usuario no identificado. Por favor, inicie sesión nuevamente.");
      return;
    }
  
    try {
      const matriz = {
        riesgos,
      };
  
      const response = await axios.post(
        `http://localhost:3000/api/matriz/${usuarioId}`,
        matriz
      );
      console.log("Matriz guardada exitosamente:", response.data);
      alert("La matriz ha sido guardada exitosamente.");
      
      // Recargar la página después de guardar exitosamente
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar la matriz:", error);
      alert("Hubo un error al guardar la matriz. Inténtalo nuevamente.");
    }
  };

  const descargarPDF = () => {
    downloadPDF("#vistaMatriz", "Matriz_de_Riesgos.pdf");
  };

  return (
    <div className="p-6 bg-gray-100">
      {/* Contenedor que encapsula toda la vista para capturar como PDF */}
      <div id="vistaMatriz">
        <h2 className="text-2xl font-bold mb-4">Vista de Matriz de Riesgos</h2>
        {fases.map((fase) => {
          const riesgosDeFase = riesgosPorFase[fase];
          if (riesgosDeFase.length === 0) return null;
          return (
            <div key={fase} className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Fase: {fase}</h3>
              <TablaMatrizRiesgo riesgos={riesgosDeFase} />
            </div>
          );
        })}
      </div>

      {/* Botón para guardar la matriz */}
      <button
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={guardarMatriz}
      >
        Guardar Matriz
      </button>

      {/* Botón para descargar el PDF */}
      <button
        className="mt-6 ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={descargarPDF}
      >
        Descargar PDF
      </button>
    </div>
  );
};

export default VistaMatrices;
