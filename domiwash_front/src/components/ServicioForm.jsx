import { useEffect, useState } from 'react';
import api from '../api/axios';

const initialState = {
  fecha: '',
  tipo_servicio_id: '',
  precio: '',
  costo: '',
  cliente_id: '',
  forma_pago_id: '',
  estado_id: '',
  observaciones: ''
};

export default function ServicioForm({ servicioEditado, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [tipos, setTipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [formasPago, setFormasPago] = useState([]);

  // Cargar catálogos
  useEffect(() => {
    api.get('/catalogos/tipos-servicio').then(res => setTipos(res.data));
    api.get('/catalogos/estados-servicio').then(res => setEstados(res.data));
    api.get('/catalogos/formas-pago').then(res => setFormasPago(res.data));
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (servicioEditado) {
      setForm({
        fecha: servicioEditado.fecha,
        tipo_servicio_id: servicioEditado.tipo_servicio_id,
        precio: servicioEditado.precio,
        costo: servicioEditado.costo,
        cliente_id: servicioEditado.cliente_id || '',
        forma_pago_id: servicioEditado.forma_pago_id || '',
        estado_id: servicioEditado.estado_id,
        observaciones: servicioEditado.observaciones || ''
      });
    }
  }, [servicioEditado]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      if (servicioEditado) {
        await api.put(`/servicios/${servicioEditado.id}`, form);
      } else {
        await api.post('/servicios', form);
      }

      setForm(initialState);
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el servicio');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{servicioEditado ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>

      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
      />

      <select
        name="tipo_servicio_id"
        value={form.tipo_servicio_id}
        onChange={handleChange}
        required
      >
        <option value="">Tipo de servicio</option>
        {tipos.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>

      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={form.precio}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="costo"
        placeholder="Costo"
        value={form.costo}
        onChange={handleChange}
        required
      />

      <select
        name="forma_pago_id"
        value={form.forma_pago_id}
        onChange={handleChange}
      >
        <option value="">Forma de pago</option>
        {formasPago.map(f => (
          <option key={f.id} value={f.id}>{f.nombre}</option>
        ))}
      </select>

      <select
        name="estado_id"
        value={form.estado_id}
        onChange={handleChange}
        required
      >
        <option value="">Estado</option>
        {estados.map(e => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>

      <textarea
        name="observaciones"
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={handleChange}
      />

      <button type="submit">
        {servicioEditado ? 'Actualizar' : 'Guardar'}
      </button>
    </form>
  );
}
