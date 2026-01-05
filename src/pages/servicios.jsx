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

  const handleDelete = async id => {
    const confirmar = window.confirm(
      '¿Seguro que deseas eliminar este servicio?'
    );

    if (!confirmar) return;

    try {
      await api.delete(`/servicios/${id}`);
      cargarServicios();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el servicio');
    }
  };

  return (
    <>
      <ServicioForm
        servicioEditado={servicioEditado}
        onSuccess={() => {
          setServicioEditado(null);
          cargarServicios();
        }}
      />
      {servicioEditado && (
        <button onClick={() => setServicioEditado(null)}>
          Cancelar edición
        </button>
      )}
      {servicioEditado && (
  <p style={{ color: 'orange' }}>
    Estás editando un servicio
  </p>
)}
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
                <button
                    onClick={() => handleDelete(s.id)}
                    disabled={servicioEditado?.id === s.id}
                    style={{ marginLeft: '5px', color: 'red' }}
                  >
                    Eliminar
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
