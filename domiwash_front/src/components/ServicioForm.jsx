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
  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);

  //Estados visuales
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');




  //Validar datos del formulario
  const validateForm = () => {
  const newErrors = {};

  console.log('🧪 FORM ACTUAL:', form);

  if (!form.tipo_servicio_id) {
    newErrors.tipo_servicio_id = 'Tipo de servicio requerido';
  }

  if (!form.cliente_id) {
    newErrors.cliente_id = 'Cliente requerido';
  }

  if (!form.precio || Number(form.precio) <= 0) {
    newErrors.precio = 'Precio inválido';
  }

  if (!form.costo || Number(form.costo) <= 0) {
    newErrors.costo = 'Costo inválido';
  }

  if (!form.forma_pago_id) {
    newErrors.forma_pago_id = 'Forma de pago requerida';
  }

  if (!form.estado_id) {
    newErrors.estado_id = 'Estado requerido';
  }

  if (!form.fecha) {
    newErrors.fecha = 'Fecha requerida';
  }

  console.log('❌ ERRORES DETECTADOS:', newErrors);

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // Cargar catálogos
  useEffect(() => {
    api.get('/catalogos/tipos-servicio').then(res => setTipos(res.data));
    api.get('/catalogos/estados-servicio').then(res => setEstados(res.data));
    api.get('/catalogos/formas-pago').then(res => setFormasPago(res.data));
    api.get('/clientes').then(res => setClientes(res.data));
  }, []);

  // Cargar datos si es edición
  useEffect(() => {
    if (servicioEditado) {
      setSuccess('');
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

  //Resetear el formulario cuando se cancela la edicion
  useEffect(() => {
  if (!servicioEditado) {
    setForm(initialState);
    setErrors({});
  }
}, [servicioEditado]);



  const handleChange = e => {

    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));


  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('🟢 SUBMIT EJECUTADO');

    setError('');
    setSuccess('');

    const isValid = validateForm();
    console.log('🧪 validateForm devuelve:', isValid);

    if (!isValid) {
      console.log('⛔ FORMULARIO INVÁLIDO, SE DETIENE');
      return;
    }

    setLoading(true);

    try {
      if (servicioEditado) {
        await api.put(`/servicios/${servicioEditado.id}`, form);
        setSuccess('Servicio actualizado correctamente');
      } else {
        console.log('📤 PAYLOAD ENVIADO:', form);
        await api.post('/servicios', form);
        setSuccess('Servicio guardado correctamente');
      }

      setForm(initialState);
      setErrors({});
      onSuccess();

    } catch (err) {
      console.error(err);
      setError('Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>

    {error && <p style={{ color: 'red' }}>{error}</p>}
    {success && <p style={{ color: 'green' }}>{success}</p>}

    <form onSubmit={handleSubmit}>
      <h3>{servicioEditado ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>

      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
      />
       {errors.fecha && (
        <small style={{ color: 'red' }}>
        {errors.fecha}
        </small> )}

      <select
        name="tipo_servicio_id"
        value={form.tipo_servicio_id}
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden >{servicioEditado
    ? 'Cambiar Tipo servicio'
    : 'Tipo de servicio'}</option>
        {tipos.map(t => (
          <option key={t.id} value={t.id}>{t.nombre}</option>
        ))}
      </select>
       {errors.tipo_servicio_id && (
        <small style={{ color: 'red' }}>
        {errors.tipo_servicio_id}
        </small> )}

    
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          required
        />
        {errors.precio && (
        <small style={{ color: 'red' }}>
        {errors.precio}
        </small> )}

      <input
        type="number"
        name="costo"
        placeholder="Costo"
        value={form.costo}
        onChange={handleChange}
        required
      />
       {errors.costo && (
        <small style={{ color: 'red' }}>
        {errors.costo}
        </small> )}

        <select
          name="cliente_id"
          value={form.cliente_id}
          onChange={handleChange}
        >
          <option value="" disabled hidden >{servicioEditado
            ? 'Cambiar Cliente'
            : 'Cliente'}</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        {errors.cliente_id && (
          <small style={{ color: 'red' }}>
            {errors.cliente_id}
          </small>
        )}


      <select
        name="forma_pago_id"
        value={form.forma_pago_id}
        onChange={handleChange}
      >
        <option value="" disabled hidden >{servicioEditado
          ? 'Cambiar Forma de pago'
          : 'Forma de pago'}</option>
        {formasPago.map(f => (
          <option key={f.id} value={f.id}>{f.nombre}</option>
        ))}
      </select>
       {errors.forma_pago_id && (
        <small style={{ color: 'red' }}>
        {errors.forma_pago_id}
        </small> )}

      <select
        name="estado_id"
        value={form.estado_id}
        onChange={handleChange}
        required
      >
        <option value="" disabled hidden >{servicioEditado
          ? 'Cambiar Estado'
          : 'Estado'}</option>
        {estados.map(e => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>
       {errors.estado_id && (
        <small style={{ color: 'red' }}>
        {errors.estado_id}
        </small> )}

      <textarea
        name="observaciones"
        placeholder="Observaciones"
        value={form.observaciones}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
  
        {loading ? 'Guardando...' : servicioEditado ? 'Actualizar' : 'Guardar'}

      </button>
    </form>

    </>
  );
}
