import {Component} from "react";
import './index.less'
import {Outlet} from 'react-router-dom'
import {Route, Routes} from "react-router-dom";
import routes from "@/routers/index.jsx";
import NotFound from "@/pages/NotFound";
export default class Content extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div className='css-content'>
                <div>
                    <Outlet></Outlet>
                    {/*<BrowserRouter>*/}
                    {/*<RouterProvider router={createBrowserRouter(routes)} />*/}
                    {/*    {*/}
                    {/*        routes.map(route=>{*/}
                    {/*            return(*/}
                    {/*                <Route key={route.path} exact path={route.path} element={route.element}/>*/}
                    {/*            )*/}
                    {/*        })*/}
                    {/*    }*/}
                    {/*    <Route path='/not' component={NotFound}></Route>*/}
                        {/*<Route path='/login' element={<Login/>}></Route>*/}
                        {/*<Route path="/" element ={<Navigate replace to="/home" />} />*/}
                {/*</BrowserRouter>*/}
                </div>
            </div>
        )
    }
}