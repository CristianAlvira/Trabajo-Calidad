import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import { Footer } from "./Footer.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { downloadPDF } from "./utils/pdfUtils";
// import { parse } from "postcss";

export const AjusteParametros4 = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  const [parametros, setParametros] = useState([]);
  const [preguntasTotales, setPreguntasTotales] = useState(0);
  const [usuarioEval, setUsuarioEval] = useState(null);
  const [modelo, setModelo] = useState([]);
  const [editingParametroId, setEditingParametroId] = useState(null);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);
  const [editableContent, setEditableContent] = useState("");
  const navigate = useNavigate();
  const evaluacionId = location.pathname.split("/").pop(); //Traer el id de la evaluación

  const [evaluacion, setEvaluacion] = useState({
    usuario: loggedInUser._id,
    nombreEmpresa: "",
    ciudad: "",
    nombreSoftware: "",
    objetivosGenerales: "",
    objetivosEspecíficos: "",
    parametrosEvaluacion: [],
  });

  useEffect(() => {
    console.log("evaluacion id: ", evaluacionId);
    //console.log("Usuario logueado en NuevaEvaluacion: ", loggedInUser._id);
    obtenerUsuarioEvaluacion();
    //console.log("Modelo fuera: ", modelo);
    // obtenerModelo();

    if (loggedInUser) {
      obtenerParametros();
      //console.log("Parametros: ", parametros);
    }
  }, [loggedInUser]);

  useEffect(() => {
    obtenerModelo();
    console.log("Modelo fuera: ", modelo);
    if (modelo == "664feb032834e7fa38a9deaf") {
      console.log("Me voy pal IEEE");
      navigate(`/ajustesParametros/${evaluacionId}`);
    }
  }, [evaluacion]);

  const obtenerUsuarioEvaluacion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/evaluaciones/${evaluacionId}`
      );
      //console.log("Modelo: ", response.data.modelo);
      setUsuarioEval(response.data.usuario);
      setModelo(response.data.modelo);

      if (response.data.usuario == loggedInUser._id) {
        console.log("Sí coinciden usuarios u");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error obteniendo usuario de la evaluación:", error);
    }
  };

  const obtenerModelo = async () => {
    if (modelo) {
      const response = await axios.get(
        `http://localhost:3000/api/modelos/obtenerModelo/${modelo}`
      );
      console.log("Modelo de la prueba:", response.data.nombreModelo);
      setModelo(response.data.nombreModelo);
    }
  };

  useEffect(() => {
    setPorcentajeTotal(calcularPorcentajeTotal());
    setPreguntasTotales(calcularNoPreguntas());
  }, [parametros]);

  const obtenerParametros = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/parametros/`);
      //console.log("Response: ", response);
      setParametros(response.data);
      // Asignar los parámetros a la evaluación
      setEvaluacion((prevEvaluacion) => ({
        ...prevEvaluacion,
        parametrosEvaluacion: response.data.map((parametro) => parametro._id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEdit = async (id) => {
    const nuevoPorcentaje = parseFloat(editableContent);
  
    // Calcular el total excluyendo el parámetro actual
    const totalActual = parametrosFiltrados.reduce((total, param) => {
      if (param._id !== id) {
        total += param.valorPorcentaje;
      }
      return total;
    }, 0);
  
    // Validar que el nuevo porcentaje no haga que el total supere 100
    if (totalActual + nuevoPorcentaje > 100) {
      alert("La suma total de los porcentajes no puede exceder el 100%");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/parametros/${id}`,
        { valorPorcentaje: nuevoPorcentaje },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Actualizar el estado con los datos nuevos
      const updatedParametros = parametros.map((param) => {
        if (param._id === id) {
          return { ...param, valorPorcentaje: response.data.parametro.valorPorcentaje };
        }
        return param;
      });
  
      setParametros(updatedParametros); // Actualizar los parámetros en el estado
      setEditingParametroId(null); // Salir del modo de edición
      alert("Parámetro actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar la edición:", error);
      alert("Hubo un error al actualizar el parámetro");
    }
  };
  

  const [totalPorcentaje, setTotalPorcentaje] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Función para calcular el total de porcentajes
  const calcularTotalPorcentaje = () => {
    const correctitudPercentage =
      calculatePercentageCorrectitud(correctitudValues);
    const fiabilidadPercentage =
      calculatePercentageFiabilidad(fiabilidadValues);
    const usabilidadPercentage =
      calculatePercentageUsabilidad(usabilidadValues);
    const eficienciaPercentage =
      calculatePercentageEficiencia(eficienciaValues);
    const usabilidad2Percentage =
      calculatePercentageUsabilidad3(mantenimientoValues);
    const usabilidad3Percentage =
      calculatePercentageUsabilidad2(portabilidadValues);
    const calidadPercentage = 
      calculatePercentageCalidad(calidadValues);
    const reusabilidadPercentage =
      calculatePercentageReusabilidad(reusabilidadValues);

    const funcionalidadPoints = calculateTotalPoints(correctitudValues);
    const fiabilidadPoints = calculateTotalPoints(fiabilidadValues);
    const usabilidadPoints = calculateTotalPoints(usabilidadValues);
    const eficienciaPoints = calculateTotalPoints(eficienciaValues);
    const mantenimientoPoints = calculateTotalPoints(mantenimientoValues);
    const portabilidadPoints = calculateTotalPoints(portabilidadValues);
    const calidadPoints = calculateTotalPoints(calidadValues);
    const reusabilidadPoints = calculateTotalPoints(reusabilidadValues);
    // Agregar más categorías si es necesario

    // Sumar los porcentajes de todas las categorías
    const total =
      parseFloat(correctitudPercentage) * 0.15 +
      parseFloat(fiabilidadPercentage) * 0.15 +
      parseFloat(usabilidadPercentage) * 0.15 +
      parseFloat(eficienciaPercentage) * 0.15 +
      parseFloat(usabilidad3Percentage) * 0.15 +
      parseFloat(usabilidad2Percentage) * 0.10 +
      parseFloat(calidadPercentage) * 0.10 +
      parseFloat(reusabilidadPercentage) * 0.05;
    // Si tienes más categorías, agrégalas aquí

    const totalPoints =
      parseFloat(funcionalidadPoints) +
      parseFloat(fiabilidadPoints) +
      parseFloat(usabilidadPoints) +
      parseFloat(eficienciaPoints) +
      parseFloat(mantenimientoPoints) +
      parseFloat(portabilidadPoints) +
      parseFloat(calidadPoints) +
      parseFloat(reusabilidadPoints);

    // Actualizar el estado del total de porcentajes
    setTotalPorcentaje(total.toFixed(2));
    setTotalPoints(totalPoints);
    console.log("porcentaje: ", total);
    console.log("points: ", totalPoints);
    const valorCalificacion = totalPorcentaje;
    console.log("Meter valo afuera: ", total.toFixed(2));
    meterValorEvaluacion(total.toFixed(2));
  };

  // Llama a esta función cada vez que cambien los valores de las categorías

  const meterValorEvaluacion = async (valorCalificacion) => {
    const evaluacionId = location.pathname.split("/").pop();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/evaluaciones/${evaluacionId}`,
        { valorCalificacion: valorCalificacion } // Enviar un objeto con la clave "valorCalificacion"
      );
      console.log("Meter valor: ", response.data);
      setRespuestaBackend(response.mensaje);
      setTimeout(() => {
        navigate(`/evaluacion`);
      }, 1500);
    } catch (error) {
      console.error("Respuesta: ", response.mensaje);
    }
  };

  const [respuestaBackend, setRespuestaBackend] = useState(null);

  const handleChange = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setFiabilidadValues({
        ...fiabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeFuncionalidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 3) {
      setCorrectitudValues((prevValues) => ({
        ...prevValues,
        [e.target.name]: inputValue,
      }));
    }
  };

  const handleChangeUsabilidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setUsabilidadValues({
        ...usabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeEficiencia = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setEficienciaValues({
        ...eficienciaValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeMantenimiento = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setMantenimientoValues({
        ...mantenimientoValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangePortabilidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setPortabilidadValues({
        ...portabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeCalidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setCalidadValues({
        ...calidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeReusabilidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setReusabilidadValues({
        ...reusabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const [correctitudValues, setCorrectitudValues] = useState({
    1.1: "",
    1.2: "",
    1.3: "",
  });

  const [fiabilidadValues, setFiabilidadValues] = useState({
    2.1: "",
    2.2: "",
    2.3: "",
  });

  const [usabilidadValues, setUsabilidadValues] = useState({
    3.1: "",
    3.2: "",
    3.3: "",
  });

  const [eficienciaValues, setEficienciaValues] = useState({
    4.1: "",
    4.2: "",
    4.3: "",
  });

  const [mantenimientoValues, setMantenimientoValues] = useState({
    5.1: "",
    5.2: "",
    5.3: "",
  });

  const [portabilidadValues, setPortabilidadValues] = useState({
    6.1: "",
    6.2: "",
    6.3: "",
  });

  const [calidadValues, setCalidadValues] = useState({
    7.1: "",
    7.2: "",
    7.3: "",
  });

  const [reusabilidadValues, setReusabilidadValues] = useState({
    8.1: "",
    8.2: "",
    8.3: "",
  });

  const calculateTotalPoints = (values) => {
    let total = 0;
    for (const key in values) {
      total += parseInt(values[key]);
    }
    return total;
  };

  const calculatePercentageCorrectitud = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageFiabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageEficiencia = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad3 = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad2 = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageCalidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageReusabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  // Filtrar los parámetros por el modeloId específico
  const parametrosFiltrados = parametros.filter(
    (parametro) => parametro.modeloID === "67325d1e19d4cc05793ea720"
  );

  const calcularPorcentajeTotal = () => {
    let total = 0;
    parametrosFiltrados.forEach((parametro) => {
      total += parametro.valorPorcentaje;
    });
    return total;
  };

  // Función para calcular el número total de preguntas de los parámetros renderizados
  const calcularNoPreguntas = () => {
    let totalPreguntas = 0;
    parametrosFiltrados.forEach((parametro) => {
      totalPreguntas += parametro.preguntasParametro.length;
    });
    return totalPreguntas;
  };

  const calcularTotalPreguntas = () => {
    return parametrosFiltrados.reduce((total, parametro) => {
      return (
        total +
        (parametro.preguntasParametro ? parametro.preguntasParametro.length : 0)
      );
    }, 0);
  };

  const descargarPDF = () => {
    downloadPDF("#evaluacion", "Evaluación_parametros.pdf");
  };

  return (
    <div>
      <div data-aos="zoom-out">
        <Navbar
          isPopoverOpen={isPopoverOpen}
          handlePopoverOpen={handlePopoverOpen}
          handlePopoverClose={handlePopoverClose}
          loggedInUser={loggedInUser}
        />
      </div>

      <div data-aos="zoom-in" id="evaluacion">
        <div
          className={`my-20 mb-10 max-w-6xl mx-auto relative overflow-hidden transition-all duration-500 ease-in-out ${
            isPopoverOpen ? "mt-128" : "my-20"
          }`}
        >
          <div
            className={`px-4 sm:px-0 relative overflow-hidden transition-all duration-500 ease-in-out ${
              isPopoverOpen ? "mt-0" : "mt-0"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-blue-900 text-center">
              Ajusta los parámetros de la evaluación {modelo}
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-left">
              Aquí podrás adaptar los porcentajes de incidencia en los
              resultados, o añadir parámetros.
            </p>

            <div className="mt-6 ml-0 w-full grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-full divide-y divide-blue-200 bg-blue-50 rounded-lg shadow-md">
                <div className="px-4 py-4 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 bg-blue-100 rounded-t-lg">
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    Código
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    Nombre
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-3">
                    Descripción
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    No. Preguntas
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    % Total
                  </dd>
                </div>

                {parametrosFiltrados.map((parametro) => (
                  <div
                    key={parametro._id}
                    className="px-4 py-6 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 border-t border-blue-200 bg-white hover:bg-blue-50"
                  >
                    <dd className="text-sm text-black-700 col-span-1 truncate">
                      {parametro._id.slice(0, 10)}...
                    </dd>
                    <dd className="mt-1 text-sm text-black-700 sm:col-span-1 sm:mt-0">
                      {parametro.nombreParametro}
                    </dd>
                    <dd className="mt-1 text-sm text-black-700 sm:col-span-3 sm:mt-0">
                      {parametro.descripcionParametro}
                    </dd>
                    <dd className="mt-1 text-sm text-black-700 sm:col-span-1 sm:mt-0">
                      {parametro.preguntasParametro
                        ? parametro.preguntasParametro.length
                        : 0}
                    </dd>

                    {editingParametroId === parametro._id ? (
                      <div className="flex flex-col space-y-2">
                        {/* Campo de edición más ancho y menos alto */}
                        <textarea
                          value={editableContent}
                          onChange={(e) => setEditableContent(e.target.value)}
                          className="text-sm text-black-700 rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-600"
                          style={{ width: "100%", height: "35px", resize: "none", padding: "8px" }} // Ajusta ancho y altura
                        ></textarea>

                        {/* Botones alineados verticalmente */}
                        <div className="flex justify-start space-x-2">
                          <button
                            onClick={() => handleSaveEdit(parametro._id)} // Guardar cambios
                            className="text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            style={{
                              padding: "6px 14px", // Reduce padding
                              fontSize: "14px", // Reduce tamaño de texto
                              width: "100px", // Botón más estrecho
                              height: "35px", // Menor altura
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingParametroId(null)} // Cancelar edición
                            className="text-sm text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400"
                            style={{
                              padding: "6px 14px", // Reduce padding
                              fontSize: "14px", // Reduce tamaño de texto
                              width: "100px", // Botón más estrecho
                              height: "35px", // Menor altura
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <dd className="mt-1 text-sm text-black-700 sm:col-span-1 sm:mt-0 flex items-center">
                        {parametro.valorPorcentaje}%
                        {loggedInUser.role === "admin" && (
                          <a
                            className="text-blue-400 hover:text-blue-600 cursor-pointer ml-2"
                            onClick={() => {
                              setEditingParametroId(parametro._id);
                              setEditableContent(parametro.valorPorcentaje); // Inicializa con el valor actual
                            }}
                          >
                            <img
                              className="h-6 w-auto"
                              src="/img/editar2-2.svg"
                              alt="Editar"
                              onMouseOver={(e) => {
                                e.currentTarget.src = "/img/editar2.svg";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.src = "/img/editar2-2.svg";
                              }}
                            />
                          </a>
                        )}
                      </dd>
                    )}
                  </div>
                ))}

                <div className="px-4 py-4 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 bg-blue-100 rounded-b-lg">
                  <dd className="ml-auto text-sm font-semibold text-blue-800 col-span-5">
                    Total
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    {calcularTotalPreguntas()}
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    {porcentajeTotal}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Categoria por Categoría__________*/}

          {/*________________________Corrección_________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              1. CORRECCIÓN
            </h3>

            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Grado en el cual el software cumple con sus funciones especificadas sin defectos.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    1.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Exactitud
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Grado de precisión con que el software realiza sus funciones.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.1"
                      value={correctitudValues["1.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    1.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Integridad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Garantía de que el software incluye todas las funcionalidades necesarias.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.2"
                      value={correctitudValues["1.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1  ">
                    1.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Tolerancia a fallos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad del software para manejar errores o condiciones imprevistas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.3"
                      value={correctitudValues["1.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageCorrectitud(correctitudValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(correctitudValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Fiabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              2. FIABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
              Capacidad del software para mantener un rendimiento consistente y
              sin fallos durante su uso. Se centra en la frecuencia de fallos,
              disponibilidad y capacidad de recuperación.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Disponibilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Tiempo en que el software está operativo sin interrupciones.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.1"
                      value={fiabilidadValues["2.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Recuperabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Facilidad con la que el sistema puede volver a un estado funcional tras un fallo.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.2"
                      value={fiabilidadValues["2.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Seguridad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Protección de los datos y del sistema contra accesos no autorizados o pérdidas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.3"
                      value={fiabilidadValues["2.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageFiabilidad(fiabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(fiabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Eficiencia__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              3. EFICIENCIA
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
              Rendimiento del software en términos de tiempo de respuesta,
              velocidad de procesamiento y uso eficiente de los recursos del
              sistema.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Tiempo de ejecución
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Velocidad con la que el software completa tareas específicas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.1"
                      value={usabilidadValues["3.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Uso de memoria
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Eficiencia del software en la gestión de memoria del sistema.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.2"
                      value={usabilidadValues["3.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Velocidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad para responder y ejecutar funciones en tiempo óptimo.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.3"
                      value={usabilidadValues["3.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageUsabilidad(usabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(usabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Usabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              4. USABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
              Facilidad para los usuarios de entender, aprender y utilizar el
              software. Se enfoca en la experiencia del usuario y la sencillez
              de operación.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    4.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Facilidad de aprendizaje
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Tiempo necesario para que un usuario entienda cómo operar el software.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeEficiencia}
                      name="4.1"
                      value={eficienciaValues["4.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    4.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Operabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Facilidad para que los usuarios ejecuten sus tareas usando el software.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeEficiencia}
                      name="4.2"
                      value={eficienciaValues["4.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    4.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Documentación
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Información proporcionada para apoyar el uso y operación del sistema.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeEficiencia}
                      name="4.3"
                      value={eficienciaValues["4.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageEficiencia(eficienciaValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(eficienciaValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*_______________________Mantenibilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              5. MANTENIBILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad para modificar el software, corregir errores y realizar mejoras.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Facilidad de corrección
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad para resolver problemas y errores con facilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.1"
                      value={mantenimientoValues["5.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Capacidad de mejora
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Facilidad para realizar mejoras y agregar nuevas funcionalidades.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.2"
                      value={mantenimientoValues["5.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Extensibilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Habilidad para ampliar las funcionalidades existentes sin complicaciones.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.3"
                      value={mantenimientoValues["5.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageUsabilidad3(mantenimientoValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(mantenimientoValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*_______________________Flexibilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              6. FLEXIBILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad del software para adaptarse a cambios en el entorno o requisitos.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Adaptabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Facilidad para ajustarse a diferentes necesidades o requerimientos del usuario.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.1"
                      value={portabilidadValues["6.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Configurabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Habilidad para personalizar el software según las necesidades del cliente.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.2"
                      value={portabilidadValues["6.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Escalabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad para manejar un incremento en usuarios o carga sin afectar el rendimiento.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.3"
                      value={portabilidadValues["6.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageUsabilidad2(portabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(portabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Portabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              7. PORTABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
              Capacidad del software para ser trasladado de un entorno con
              mínimo esfuerzo, adaptándose a diferentes plataformas y sistemas.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Adaptabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    El software puede ser modificado o configurado para
                    funcionar en diferentes entornos, incluyendo diferentes
                    sistemas operativos, hardware y configuraciones de red.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.1"
                      value={calidadValues["7.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Compatibilidad con sistemas operativos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Habilidad para ejecutarse en diversas plataformas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.2"
                      value={calidadValues["7.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Facilidad de migración
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Eficiencia en trasladar el software entre entornos o plataformas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.3"
                      value={calidadValues["7.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageCalidad(calidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(calidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*_____________________Reusabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              7. REUSABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Facilidad para reutilizar partes del software en otros proyectos o entornos.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    8.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Modularidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Diseño del software en partes independientes que pueden ser reutilizadas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeReusabilidad}
                      name="8.1"
                      value={calidadValues["8.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    8.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Generalización
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad para ser aplicado a diversos casos o escenarios sin cambios significativos.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeReusabilidad}
                      name="8.2"
                      value={calidadValues["8.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    8.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Compatibilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Facilidad para integrar componentes reutilizables en otros sistemas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeReusabilidad}
                      name="8.3"
                      value={calidadValues["8.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageReusabilidad(reusabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(reusabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Mostrar Total Puntaje y Porcentaje */}
          <div className="mr-8 flex items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <p className="text-sm font-semibold text-gray-700">
              Total puntaje: {totalPoints} de 72
            </p>
            <span className="mx-2">|</span>
            <p className="text-sm font-semibold text-gray-700">
              Total porcentaje: {totalPorcentaje}%
            </p>
          </div>

        </div>
      </div>


      <div className="mt-10 mb-10 mr-0 flex justify-end">
            <div className="flex items-center ml-auto">
              {respuestaBackend && (
                <div
                  className={`mr-4 text-center text-sm ${
                    respuestaBackend.tipo === "error"
                      ? "text-rose-600"
                      : "text-green-600"
                  }`}
                >
                  {respuestaBackend.mensaje}
                </div>
              )}
              <button
                onClick={() => {
                  calcularTotalPorcentaje();
                  descargarPDF();
                }}
                type="submit"
                className="block ml-auto rounded-full bg-blue-800 px-20 py-3 text-center text-lg font-semibold text-white shadow-md hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Guardar y Descargar PDF
              </button>

              {/* Botón para descargar el PDF */}
              {/* <button
                className="block ml-auto rounded-full bg-red-800 ml-8 px-20 py-3 text-center text-lg font-semibold text-white shadow-md hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
                onClick={descargarPDF}
              >
                Descargar PDF
              </button> */}

            </div>
          </div>
      <Footer />
    </div>
  );
};
