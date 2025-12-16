import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

/*
 * ------------------------------------------------------------------
 * CONFIGURACIÓN DE SOCKET
 * ------------------------------------------------------------------
 * Inicialización de la conexión con el servidor de Websockets.
 */
const socket = io.connect('http://150.136.20.54:5000'); 

const ChatComponent = ({ room, username }) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    /*
     * CICLO DE VIDA DEL CHAT
     * 1. Se une a la sala específica del producto al montar el componente.
     * 2. Escucha mensajes entrantes y carga el historial previo.
     * 3. Limpia los listeners al desmontar para evitar fugas de memoria.
     */
    useEffect(() => {
        // Unirse a la sala (Room)
        socket.emit("join_room", room);

        // Listener: Recibir mensaje en tiempo real
        const receiveMessageListener = (data) => {
            if (data.room === room) {
                setMessageList((list) => [...list, data]);
            }
        };

        // Listener: Cargar historial persistente
        const loadHistoryListener = (history) => {
             if(history.length > 0 && history[0].room === room){
                 setMessageList(history);
             }
        };

        socket.on("receive_message", receiveMessageListener);
        socket.on("load_history", loadHistoryListener);

        // Cleanup function (Desmontaje)
        return () => {
            socket.off("receive_message", receiveMessageListener);
            socket.off("load_history", loadHistoryListener);
        };
    }, [room]);

    /*
     * ENVÍO DE MENSAJES
     * Construye el objeto de mensaje y lo emite al servidor.
     */
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            
            await socket.emit("send_message", messageData);
            
            // Actualización optimista de la UI
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    return (
        <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ borderTop: '2px solid #eee', marginTop: '15px', paddingTop: '15px' }}
        >
            <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>💬 Chat en Vivo</h4>
            
            {/* ZONA DE VISUALIZACIÓN DE MENSAJES */}
            <div style={{ 
                height: '150px', 
                overflowY: 'scroll', 
                background: '#f0f2f5', 
                borderRadius: '8px',
                padding: '10px', 
                marginBottom: '15px',
                border: '1px solid #ddd'
            }}>
                {messageList.length === 0 ? (
                    <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px', fontSize: '0.9rem' }}>
                        No hay mensajes anteriores.
                    </p>
                ) : (
                    messageList.map((msg, index) => (
                        <div key={index} style={{ textAlign: msg.author === username ? 'right' : 'left', marginBottom: '8px' }}>
                            <span style={{ 
                                background: msg.author === username ? '#0084ff' : 'white', 
                                color: msg.author === username ? 'white' : 'black',
                                padding: '8px 12px', 
                                borderRadius: '15px', 
                                display: 'inline-block',
                                fontSize: '0.9rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}>
                                <strong>{msg.author}:</strong> {msg.message}
                            </span>
                             <div style={{fontSize: '0.6rem', color: '#888', marginTop: '2px'}}>
                                {msg.time}
                             </div>
                        </div>
                    ))
                )}
            </div>

            {/* INPUT Y BOTÓN DE ENVÍO */}
            <div style={{ display: 'flex', height: '50px' }}> 
                <input
                    type="text"
                    value={currentMessage}
                    placeholder="Escribe tu mensaje aquí..."
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyPress={(event) => event.key === "Enter" && sendMessage()}
                    style={{ 
                        flex: 1, 
                        padding: '0 15px', 
                        fontSize: '1.1rem', 
                        border: '2px solid #ccc',
                        borderRadius: '8px 0 0 8px', 
                        outline: 'none'
                    }}
                />
                <button 
                    onClick={sendMessage} 
                    style={{ 
                        background: '#0084ff', 
                        color: 'white', 
                        border: 'none', 
                        width: '60px', 
                        fontSize: '1.5rem', 
                        borderRadius: '0 8px 8px 0', 
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                    }}
                >
                    ➤
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;