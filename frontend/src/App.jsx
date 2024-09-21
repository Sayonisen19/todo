import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter , Routes ,Route} from 'react-router-dom' 
import Header from './components/Header';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Todo from './components/Todo';
import Home from './components/Home';
import  {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<Signin/>} />
        <Route path='/todo' element={<Todo/>} />
        <Route path='/' element={<Home/>} />
        
      </Routes>
      <ToastContainer/>
    </BrowserRouter>
    <ToastContainer/>
    </>
  )
}

export default App
