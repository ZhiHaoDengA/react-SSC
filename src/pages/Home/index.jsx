import {Component} from "react";
import './index.less'
import Header from "@/components/Header/index.jsx";
import MenuList from "@/components/MenuList/index.jsx";

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
                    </div>
                </div>
        )
    }
}