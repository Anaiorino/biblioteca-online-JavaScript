import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

// ASSETS
import logoGif from '../assets/logo.gif';

export const AddBook: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const [capa, setCapa] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  // NOVO
  const [pdfUrl, setPdfUrl] = useState('');

  const [menuAberto, setMenuAberto] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('@Projeto:token');
  const user = JSON.parse(localStorage.getItem('@Projeto:user') || '{}');

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const response = await api.get('/categorias', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategorias(response.data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    carregarCategorias();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    data.append('titulo', titulo);
    data.append('autor', autor);
    data.append('categoriaId', categoriaId);

    if (capa) data.append('capa', capa);

    // PDF UPLOAD
    if (pdf) {
      data.append('pdf', pdf);
    }

    // LINK EXTERNO
    if (pdfUrl.trim()) {
      data.append('pdfUrl', pdfUrl);
    }

    try {
      await api.post('/livros', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Nova obra catalogada com sucesso!');
      navigate('/home');

    } catch (error) {
      toast.error('Erro ao catalogar obra.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>

      {/* HEADER */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        backgroundColor: 'rgba(0,0,0,0.98)',
        zIndex: 9999,
        borderBottom: '1px solid #1a1a1a',
        boxSizing: 'border-box'
      }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <img src={logoGif} alt="Logo" style={{ width: '30px' }} />
          <h1 className="fonte-antiga" style={{ fontSize: '18px', margin: 0 }}>
            GATO PRETO
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
          <div style={{ color: '#c5a677', fontWeight: 'bold', fontSize: '12px' }}>
            ✨ {user.nome?.toUpperCase()}
          </div>

          <button
            onClick={() => setMenuAberto(!menuAberto)}
            style={{
              background: '#c5a677',
              border: 'none',
              color: '#000',
              padding: '8px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {menuAberto ? 'FECHAR' : 'MENU'}
          </button>

          {menuAberto && (
            <div style={{
              position: 'absolute',
              top: '55px',
              right: 0,
              width: '200px',
              backgroundColor: '#111',
              border: '1px solid #c5a677',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <button onClick={() => navigate('/home')} style={itemMenuStyle}>
                📚 BIBLIOTECA
              </button>

              <button onClick={() => navigate('/dashboard')} style={itemMenuStyle}>
                📊 DASHBOARD
              </button>

              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                style={{ ...itemMenuStyle, color: '#ff4d4d' }}
              >
                🚪 SAIR
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main style={{
        padding: '120px 20px 60px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '650px',
            backgroundColor: '#111',
            padding: '40px',
            borderRadius: '6px',
            border: '1px solid #222',
            display: 'flex',
            flexDirection: 'column',
            gap: '25px'
          }}
        >
          <h2
            className="fonte-antiga"
            style={{
              textAlign: 'center',
              color: '#c5a677',
              fontSize: '34px',
              margin: 0
            }}
          >
            NOVO MANUSCRITO
          </h2>

          {/* TITULO */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>TÍTULO</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* AUTOR */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>AUTOR</label>
            <input
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* CATEGORIA */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>CATEGORIA</label>

            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              style={inputStyle}
              required
            >
              <option value="">Selecione</option>

              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* CAPA */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>CAPA</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCapa(e.target.files ? e.target.files[0] : null)
              }
              style={fileInputStyle}
            />
          </div>

          {/* PDF */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>UPLOAD PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) =>
                setPdf(e.target.files ? e.target.files[0] : null)
              }
              style={fileInputStyle}
            />
          </div>

          {/* LINK */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>OU LINK DO LIVRO</label>
            <input
              type="url"
              placeholder="https://..."
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#c5a677',
              color: '#000',
              border: 'none',
              padding: '14px',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            CATALOGAR OBRA
          </button>

          <button
            type="button"
            onClick={() => navigate('/home')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            CANCELAR
          </button>
        </form>
      </main>
    </div>
  );
};

// ESTILOS
const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column' as 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '12px',
  color: '#c5a677',
  fontWeight: 'bold'
};

const inputStyle = {
  padding: '12px',
  backgroundColor: '#0a0a0a',
  border: '1px solid #333',
  color: '#fff',
  borderRadius: '4px',
  outline: 'none'
};

const fileInputStyle = {
  fontSize: '12px',
  color: '#999'
};

const itemMenuStyle = {
  width: '100%',
  padding: '14px',
  background: 'none',
  border: 'none',
  color: '#fff',
  textAlign: 'left' as 'left',
  cursor: 'pointer',
  borderBottom: '1px solid #222'
};