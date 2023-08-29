import React, { Component } from 'react';
import Time from '@/components/time/index.jsx';
import './index.less';
import { message, Popover } from 'antd';
import touxiang from '@/assets/img/main/touxiang.png'

const getImgUrl = file => {
    return new URL(`../../assets/img/main/${file}`, import.meta.url).href;
};

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dorpDownVisible: false,
        };
    }

    componentWillMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }


    render() {
        return (
            <div className={'css-header-wrap'}>
                <span>智安小区管理中心</span>
                <div className="css-menu-wrap"></div>
                <span className={'css-time'}>

        </span>
                <Popover
                    placement="bottomLeft"
                    open={this.state.dorpDownVisible}
                    content={
                        <div className="css-user-drop-down">
                            <div className="css-img-wrap">

                                <img src={touxiang} alt="" />
                                {/*<span>{loginInfo?.person.nickname}</span>*/}
                            </div>
                            <div className="css-desc-item">
                                <span>角色:</span>
                                {/*<span>{loginInfo?.person.role}</span>*/}
                            </div>
                            <div className="css-desc-item">
                                <span>部门:</span>
                                {/*<span>{loginInfo?.person.department}</span>*/}
                            </div>
                            <div className="css-trigger-wrap">
                                <div className="css-trigger-item mgb-24" onClick={this.clickDropItem.bind(this, 1)}>
                                    <img src={getImgUrl('@/assets/img/main/icon_genrenzhongxing.png')} alt="" />
                                    <span>个人中心</span>
                                </div>
                                {/*<div className="css-trigger-item" onClick={this.clickDropItem.bind(this, 2)}>*/}
                                {/*  <img src={require('@/assets/img/main/icon_tuichu.png').default} alt="" />*/}
                                {/*  <span>返回三维平台</span>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    }
                    trigger="click"
                >
                    <div
                        className="css-user-wrap flex al-center pointer"
                        onClick={() =>
                            this.setState({
                                dorpDownVisible: !this.state.dorpDownVisible
                            })
                        }
                    >
                        <Time />
                        <span className="mgl-8">
                            123
                            {/*{loginInfo?.person.nickname}*/}
                        </span>

                        <img
                            className="mgl-8"
                            src={getImgUrl('btn_xiala_sed.png')}
                            alt=""
                        />
                    </div>
                </Popover>
            </div>
        );
    }
    clickDropItem(type) {
        this.setState({
            dorpDownVisible: false
        });
        switch (type) {
            case 1:
                this.props.history.push('/system-person-center');
                break;
            case 2:
                if (window.parent) {
                    window.parent.postMessage('exit', '*');
                }
                break;
            default:
                break;
        }
    }
    linkPage(info) {
        console.log(info)
        if(info.children.length !== 0 && info.children[0].children.length !== 0){
            this.props.history.push(info.children[0].children[0].path);
        }else{
            this.props.history.push(info.path);
        }

    }
}

export default Header;
