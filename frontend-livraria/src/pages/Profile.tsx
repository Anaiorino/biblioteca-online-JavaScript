import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import logoGif from '../assets/logo.gif';
import { toast } from 'react-toastify';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  
  const token = localStorage.getItem('@Projeto:token');
  const userLocal = JSON.parse(localStorage.getItem('@Projeto:user') || '{}');

  const carregarPerfil = async () => {
    try {
      const response = await api.get('/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setNovoNome(response.data.nome);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar dados do pergaminho.");
    }
  };

  useEffect(() => {
    if (!token) navigate('/'); else carregarPerfil();
  }, [token, navigate]);

  const handleUpdateNome = async () => {
    try {
      // Pega o ID do usuário que o /perfil retornou
      const userId = userData?.id;

      if (!userId) {
        toast.error("ID do usuário não encontrado.");
        return;
      }

      // Agora a rota bate com o que adicionamos no routes.ts: PUT /usuarios/:id
      await api.put(`/usuarios/${userId}`, { nome: novoNome }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Atualiza o local storage para o header refletir a mudança imediatamente
      const usuarioAtualizado = { ...userLocal, nome: novoNome };
      localStorage.setItem('@Projeto:user', JSON.stringify(usuarioAtualizado));
      
      toast.success("Sua nova identidade foi registrada!");
      setEditando(false);
      carregarPerfil(); // Recarrega os dados do banco
      
    } catch (error: any) {
      console.error("Erro no update:", error);
      // Se der 404 aqui, é porque você esqueceu de salvar o routes.ts no servidor ou não criou a função no Controller
      if (error.response?.status === 404) {
        toast.error("A rota ainda não foi criada no servidor. Verifique o routes.ts.");
      } else {
        toast.error("Falha ao registrar nova identidade.");
      }
    }
  };

  if (!userData) return <div style={{ backgroundColor: '#000', height: '100vh' }} />;

  const tempoTotal = userData.tempoTotalLeitura || 0;
  const horas = Math.floor(tempoTotal / 60);
  const minutos = tempoTotal % 60;

  const itemMenuStyle = { 
    width: '100%', 
    padding: '15px', 
    background: 'none', 
    border: 'none', 
    color: '#fff', 
    textAlign: 'left' as 'left', 
    cursor: 'pointer', 
    fontSize: '12px', 
    fontWeight: 'bold' as 'bold', 
    borderBottom: '1px solid #222' 
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff' }}>
      
      {/* HEADER PREMIUM */}
      <header style={{ 
        position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 40px', backgroundColor: 'rgba(0,0,0,0.98)', zIndex: 9999,
        borderBottom: '1px solid #1a1a1a', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/home')}>
          <img src={logoGif} alt="Logo" style={{ width: '30px' }} />
          <h1 className="fonte-antiga" style={{ fontSize: '18px', color: '#fff', margin: 0 }}>GATO PRETO</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative' }}>
          <button onClick={() => setMenuAberto(!menuAberto)} style={{ background: '#c5a677', border: 'none', color: '#000', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
            {menuAberto ? 'FECHAR' : 'MENU'}
          </button>

          {menuAberto && (
            <div style={{ position: 'absolute', top: '55px', right: '0', width: '200px', backgroundColor: '#111', border: '1px solid #c5a677', borderRadius: '4px', boxShadow: '0 10px 50px rgba(0,0,0,1)', zIndex: 10000, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => navigate('/home')} style={itemMenuStyle}>📚 BIBLIOTECA</button>
              <button onClick={() => navigate('/favoritos')} style={itemMenuStyle}>❤️ FAVORITOS</button>
              {userData.role === 'ADMIN' && <button onClick={() => navigate('/dashboard')} style={{...itemMenuStyle, color: '#c5a677'}}>📟 PAINEL MESTRE</button>}
              <div style={{ height: '1px', background: '#333' }} />
              <button onClick={() => {localStorage.clear(); navigate('/')}} style={{...itemMenuStyle, color: '#ff4d4d'}}>🚪 SAIR</button>
            </div>
          )}
        </div>
      </header>

      <main style={{ padding: '120px 20px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          
          <h2 className="fonte-antiga" style={{ fontSize: '32px', color: '#fff', marginBottom: '40px', textAlign: 'center' }}>
            FICHA DO MEMBRO
          </h2>

          <div style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '40px', textAlign: 'center' }}>
            
            <div style={{ marginBottom: '40px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎭</div>
              
              {!editando ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                  <h3 className="fonte-antiga" style={{ fontSize: '32px', margin: 0, color: '#c5a677' }}>{userData.nome}</h3>
                  <button onClick={() => setEditando(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✏️</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                  <input 
                    value={novoNome} 
                    onChange={(e) => setNovoNome(e.target.value)}
                    style={{ 
                      padding: '10px', backgroundColor: '#000', border: '1px solid #c5a677', 
                      color: '#fff', borderRadius: '4px', textAlign: 'center', fontSize: '20px', width: '80%', outline: 'none'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleUpdateNome} style={{ backgroundColor: '#c5a677', border: 'none', padding: '8px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>SALVAR</button>
                    <button onClick={() => setEditando(false)} style={{ backgroundColor: '#333', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' }}>CANCELAR</button>
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '15px' }}>
                <span style={{ border: '1px solid #333', color: '#666', padding: '5px 15px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' }}>
                  {userData.role}
                </span>
              </div>
            </div>

            <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', padding: '30px', borderRadius: '4px', marginBottom: '40px' }}>
              <label style={{ fontSize: '11px', color: '#c5a677', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
                TEMPO DE SABEDORIA ACUMULADO
              </label>
              <p style={{ margin: '15px 0 0', fontSize: '32px', color: '#fff', fontWeight: '900' }}>
                ⏳ {horas}h {minutos}m
              </p>
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
                <label style={{ fontSize: '10px', color: '#444', fontWeight: 'bold', letterSpacing: '1px' }}>CORREIO ELETRÔNICO</label>
                <p style={{ margin: '5px 0 0', fontSize: '16px', color: '#999' }}>{userData.email}</p>
              </div>
              
              <div style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '15px' }}>
                <label style={{ fontSize: '10px', color: '#444', fontWeight: 'bold', letterSpacing: '1px' }}>REGISTRO DE IDENTIFICAÇÃO (CPF)</label>
                <p style={{ margin: '5px 0 0', fontSize: '16px', color: '#999' }}>{userData.cpf || 'Não catalogado'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};