import {Component} from "react";
import {Navigate, Route, RouterProvider, Routes} from "react-router-dom";
import './index.less'
import Header from "@/components/Header/index.jsx";
import MenuList from "@/components/MenuList/index.jsx";
import routes from "@/routers/index.jsx";
import Login from "@/pages/Login/index.jsx";
import Content from "@/components/Content/index.jsx";
export default class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
                <div className='css-home'>
                    <div className="css-left-content">
                        <MenuList/>
                    </div>
                    <div className='css-right-content'>
                        <Header/>
                        <Content/>
                    </div>
                </div>
        )
    }
}