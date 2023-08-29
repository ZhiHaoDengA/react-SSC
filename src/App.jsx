import './App.css'
import './style/global.less'
import { BrowserRouter,Routes , Route , Navigate } from "react-router-dom";
import routes from './routers'
import Home from '@/pages/Home/index'
import Login from '@/pages/Login'
import '@/utils/index.jsx'
import NotFound from "@/pages/NotFound";
function App() {
  console.log(routes)
  return (
      <div id='app'>
        <BrowserRouter>
          <Routes>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path="/" element ={<Navigate replace to="/home" />} />
          </Routes>
        </BrowserRouter>
      </div>
    // <RouterProvider router={routes} />

  )
}

export default App
