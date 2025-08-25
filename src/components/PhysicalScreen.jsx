import React, { useState, useEffect } from 'react';
import HomeButton from './HomeButton';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';
import testData from '../data/physical_tests.json';

const Stopwatch = () => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 10);
            }, 10);
        } else if (!isRunning && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    return (
        <div className="stopwatch">
            <div className="timer-display">
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </div>
            <div className="stopwatch-buttons">
                <button onClick={() => setIsRunning(true)}>Start</button>
                <button onClick={() => setIsRunning(false)}>Stop</button>
                <button onClick={() => { setIsRunning(false); setTime(0); }}>Reset</button>
            </div>
        </div>
    );
};

function PhysicalScreen({ goHome }) {
  const [log, setLog] = useLocalStorage('physicalLog', []);
  const [newEvent, setNewEvent] = useState({ date: new Date().toISOString().slice(0, 10), event: 'alergare', value: '' });

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newEvent.value) return;
    const updatedLog = [...log, { ...newEvent, value: parseFloat(newEvent.value) }].sort((a,b) => new Date(a.date) - new Date(b.date));
    setLog(updatedLog);
    setNewEvent({ date: new Date().toISOString().slice(0, 10), event: 'alergare', value: '' });
  };

  const formatChartData = (event, unit) => {
      return log
        .filter(item => item.event === event)
        .map(item => ({ date: new Date(item.date).toLocaleDateString('ro-RO'), [`Timp (${unit})`]: item.value }));
  };

  return (
    <div className="app-container">
      <HomeButton goHome={goHome} />
      <motion.div 
        className="quiz-card physical-screen"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Modul Pregătire Fizică</h2>
        
        <div className="physical-section">
            <h3>Cronometru Specializat</h3>
            <Stopwatch />
        </div>

        <div className="physical-section">
            <h3>Jurnal de Antrenament</h3>
            <form onSubmit={handleAddLog} className="log-form">
                <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                <select value={newEvent.event} onChange={e => setNewEvent({...newEvent, event: e.target.value})}>
                    <option value="alergare">Alergare 2000m (min)</option>
                    <option value="traseu">Traseu (sec)</option>
                </select>
                <input type="number" step="0.01" value={newEvent.value} onChange={e => setNewEvent({...newEvent, value: e.target.value})} placeholder="Rezultat"/>
                <button type="submit" className="start-button primary">Adaugă</button>
            </form>
            <h4>Progres Alergare 2000m</h4>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={formatChartData('alergare', 'min')}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Timp (min)" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>

        <div className="physical-section">
          <h3>Bareme Oficiale</h3>
          <div className="barem-tables">
            <div>
              <h4>{testData.alergare.name}</h4>
              <p>{testData.alergare.description}</p>
              <table className="barem-table">
                <thead><tr><th>Nota</th><th>Timp (min:sec)</th></tr></thead>
                <tbody>
                  {testData.alergare.barem.map(item => <tr key={item.nota}><td>{item.nota}</td><td>{item.timp}</td></tr>)}
                </tbody>
              </table>
            </div>
            <div>
              <h4>{testData.traseu.name}</h4>
               <p>{testData.traseu.description}</p>
              <table className="barem-table">
                <thead><tr><th>Nota</th><th>Timp (min:sec)</th></tr></thead>
                <tbody>
                  {testData.traseu.barem.map(item => <tr key={item.nota}><td>{item.nota}</td><td>{item.timp}</td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default PhysicalScreen;