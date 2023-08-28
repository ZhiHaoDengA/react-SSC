import './App.css'
import { RouterProvider } from "react-router-dom";
import routes from './routers'


function App() {
  console.log(routes)
  return (
    <RouterProvider router={routes} />
  )
}

export default App
