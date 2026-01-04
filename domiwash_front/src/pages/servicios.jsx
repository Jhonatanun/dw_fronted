import { useEffect, useState } from 'react';
import api from '../api/axios';
import ServicioForm from '../components/ServicioForm';

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [servicioEditado, setServicioEditado] = useState(null);

  const cargarServicios = () => {
    api.get('/servicios').then(res =>{console.log('📦 Servicios:', res.data); setServicios(res.data); } );
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
            <th>Costo</th>
            <th>Cliente</th>
            <th>Forma de Pago</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acciones</th>

          </tr>
        </thead>
        <tbody>
          {servicios.map(s => (
            <tr key={s.id}>
              <td>{s.fecha}</td>
              <td>{s.tipo_servicio}</td>
              <td>${s.precio}</td>
              <td>${s.costo}</td>
              <td>{s.cliente}</td>
              <td>{s.forma_pago}</td>
              <td>{s.estado}</td>
              <td>{s.observaciones}</td>
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
