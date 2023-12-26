import './App.css';
import { Route, Routes } from 'react-router-dom'
import Sender from './components/Sender';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import Reciever from './components/Reciever';

function App() {

  return (
    <div className='App'>
      <Toaster />
      <Routes>
        <Route path='/' exact element={<Sender />} />
        <Route path='/recieve/:recieverString' element={<PrivateRoute> <Reciever /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
