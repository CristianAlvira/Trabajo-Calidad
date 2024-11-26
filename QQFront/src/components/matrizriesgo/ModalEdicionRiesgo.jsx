import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

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
  width: 700px;
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
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff !important;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3 !important;
  }
`;

const ModalEdicionRiesgo = ({ closeModal, riesgo, fetchRiesgos }) => {
  const [formData, setFormData] = useState({
    descripcion: "",
    causaRaiz: "",
    faseAfectada: "",
    entregablesAfectados: "",
    alcance: 0,
    tiempo: 0,
    costo: 0,
    calidad: 0,
  });

  useEffect(() => {
    // Prellenar el formulario con los datos del riesgo
    if (riesgo) {
      setFormData({
        descripcion: riesgo.descripcion,
        causaRaiz: riesgo.causaRaiz,
        faseAfectada: riesgo.faseAfectada,
        entregablesAfectados: riesgo.entregablesAfectados,
        alcance: riesgo.objetivos?.alcance || 0,
        tiempo: riesgo.objetivos?.tiempo || 0,
        costo: riesgo.objetivos?.costo || 0,
        calidad: riesgo.objetivos?.calidad || 0,
      });
    }
  }, [riesgo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "descripcion" || name === "causaRaiz" || name === "faseAfectada" || name === "entregablesAfectados"
        ? value
        : parseInt(value, 10),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRiesgo = {
      descripcion: formData.descripcion,
      causaRaiz: formData.causaRaiz,
      faseAfectada: formData.faseAfectada,
      entregablesAfectados: formData.entregablesAfectados,
      objetivos: {
        alcance: formData.alcance,
        tiempo: formData.tiempo,
        costo: formData.costo,
        calidad: formData.calidad,
      },
    };

    try {
      console.log("Datos enviados al backend para editar:", updatedRiesgo);
      await axios.put(`https://trabajo-calidad.vercel.app/api/riesgos/${riesgo._id}`, updatedRiesgo);
      console.log("Riesgo actualizado correctamente");
      fetchRiesgos(); // Refrescar los riesgos tras editar
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el riesgo:", error);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>×</CloseButton>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Editar Riesgo</h2>
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <label>Descripción del Riesgo</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <label>Causa Raíz</label>
            <textarea
              name="causaRaiz"
              value={formData.causaRaiz}
              onChange={handleChange}
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
              required
            />
          </InputGroup>
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
                required
              />
            </InputGroup>
          ))}
          <SubmitButton type="submit">Actualizar Riesgo</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalEdicionRiesgo;