import React from 'react';
import './index.less';
// import Maplocation from './Maplocation.js';
// import ElementPage from './elementPage.js';
import { message } from 'antd';
// import store from '@/store';
// import a1 from '@/assets/img/jingtai/icon_gongjulan.png';
// import a2 from '@/assets/img/jingtai/icon_gongjulan_sed.png';

// import { HCMapApi } from '../../third/HCMapApi';
// import '../../third/HCMapApi.css';


var toolBarList = [
    { id: 2, name: '保存所有', isSelected: false, btn_nor: 'icon_baocun', btn_start: 'icon_baocun_sed' },
    {
        id: 3,
        name: '单选',
        isSelected: false,
        btn_nor: 'icon_danxuan备份_5',
        btn_start: 'icon_danxuan_sed',
    },
    {
        id: 4,
        name: '多选',
        isSelected: false,
        btn_nor: 'icon_danxuan备份_4',
        btn_start: 'icon_duoxuan_sed',
    },
    {
        id: 5,
        name: '框选',
        isSelected: false,
        btn_nor: 'icon_danxuan备份_6',
        btn_start: 'icon_kuangxuan_sed',
    },
    {
        id: 6,
        name: '多边形选择',
        isSelected: false,
        btn_nor: 'icon_danxuan备份_8',
        btn_start: 'icon_duobianxiang_sed',
    },
    { id: 7, name: '置顶', isSelected: false, btn_nor: 'icon_zhiding', btn_start: 'icon_zhiding_sed' },
    { id: 8, name: '置底', isSelected: false, btn_nor: 'icon_zhidi', btn_start: 'icon_zhidi_sed' },
    {
        id: 9,
        name: '上移一层',
        isSelected: false,
        btn_nor: 'icon_shangyiyiceng',
        btn_start: 'icon_shangyiyiceng_sed',
    },
    {
        id: 10,
        name: '下移一层',
        isSelected: false,
        btn_nor: 'icon_xiayiyiceng',
        btn_start: 'icon_xiayiyiceng_sed',
    },
    {
        id: 11,
        name: '向上',
        isSelected: false,
        btn_nor: 'icon_xiangshang',
        btn_start: 'icon_xiangshang_sed',
    },
    {
        id: 12,
        name: '向下',
        isSelected: false,
        btn_nor: 'icon_xiangshang备份',
        btn_start: 'icon_xiangxia_sed',
    },
    {
        id: 13,
        name: '向右',
        isSelected: false,
        btn_nor: 'icon_xiangshang备份(1)',
        btn_start: 'icon_xiangyou_sed',
    },
    {
        id: 14,
        name: '向左',
        isSelected: false,
        btn_nor: 'icon_xiangshang备份_2',
        btn_start: 'icon_xiangzuo_sed',
    },
    { id: 15, name: '删除', isSelected: false, btn_nor: 'icon_shanchu', btn_start: 'icon_shanchu_sed' },
    { id: 16, name: '分屏', isSelected: false, btn_nor: 'icon_fenping', btn_start: 'icon_fenping_sed1' },
];

export default class ElementContent extends React.Component {
    constructor(props) {
        super(props);
        this.unique_name = 'elementContent';
        // this.projectName = GetQtController().inParam.strProjectName;
        // this.centerServer = GetQtController().inParam.dataUrl;
        this.userToken = '';
        this.userId = -1;
        this.planId = 'static';
        this.mapId = 0;
        this.changeMapId = 0;
        this.lastToolButton = null;
        // this.type = COMPONENT_TYPE_MENU;
        this.state =  {
            toolBarList: toolBarList,
            currMarker: null,
            currType: 1,
            currStyle:-1,
            inputStep: 3, // 值
            thirdInfo:null,
            msgInfo: '有未保存操作，是否退出？', //提示内容
            showMsgbox: false, //提示关闭
            mapList: [], //地图列表下拉框
            elemList: [],
            elemStyleList: [],
            allChecked: true,
            currUuid: '',
            isInput: false,
            showMap: false,
            mapName: '',
            filter: null,
            isDouble: false, //工具栏事件
            isClosePanel: false, //关闭
            isSearchShow:false,
            bindInfo: null, //数据关联元素ID
            usageType: '', //数据关联元素类型
            usageTypeName: '', //数据关联元素类型名称
            thirdId:'',        //第三方ID
            thirdDataList: [], //第三方数据列表
            thirdDataPageNo: 1, //第三方数据当前页数
            thirdDataPageSize: 10, //第三方数据页面数据条数
            thirdDataTotalNum: 100,
        };
        this.fangan = [
            { id: 1, name: 'aaa' },
            { id: 2, name: 'bbb' },
            { id: 3, name: 'ccc' },
        ];

        this.onSelectType = this.onSelectType.bind(this);
        this.onCheckAll = this.onCheckAll.bind(this);
        this.onCheckStyle = this.onCheckStyle.bind(this);
        this.onCheckAll = this.onCheckAll.bind(this);
        this.onSelectStyle = this.onSelectStyle.bind(this);
        this.onSave = this.onSave.bind(this);

        this.onSelectMarker = this.onSelectMarker.bind(this);
        this.onFilterMarker = this.onFilterMarker.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onEnterInput = this.onEnterInput.bind(this);
        this.onSetRelation = this.onSetRelation.bind(this);

        console.log('ElementContent constructor');
    }

    checkAllStyle(theType, isChecked) {
        var elemStyleList = [];

        if (window.elementShow.theMap.elemStyleList == null) {
            return;
        }
        console.log(window.elementShow);

        for (var i = 0; i < window.elementShow.theMap.elemStyleList.length; i++) {
            if (window.elementShow.theMap.elemStyleList[i].elem_type == theType) {
                let theStyleItem = window.elementShow.theMap.elemStyleList[i];
                theStyleItem.isChecked = isChecked;
                elemStyleList.push(theStyleItem);
            }
        }

        this.setState({ elemStyleList: elemStyleList, allChecked: isChecked });
    }

    checkSingleStyle(id, isChecked) {
        let updateList = [];
        let { elemStyleList } = this.state;

        for (var i = 0; i < elemStyleList.length; i++) {
            let updateItem = elemStyleList[i];
            if (updateItem.id == id) {
                updateItem.isChecked = isChecked;
            }

            updateList.push(updateItem);
        }

        this.setState({ elemStyleList: updateList });
    }

    selectSingleStyle(id, isChecked) {
        let updateList = [];
        let { elemStyleList } = this.state;

        for (var i = 0; i < elemStyleList.length; i++) {
            let updateItem = elemStyleList[i];
            if (updateItem.id == id) {
                updateItem.isSelected = isChecked;
            } else {
                updateItem.isSelected = false;
            }

            updateList.push(updateItem);
        }

        this.setState({ elemStyleList: updateList });
    }

    selectType(theType) {
        let { currType,currStyle } = this.state;

        if(currStyle>0)
        {
            this.selectSingleStyle(currStyle, false);
            currStyle=-1;

        }

        window.elementShow.onShowShapeByType(currType, false);

        window.elementShow.onShowShapeByType(theType, true);

        this.setState({ currType: theType,currStyle:currStyle , allChecked: true });
    }

    showElemList() {
        var elemList = [];
        window.elementShow.theMap.getMarkerListByVisible(true, this.state.filter, elemList);
        elemList.forEach(item => {
            item.properties['isFlag'] = false;
            item.properties['isInput'] = true;
        });
        this.setState({ elemList: elemList });
    }

    onAddMarker(sender, marker) {
        let { elemList } = sender.state;

        elemList.push(marker);

        sender.setState({ elemList: elemList });

        console.log('onAddMarker');
    }
    onSaveMarker(sender,marker){

        let { elemList } = sender.state;

        let isFound=false;



        for(let i=0;i<elemList.length;i++)
        {
            if(elemList[i].properties.uuid==marker.properties.uuid)
            {
                isFound=true;

                if(elemList[i].properties.id!=marker.properties.id)
                {
                    elemList[i].properties.id=marker.properties.id;

                }

                break;
            }
        }

        if(!isFound)
        {
            elemList.push(marker);

        }


        sender.setState({ elemList: elemList });

        console.log('onSaveMarker');

    }

    onSelectType(theType) {

        this.selectType(theType);
        this.checkAllStyle(theType, true);
        this.showElemList();
        window.elementShow.setCurrType(theType);
    }

    onCheckAll(isChecked) {
        let { currType } = this.state;

        window.elementShow.onShowShapeByType(currType, isChecked);

        this.checkAllStyle(currType, isChecked);
        this.showElemList();
    }

    onCheckStyle(id, isChecked) {
        this.checkSingleStyle(id, isChecked);

        window.elementShow.onShowType(id, isChecked);

        this.showElemList();
    }

    onSelectStyle(id, isChecked) {
        console.log('选中')
        if(isChecked)
        {
            let { currStyle } = this.state;

            if(currStyle!=id)
            {
                currStyle=id;
            }
            this.setState({ currStyle:currStyle});

        }

        this.selectSingleStyle(id, isChecked);


        window.elementShow.onSelectStyle(id, isChecked, this);
    }

    onChangeName(isEdit) {
        if (window.elementShow.theMap.currMarker) {
            let currMarker = window.elementShow.theMap.currMarker;

            if (isEdit) {
                currMarker.properties.modify = 1;
                window.elementShow.theMap.saveMarker(currMarker);
            }
        }
    }

    onChangeThirdId(value) {
        if (window.elementShow.theMap.currMarker) {
            let currMarker = window.elementShow.theMap.currMarker;

            currMarker.properties.third_id = value;
            currMarker.properties.modify = 1;
            window.elementShow.theMap.saveMarker(currMarker);
        }
    }

    onSelectMarker(uuid) {

        var currMarker = window.elementShow.theMap.getMarkerByUuid(uuid);

        if (currMarker) {
            window.elementShow.theMap.moveToMarker(currMarker);

            let usageType=currMarker.properties.usage_type;
            let bindInfo=currMarker.properties;


            this.setState({ currMarker: currMarker, currUuid: uuid,bindInfo:bindInfo,usageType:usageType});

            window.elementShow.theMap.setSelectMode('singleSelect');
            window.elementShow.theMap.selectMarker(currMarker);

            window.elementShow.setThirdNameByType(usageType, bindInfo.id)

        }



    }

    onFilterMarker(filter) {
        var elemList = [];
        let filterSetting;

        let { thirdInfo } = this.state;




        if(thirdInfo.useThirdName>0)
        {
            filterSetting={type:"third_name",value: filter};

        }
        else
        {
            filterSetting={type:"name",value: filter};
        }
        this.setState({ filter: filterSetting});

        window.elementShow.theMap.getMarkerListByVisible(true, filterSetting, elemList);

        elemList.forEach(item => {
            item.properties['isFlag'] = false;
        });
        this.setState({ elemList: elemList });
    }

    onEnterInput(isInput) {
        this.setState({ isInput: isInput });
    }

    onLoadOver(sender) {
        let { currType } = sender.state;

        let mapName = window.elementShow.mapName;
        sender.setState({ mapName: mapName });

        sender.onSelectType(currType);



    }

    onSave() {
        window.elementShow.saveElement();
    }

    onResponseData(requestParams,respData)
    {

        if(respData.code==0 && respData.data.length>0)
        {
            for (var i = 0; i < respData.data.length; i++) {

                window.elementShow.addElement(respData.data[i]);
            }
        }

        requestParams.sender.showElemList();

    }

    onOpenStart(sender)
    {

    }



    onMounted() {
        console.log('ElementContent onMounted');

        store.subscribe(() => {
            this.setState(store.getState());
        });
        this.userToken = GetQtController().inParam.token;
        this.userId = GetQtController().inParam.userId;

        var editParam = {
            spitMap: false, //分屏地图
            markerPanel: 'desc_panel', //扩展属性编辑面板:div id
            thirdId: 'third_id_panel', //第三方id编辑面板:div id
            onAddMarker: this.onAddMarker, //增加marker事件回调
            onSaveMarker:this.onSaveMarker,   //更新marker事件回调
            onSearchThirdList:this.onSearchThirdList,
            onClearThirdId:this.onClearThirdId
        };



        var showDataParam={
            subscribe: {enable:false,
                pageSize:1000,
                //onData:onSubscribeData
            },
            apiRequest:{enable:true,
                pageSize:1000,
                onData:this.onResponseData}
        };


        var mapParam = {
            container: 'map',                  //地图容器
            centerServer: this.centerServer,    //访问地址 http://127.0.0.1:8100,http://121.15.156.34:10100
            realTimeServer: '',                 //实时数据服务器,ws://127.0.0.1:8101/ws,如设置该地址，则启动时尝试连接‘’‘’‘’‘’指定服务器
            userToken: this.userToken,          //用户令牌
            userId: this.userId,                //用户id和用户令牌同时提供则免登录
            //username: 'zhzx',                 //用户账号，用户登录令牌为空时启动登录校验
            //password: 'Aa!123456',            //密码
            projectName: this.projectName,      //项目名称
            mapEngine:'maptalks',               //地图引擎：maptalks,openlayers,leaflet
            planId: 'static',                   //固定值
            editMode: true,                     //是否是编辑模式
            editParam: editParam,               //编辑参数,当editMode=true时生效
            markerShowText: true,               //文字标签是否显示文字
            enableDoubleMap:false,              //是否采用双地图
            showData:showDataParam,             //上图数据参数
            showLayerMenu:true,                 //是否显示图层菜单
            onClickMap: this.onClickMap,        //单击地图回调
            onMarkerClick: this.onMarkerClick,  //单击标签回调
            onMarkerDblClick:this.onMarkerDblClick,
            onDragLabelEnd:this.onDragLabelEnd,
            onDragStart:this.onDragStart,
            onDragEnd:this.onDragEnd,
            onDeleteElement:this.onDeleteElement,
            onToolbarStatus:this.onToolbarStatus,
            onLayerClick:   this.onLayerClick,
            //'onFloorClick':this.onFloorClick,  //单击切换楼层
            //'onDemoToolbarClick':,             //是否支持显示测试工具栏
            //'onRealTimeData':this.onRealTimeData,  //获取实时数据回调,服务器地址由参数realTimeServer设置
            onInit: this.onInit, //初始化完毕后触发执行函数
            onLoadMap:this.onLoadMap,
            onLoadLayer:this.onLoadLayer
        };







        window.elementShow = new HCMapApi(this);
        window.elementShow.init(mapParam);
    }

    onPubSubMessage(strCode, data) {
        console.log(data,'--------------------------');
        if (strCode === 'elementContent') {
            console.log(data.thirdDataTotalNum)
            this.setState({
                thirdDataList: data.thirdDataList || [],
                detailId: data.id,
                usageType: data.type,
                thirdDataTotalNum: data.thirdDataTotalNum,
            });
        }
    }

    onInit(sender) {
        window.elementShow.loadMapList(0, sender.onGetMapList);
        window.elementShow.openMapById(window.elementShow.homeMapId, sender.onOpenStart,sender.onLoadOver);

        window.elementShow.setDefaultSelectStyle(2,{"lineColor":"#00ff00"})




    }

    onLoadMap(map){



        //window.elementShow.addLayer(11,true);
        // window.elementShow.addLayer(12);
        //window.elementShow.loadExtraLayer(false);


    }

    onLoadLayer()
    {
        window.elementShow.setLayerMenuPos(1240,95,70);
        let thirdInfo=window.elementShow.getThirdIdInfo();

        window.elementShow.parent.setState({thirdInfo: thirdInfo});
    }


    onGetMapList(sender, mapData) {
        mapData.forEach(item => {
            item['isSelected'] = false;
            item.children.forEach(vm => {
                vm['isSelected'] = false;
            });
        });
        sender.setState({
            mapList: mapData,
        });
    }


    onGenderChange(en) {
        //方案要素上图
        console.log(en, 'en');
    }

    //处理合并代码
    handleTogether() {

        let retInfo=window.elementShow.mergePolygon();
        if(retInfo.code!=0)
        {
            message.error(retInfo.msg);
            return;
        }
    }

    //处理标签点生成
    handleLabel() {}

    sendDatatoList(currPage, pageSize,dataList)
    {

        let caller=window.elementShow.parent;

        caller.setState({
            thirdDataPageNo: currPage,
            thirdDataPageSize: pageSize,
            thirdDataList:dataList.list,
            thirdDataTotalNum:dataList.count

        })


    }
    //处理第三方数据切换页面
    onChangePagenation(usageType, key, currPage, pageSize) {

        if(!usageType)
        {
            message.error('请先选中需要绑定的元素！');
            return;
        }


        let caller=window.elementShow.parent;
        window.elementShow.getThirdDataList(usageType, key, currPage, pageSize,caller.sendDatatoList)

    }

    onUpdataBindStatus(caller,bindType,theMarker,bindInfo)
    {
        caller.setState({isSearchShow:false});
        if (bindType==2) {  //解绑
            if(bindInfo.code==0)
            {
                elementShow.setThirdId(theMarker.properties.third_id);
                elementShow.setThirdName("");

                message.success('解绑成功');
            }

        } else {   //绑定
            if (bindInfo.code === 0)
            {

                elementShow.setThirdId(theMarker.properties.third_id);

                elementShow.setThirdNameByType(theMarker.properties.usage_type, theMarker.properties.id)

                message.success('绑定成功');
            } else {
                message.error(bindInfo.msg);
            }
        }
    }


    onClickToBindThirdId(bindType,bindInfo,bindItem)
    {
        let caller=window.elementShow.parent;

        window.elementShow.bindThirdId(bindType,bindInfo,bindItem,caller.onUpdataBindStatus,caller);

    }



    render() {
        let { toolBarList, showMap, mapList, mapName, currType } = this.state;
        let btn = toolBarList.map((item, index) => (
            <div key={'titleList' + index} onClick={this.onToolbarButtonClick.bind(this, item.id)}>
                <div
                    className="titleImg"
                    title={item.name}
                    style={{
                        background: item.isSelected
                            ? 'url(' +
                            require('@/assets/img/jingtai/' + item.btn_start + '.png') +
                            ')'
                            : 'url(' +
                            require('@/assets/img/jingtai/' + item.btn_nor + '.png') +
                            ')',
                    }}
                ></div>
            </div>
        ));

        return (
            <div className="jingtai 3D_ignore">
                <div className="jingtaiContnet">
                    <div className="jingtaiTitle">
                        <div
                            className="InputBox"
                            style={{ display: this.state.isDouble ? 'none' : 'flex' }}
                        >
                            <input
                                className="inputColro"
                                value={this.state.inputStep}
                                onChange={this.onInput.bind(this)}
                            />
                            ,
                            <div className="btn">
                                <span onClick={this.upBtn.bind(this)}></span>
                                <span onClick={this.belowBtn.bind(this)}></span>
                            </div>
                        </div>
                        <div
                            style={{
                                background: this.state.isDouble ? `url(${a2})` : `url(${a1})`,
                            }}
                            title="工具栏(双击/展开或合拢)"
                            onDoubleClick={this.onDoubleClose.bind(this)}
                            className="gjDouble"
                        ></div>
                        <div
                            className="jingtaiTitleBtn"
                            style={{ display: this.state.isDouble ? 'none' : 'flex' }}
                        >
                            {btn}
                        </div>
                        <div
                            className="boxIconImg"
                            style={{ display: this.state.isDouble ? 'none' : 'flex' }}
                        >
                            <div className="iconImg"></div>
                            <div className="selectup">
                                <div
                                    className="selectupTleti"
                                    onClick={this.onChangeMap.bind(this)}
                                >
                                    <span>{mapName}</span>
                                    <span className={showMap ? 'icox' : 'icos'}></span>
                                </div>
                                <div style={{ display: mapList.length ? 'block' : 'none' }}>
                                    <div
                                        className="selectupBox"
                                        style={{ display: showMap ? 'block' : 'none' }}
                                    >
                                        {mapList.map((item, index) => {
                                            return (
                                                <div key={'mapList' + index}>
                                                    <div
                                                        className="label"
                                                        onClick={this.onExpandMap.bind(
                                                            this,
                                                            item.id
                                                        )}
                                                    >
                                                        <span
                                                            className={item.isSelected ? 'icox' : 'icos'}
                                                        ></span>
                                                        <span>{item.name}</span>
                                                    </div>
                                                    <div
                                                        className="childrenBox"
                                                        style={{
                                                            display: item.isSelected ? 'block' : 'none',
                                                        }}
                                                    >
                                                        {item.children.map(vm => (
                                                            <div
                                                                className={`childrenList ${
                                                                    vm.isSelected ? 'bag' : ''
                                                                }`}
                                                                key={'children' + vm.id}
                                                                onClick={this.onExpandMap2.bind(
                                                                    this,
                                                                    vm
                                                                )}
                                                            >
                                                                <div>
                                                                    <span className="icon"></span>
                                                                    {vm.name}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div className="labelContent"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <ElementPage
                            allChecked={this.state.allChecked}
                            currType={this.state.currType}
                            elemStyleList={this.state.elemStyleList}
                            onSelectType={this.onSelectType}
                            onCheckAll={this.onCheckAll}
                            onCheckStyle={this.onCheckStyle}
                            onSelectStyle={this.onSelectStyle}
                        />
                    </div>
                    <div style={{ display: this.state.showMsgbox ? 'block' : 'none' }}>
                        <div className="mengban">
                            <div className="tanchuang">
                                <div className="title">
                                    <span>提示</span>
                                    <span onClick={this.onClose.bind(this)}></span>
                                </div>
                                <div className="valueText">{this.state.msgInfo}</div>
                                <div className="button">
                                    <span onClick={this.onConfirm.bind(this)}>确 定</span>
                                    <span onClick={this.onCancel.bind(this)}>取 消</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mapLeft" id="map"></div>
                    {currType === 3 && (
                        <span>
                            <div
                                className="css-together-btn"
                                onClick={this.handleTogether.bind(this)}
                            >
                                合并
                            </div>
                            {/*<div className="css-label-btn" onClick={this.handleLabel.bind(this)}>*/}
                            {/*    标签点生成*/}
                            {/*</div>*/}
                        </span>
                    )}
                </div>

                <div className="jingtaiRight_Content">
                    <div className="sut_x" onClick={this.onShut.bind(this)}></div>
                    <div
                        className="jingtaiRight common_animation_contnet"
                        style={{ display: this.state.isClosePanel ? 'none' : 'block' }}
                    >
                        <div className="pageRightContent">
                            <Maplocation
                                elemList={this.state.elemList}
                                thirdDataList={this.state.thirdDataList}
                                bindInfo={this.state.bindInfo}
                                usageType={this.state.usageType}
                                usageTypeName={this.state.usageTypeName}
                                totalNum={this.state.thirdDataTotalNum}
                                isSearchShow={this.state.isSearchShow}
                                onChangePagenation={this.onChangePagenation}
                                currMarker={this.state.currMarker}
                                currUuid={this.state.currUuid}
                                isInput={this.state.isInput}
                                thirdInfo={this.state.thirdInfo}
                                onSelectMarker={this.onSelectMarker}
                                onFilter={this.onFilterMarker}
                                onChangeName={this.onChangeName}
                                onSave={this.onSave}
                                onEnterInput={this.onEnterInput}
                                onSetRelation={this.onSetRelation}
                                onClickToBindThirdId={this.onClickToBindThirdId}
                                monitorMap={this.state.mapList}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    onShut() {
        this.setState({
            isClosePanel: !this.state.isClosePanel,
        });
    }
    onClickMap(param) {
        window.elementShow.onClickMap(param);
    }

    onLayerClick(params)
    {
        window.elementShow.onLayerClick(params);

    }

    onMarkerClick() {
        window.elementShow.onMarkerClick(this);


        if(window.elementShow.theMap.currMarker!=null)
        {
            let currMarker=window.elementShow.theMap.currMarker;

            let usageType=currMarker.properties.usage_type;


            let bindInfo=currMarker.properties;

            let uuid=currMarker.properties.uuid;

            let caller=window.elementShow.parent;
            if(caller)
            {
                caller.setState({currMarker: currMarker,bindInfo:bindInfo,currUuid: uuid,usageType:usageType});
                let {elemList} = caller.state
                let dom = null;
                elemList.forEach((item,index)=>{
                    if(item.properties.uuid === uuid){
                        dom = document.getElementById('addList' + index)
                    }
                })
                let dom2 = document.querySelector('.tabFormContent')
                dom2.scrollTo({
                    left:0,
                    top:dom.offsetTop>270 ? dom.offsetTop - 270 : 0,
                    behavior:'smooth'
                })
            }



            window.elementShow.setThirdNameByType(usageType, bindInfo.id)


        }

    }

    onSearchThirdList(){

        let caller=window.elementShow.parent;

        let { isSearchShow } = caller.state;

        if(isSearchShow)
        {
            caller.setState({isSearchShow:false});
            return;
        }
        else
        {

            if(window.elementShow.theMap.currMarker!=null)
            {
                let usageType=window.elementShow.theMap.currMarker.properties.usage_type;
                caller.onChangePagenation(usageType, "", 1, 10);
            }
            caller.setState({isSearchShow:true});
        }

    }

    onClearThirdId()
    {
        let caller=window.elementShow.parent;

        let currMarker=window.elementShow.theMap.currMarker;

        if(currMarker!=null)
        {
            let bindType=2;
            let bindInfo=currMarker.properties;

            window.elementShow.bindThirdId(bindType,bindInfo,currMarker.properties,caller.onUpdataBindStatus,caller);
        }

    }


    onMarkerDblClick() {
        window.elementShow.theMap.onMarkerDblClick(this);
    }


    onDragLabelEnd(params) {
        window.elementShow.theMap.onDragLabelEnd(params);
    }

    onDragStart(params){
        // window.areaPreview.dragStart(params);
    }

    onDragEnd(params){

        // params.target.properties.label_lnglat=null;
        params.target.properties.modify=1;
        params.target.properties.label_lnglat=null;

        window.elementShow.syncLabelMarker();


    }


    onDeleteElement(sender){


        var elemList = [];
        let { filter } = sender.state;

        window.elementShow.theMap.getMarkerListByVisible(true, filter, elemList);

        elemList.forEach(item => {
            item.properties['isFlag'] = false;
        });
        sender.setState({ elemList: elemList });


    }


    onToolbarStatus(currItem,sender){

        let { toolBarList,currStyle } = sender.state;

        if(currStyle>0)
        {
            sender.selectSingleStyle(currStyle, false);
        }

        toolBarList.forEach((item) => {
            if (item.id == currItem.id) {
                if (item.isSelected) {
                    item.isSelected = false;
                } else {
                    item.isSelected = true;
                }
            }
        });

        sender.setState({ toolBarList });




    }
    onSetRelation(mapInfo) {
        if (mapInfo == null) {
            message.warning('请先选择地图!');
            return;
        }
        if (window.elementShow.theMap.selectList.length < 1) {
            message.warning('请选择需要关联的元素!');
            return;
        }

        var selectCount = window.elementShow.theMap.selectList.length;
        window.elementShow.setSelectionToMap(mapInfo.id);
        this.onRefresh();

        message.success(selectCount + '个元素关联到地图:' + mapInfo.name);
    }

    onSelectMap(mapId) {
        this.changeMapId = mapId;

        this.setState({
            showMsgbox: true,

            msgType: 'selectMap',
            msgInfo: '确认要更换地图吗?',
        });
    }
    onChangeMap() {
        //地图
        let { showMap } = this.state;

        showMap = !showMap;
        this.setState({
            showMap: showMap,
        });
    }
    onExpandMap(id) {
        //地图父级元素
        let { mapList } = this.state;
        mapList.forEach(item => {
            if (item.id == id) {
                item.isSelected = !item.isSelected;

                if ((item.pid != 0 && item.indoor != 0) || (item.pid == 0 && item.indoor == 0)) {
                    this.onSelectMap(id);
                    this.onChangeMap();
                }
                if (!item.isSelected) {
                    item.children.forEach(vm => {
                        vm.isSelected = false;
                    });
                }
            }
        });
        this.setState({
            mapList: mapList,
        });
    }
    onExpandMap2(vm) {
        //地图子级元素
        let { mapList } = this.state;
        mapList.forEach(item => {
            item.children.forEach(cut => {
                if (vm.id == cut.id) {
                    cut.isSelected = !cut.isSelected;

                    if ((vm.pid != 0 && vm.indoor != 0) || (vm.pid == 0 && vm.indoor == 0)) {
                        this.onSelectMap(vm.id);
                        this.onChangeMap();
                    }
                } else {
                    cut.isSelected = false;
                }
            });
        });

        this.setState({
            mapList: mapList,
        });
    }
    onClose() {
        //关闭提示按钮
        this.setState({
            showMsgbox: false,
        });
    }
    onConfirm() {
        //提示 确定
        this.setState({
            showMsgbox: false,
        });

        switch (this.state.msgType) {
            case 'deleteElem':
                window.elementShow.onEditToolbarClick(0, 'delete', this.lastToolButton, this);
                break;
            case 'selectMap':
                window.elementShow.openMapById(this.changeMapId, this.onOpenStart, this.onLoadOver);

                let { toolBarList } = this.state;
                toolBarList.forEach(item => {
                    item.isSelected = false;
                });
                this.setState({ toolBarList });

                break;
        }
    }
    onCancel() {
        //提示 取消
        this.setState({
            showMsgbox: false,
        });
    }

    onInput(e) {
        //input 事件
        this.setState({
            inputStep: e.target.value,
        });

        window.elementShow.theMap.setMoveStep(e.target.value);

        console.log(e.target.value);
    }
    upBtn() {
        let inputStep = this.state.inputStep;
        inputStep = inputStep + 1;

        window.elementShow.theMap.setMoveStep(inputStep);

        this.setState({
            inputStep: inputStep,
        });
    }
    belowBtn() {
        let inputStep = this.state.inputStep;
        if (inputStep == 0) return;
        inputStep = inputStep - 1;
        window.elementShow.theMap.setMoveStep(inputStep);
        console.log(inputStep, 'inputStep');
        this.setState({
            inputStep: inputStep,
        });
    }
    onDoubleClose() {
        this.setState({
            isDouble: !this.state.isDouble,
        });
    }
    onToolbarButtonClick(idx) {
        //顶部按钮
        let { toolBarList } = this.state;
        let currItem = null;

        for (var i = 0; i < toolBarList.length; i++) {
            if (toolBarList[i].id == idx) {
                currItem = toolBarList[i];
                break;
            }
        }
        if (currItem == null) {
            return;
        }

        switch (currItem.name) {
            case '保存所有':
                window.elementShow.onEditToolbarClick(0, 'save', currItem, this);
                break;
            case '单选':
                window.elementShow.onEditToolbarClick(1, 'singleSelect', currItem, this);
                break;
            case '多选':
                window.elementShow.onEditToolbarClick(1, 'multiSelect', currItem, this);
                break;
            case '框选':
                window.elementShow.onEditToolbarClick(1, 'rectSelect', currItem, this);
                break;
            case '多边形选择':
                window.elementShow.onEditToolbarClick(1, 'polygonSelect', currItem, this);
                break;
            case '置顶':
                window.elementShow.onEditToolbarClick(0, 'toTop', currItem, this);
                break;
            case '置底':
                window.elementShow.onEditToolbarClick(0, 'toBack', currItem, this);
                break;
            case '上移一层':
                window.elementShow.onEditToolbarClick(0, 'toTopOne', currItem, this);
                break;
            case '下移一层':
                window.elementShow.onEditToolbarClick(0, 'toBackOne', currItem, this);
                break;
            case '向上':
                window.elementShow.onEditToolbarClick(0, 'toUp', currItem, this);
                break;
            case '向下':
                window.elementShow.onEditToolbarClick(0, 'toDown', currItem, this);
                break;
            case '向右':
                window.elementShow.onEditToolbarClick(0, 'toRight', currItem, this);
                break;
            case '向左':
                window.elementShow.onEditToolbarClick(0, 'toLeft', currItem, this);
                break;
            case '删除':
                this.lastToolButton = currItem;
                this.setState({
                    showMsgbox: true,
                    msgType: 'deleteElem',
                    msgInfo: '确认要删除选中项吗?',
                });
                break;
            case '分屏':
                window.elementShow.onEditToolbarClick(2, 'split', currItem, this);

                break;
        }
    }
}

