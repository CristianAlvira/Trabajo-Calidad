import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 25px;
  border-radius: 15px;
  width: 700px; /* Incremento en el tamaño */
  max-height: 100%;
  overflow-y: auto;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  cursor: pointer;

  &:hover {
    color: #ff6b6b;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    text-align: left;
  }

  select,
  textarea,
  input {
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;

    /* Asegura que solo acepten números entre 1 y 5 */
    &[type="number"] {
      -moz-appearance: textfield;
      appearance: textfield;
    }

    &:invalid {
      border-color: #ff6b6b;
    }

    &:valid {
      border-color: #28a745;
    }
  }
`;

const AcordeonContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;

  h3 {
    background: #f8f9fa;
    margin: 0;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  .content {
    padding: 10px;
    display: none;

    &.open {
      display: block;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff !important; /* Azul primario */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3 !important; /* Azul más oscuro al pasar el mouse */
  }

  &:active {
    background-color: #004085 !important; /* Azul más oscuro al hacer clic */
    transform: scale(0.95);
  }
`;

import axios from "axios";

const ModalCreacionRiesgo = ({ closeModal, ultimoCodigo, fetchRiesgos }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    causaRaiz: "",
    faseAfectada: "Análisis", // Valor por defecto
    entregablesAfectados: "Documento de requerimientos", // Valor por defecto
    alcance: 0,
    tiempo: 0,
    costo: 0,
    calidad: 0,
  });

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "descripcion" || name === "causaRaiz" || name === "faseAfectada" || name === "entregablesAfectados"
        ? value
        : parseInt(value),
    });
  };

  const handleAccordionToggle = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Generar código autoincremental
    const nuevoCodigo = `R-${(ultimoCodigo + 1).toString().padStart(3, "0")}`;
  
    // Crear objeto de riesgo con los datos requeridos
    const nuevoRiesgo = {
      codigo: nuevoCodigo,
      descripcion: formData.descripcion,
      faseAfectada: formData.faseAfectada,
      causaRaiz: formData.causaRaiz,
      entregablesAfectados: formData.entregablesAfectados,
      estimacionProbabilidad: "",
      objetivos: {
        alcance: formData.alcance,
        tiempo: formData.tiempo,
        costo: formData.costo,
        calidad: formData.calidad,
      },
      probabilidadImpacto: "",
      nivelRiesgo: "",
    };
  
    try {
      console.log("Datos enviados al backend:", nuevoRiesgo); // Agregado para ver el envío
      const response = await axios.post("https://trabajo-calidad.vercel.app/api/riesgos", nuevoRiesgo);
      console.log("Riesgo creado exitosamente:", response.data);
      fetchRiesgos(); // Refrescar riesgos tras crear uno nuevo
      closeModal();
    } catch (error) {
      console.error("Error al crear el riesgo:", error);
    }
  };  

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>×</CloseButton>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Agregar Nuevo Riesgo</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Descripción del Riesgo</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ingrese la descripción"
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Causa Raíz</label>
            <textarea
              name="causaRaiz"
              value={formData.causaRaiz}
              onChange={handleChange}
              placeholder="Ingrese la causa raíz"
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Fase Afectada</label>
            <select
              name="faseAfectada"
              value={formData.faseAfectada}
              onChange={handleChange}
              required
            >
              <option value="Análisis">Análisis</option>
              <option value="Diseño">Diseño</option>
              <option value="Codificación">Codificación</option>
              <option value="Prueba">Prueba</option>
              <option value="Entrega">Entrega</option>
            </select>
          </InputGroup>
          <InputGroup>
            <label>Entregables Afectados</label>
            <textarea
              name="entregablesAfectados"
              value={formData.entregablesAfectados}
              onChange={handleChange}
              placeholder="Ingrese los entregables afectados"
              required
            />
          </InputGroup>
          <AcordeonContainer>
            <h3 onClick={handleAccordionToggle}>
              {isAccordionOpen ? "▼" : "►"} Objetivo Afectado
            </h3>
            <div className={`content ${isAccordionOpen ? "open" : ""}`}>
              {["alcance", "tiempo", "costo", "calidad"].map((campo) => (
                <InputGroup key={campo}>
                  <label>Estimación Impacto ({campo})</label>
                  <input
                    type="number"
                    name={campo}
                    value={formData[campo]}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    placeholder="1-5"
                    required
                  />
                </InputGroup>
              ))}
            </div>
          </AcordeonContainer>
          <SubmitButton type="submit">Agregar Riesgo</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalCreacionRiesgo;