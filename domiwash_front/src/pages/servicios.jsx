import { useEffect, useState } from 'react';
import api from '../api/axios';
import ServicioForm from '../components/ServicioForm';

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [servicioEditado, setServicioEditado] = useState(null);

  const cargarServicios = () => {
    api.get('/servicios').then(res => setServicios(res.data));
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  return (
    <>
      <ServicioForm
        servicioEditado={servicioEditado}
        onSuccess={() => {
          setServicioEditado(null);
          cargarServicios();
        }}
      />

      <hr />

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Servicio</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td>{s.fecha}</td>
              <td>{s.tipo_servicio}</td>
              <td>${s.precio}</td>
              <td>{s.estado}</td>
              <td>
                <button onClick={() => setServicioEditado(s)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
