import {Component} from "react";
import './index.less'
import logo from '@/assets/img/icon_qiehaunhoutai_nor.png'
import routes from "@/routers/index.jsx";
import {useNavigate} from 'react-router-dom'
import React from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Form, Input, Table, Space, Modal, Select, Radio, message, Button, Menu } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

export default function MenuList (){
    let {collapsed,setCollapsed} = React.useState(false)
    const menuList = routes;
    const navigate = useNavigate()

    const onChangeMenu = (value)=>{
        navigate(value.key)
    }

    const toggleCollapsed = ()=>{
        setCollapsed(!collapsed)
    }

    return(
            <div className="css-layout-left-wrap">
                <div className="css-logo-wrap flex al-center">
                    <img src={logo} alt="" />
                </div>
                <div className=" scroll-bar">
                    <Menu
                        className='css-menu-wrap'
                        onClick={onChangeMenu}
                        // selectedKeys={[this.props.location.pathname]}
                        // defaultOpenKeys={[this.props.location.pathname.split('/').slice(0, -1).join('/')]}
                        mode="inline"
                        items={menuList}
                        inlineCollapsed={collapsed}
                    />
                    <div className='css-bottom'>
                        <Button
                            type="primary"
                            onClick={toggleCollapsed}
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