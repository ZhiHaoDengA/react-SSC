import './App.css'
import './style/global.less'
import {BrowserRouter, Routes, Route, Navigate, RouterProvider, createBrowserRouter} from "react-router-dom";
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
            <Route path='/' element={<Home/>}>
                {
                    routes.map(item=>{
                        return item.children.map(value=>{
                            return(
                                <Route key={value.path} path={value.path} element={value.element}></Route>
                            )
                        })
                    })
                }
            </Route>
            <Route path='/login' element={<Login/>}></Route>
          </Routes>
        </BrowserRouter>
        {/* <RouterProvider router={createBrowserRouter(routes)} />*/}

      </div>

  )
}

export default App
