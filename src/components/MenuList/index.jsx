import {Component} from "react";
import './index.less'
import logo from '@/assets/img/icon_qiehaunhoutai_nor.png'
import {Button, Menu} from 'antd'
import routes from "@/routers/index.jsx";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
export default class MenuList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            collapsed:false
        }
    }

    componentDidMount() {
        console.log()
    }

    onChangeMenu(){

    }

    toggleCollapsed(){
        let {collapsed} = this.state
        this.setState({
            collapsed:!collapsed
        })
    }

    render() {
        const menuList = routes.routes;
        let {collapsed} = this.state
        return(
            <div className="css-layout-left-wrap">
                <div className="css-logo-wrap flex al-center">
                    <img src={logo} alt="" />
                </div>
                <div className=" scroll-bar">
                    <Menu
                        className='css-menu-wrap'
                        onClick={this.onChangeMenu.bind(this)}
                        // selectedKeys={[this.props.location.pathname]}
                        // defaultOpenKeys={[this.props.location.pathname.split('/').slice(0, -1).join('/')]}
                        mode="inline"
                        items={menuList}
                        inlineCollapsed={collapsed}
                    />
                    <div className='css-bottom'>
                        <Button
                            type="primary"
                            onClick={this.toggleCollapsed.bind(this)}
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}