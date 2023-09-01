import React from "react";
import "./index.less";
import axios from 'axios'
// import store from "@/store";
import ElementContent from '../elementContent/index'
export default class ControlElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isClassify:false,//判断 方案要素文本框 显示隐藏
        };
    }
    onMounted() {
        store.subscribe(() => {
            this.setState(store.getState());
        });
    }

    render() {
        return (
            // style={{ display: this.state.isSelfShow ? "block" : "none" }}
            <div className="jingtai 3D_ignore" >
                <ElementContent getClassify={this.state.isClassify}/>
            </div>
        );
    }
}
