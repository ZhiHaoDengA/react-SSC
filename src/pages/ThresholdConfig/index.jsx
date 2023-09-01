import './index.less';
import { Button, Form, Input, message, Modal, InputNumber, Space, Table,  } from 'antd';
import React from 'react';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import axios from 'axios';

import {CaretUpOutlined ,CaretDownOutlined} from '@ant-design/icons';
export default class ThresholdConfig extends React.Component {
    villageFormRef = React.createRef();
    statusFormRef = React.createRef();
    editFormRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            isSelfShow: false,
            isModalOpen: false,//弹窗
            isModalOpenOUt: 0,

            dataSource: [],
            seName: '',//小区名
            areaName: '',//行政区域
            defaultValueNumber: 0,//初始值
            seId: 0,
            moveOutValue: 0,//
            columns: [
                {
                    title: '序号',
                    dataIndex: 'se_id',
                    key: 'se_id',
                },
                {
                    title: '居住区块',
                    dataIndex: 'se_name',
                    key: 'se_name',
                    width: '300',
                },
                {
                    title: '行政区划',
                    dataIndex: 'area_name',
                    key: 'area_name',
                },
                {
                    title: '迁入预警阀值',
                    dataIndex: 'move_in_value',
                    key: 'move_in_value',
                },
                {
                    title: '迁出预警阀值',
                    dataIndex: 'move_out_value',
                    key: 'move_out_value',
                },
            ],
            chooseList: [], //勾选的数据列表
            chooseIds: [], //被勾选中的id
            searchParams: {
                name: '',
                eqName: '',
                status: null,
            },
            currentPage: 1,
            currentPageSize: 10,
            totalNumber: 0,
            communityList: [],
            modalData: {},
            defaultValueArr:0,//阀值默认
        };
    };
    //
    // onMounted() {
    //     this.getSmartEstateMoveInOutConfig();
    // }

    //获取居住区块迁入迁出预警配置

    getSmartEstateMoveInOutConfig() {
        const {
            currentPage, currentPageSize, seName,
            areaName,
        } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` + `/api/lh/getSmartEstateMoveInOutConfig?current=${currentPage}&page_size=${currentPageSize}&se_name=${seName}&area_name=${areaName}`)
            .then(res => {
                if (res.data.code == 0) {
                    this.setState({
                        dataSource: res.data.data,
                        totalNumber: res.data.count,
                    });
                }
            });
    }

    saveSmartEstateMoveInOutConfig() {
        const { defaultValueNumber, seName, seId, moveOutValue,isModalOpenOUt ,defaultValueArr} = this.state;
        if(isModalOpenOUt ==1){
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + `/api/lh/saveSmartEstateMoveInOutConfig?se_id=${seId}&move_in_value=${defaultValueArr}`)
                .then(res => {
                    this.getSmartEstateMoveInOutConfig();
                });
        }else{
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + `/api/lh/saveSmartEstateMoveInOutConfig?se_id=${seId}&move_out_value=${defaultValueArr}`)
                .then(res => {
                    this.getSmartEstateMoveInOutConfig();
                });
        }



    }

    render() {
        let {
            columns,
            searchParams,
            currentPage,
            currentPageSize,
            totalNumber,
            dataSource,
            seName,
            areaName,
            isModalOpen,
            chooseIds,
            chooseList,
            defaultValueNumber,
            moveOutValue,
            isModalOpenOUt,
            defaultValueArr,
            seId,
        } = this.state;
        return (
            <div className="css-threshold-config">
                <div className="css-header">
                    <div className="css-secound">
                        <Button
                            disabled={chooseList.length === 0}
                            onClick={this.onModificationImmigration.bind(this, 1)}
                            className="css-link-btn"
                        >
                            修改迁入预预警阀值

                        </Button>
                        <Button
                            disabled={chooseList.length === 0}
                            onClick={this.onModificationImmigration.bind(this, 2)}
                            className="css-link-btn"
                        >
                            修改迁出预警阀值
                        </Button>

                    </div>
                    <div className="css-first">
                        <div className="css-formItem">
                            <div className="css-label">小区名称</div>
                            <Input
                                onChange={value => {
                                    this.handleChangeEqName(value);
                                }}
                                value={seName}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">行政区域</div>
                            <Input
                                onChange={value => {
                                    this.handleChangeName(value);
                                }}
                                value={areaName}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <Button
                            onClick={this.handleSearch.bind(this)}
                            className="css-search-btn"

                        >
                            搜索
                        </Button>
                        <Button
                            onClick={this.handleReset.bind(this)}
                            className="css-reset-btn"

                        >
                            重置
                        </Button>
                    </div>

                </div>
                <div className="css-content">
                    <Table
                        scroll={{ y: 582 }}
                        dataSource={dataSource}
                        columns={columns}
                        rowKey={record => record.se_id}
                        pagination={{
                            position: ['bottomRight'],
                            showQuickJumper: true,
                            showSizeChanger: true,
                            current: Number(currentPage),
                            pageSize: Number(currentPageSize),
                            total: totalNumber,
                            showTotal: function(total) {
                                return `共${totalNumber}条`;
                            },
                            onChange: (currentPage, currentPageSize) => {
                                this.handlePageChange(currentPage, currentPageSize);
                            },
                        }}

                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {

                                this.setState({
                                    chooseList: selectedRowKeys,
                                    chooseIds: selectedRows,
                                    // defaultValueNumber: selectedRows[0].move_in_value || 0,
                                    // seId: selectedRows[0].se_id,
                                    // moveOutValue: selectedRows[0].move_out_value || 0,
                                });
                            },
                        }}
                        // rowSelection={{
                        //     type: 'checkbox',
                        //
                        // }}
                    />
                </div>
                <div></div>
                <Modal
                    title="修改阀值"
                    // style={{height:"500px"}}
                    visible={isModalOpen}
                    className="css-yishiqianruyujingfuzhi-modal"
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                >
                    {/*<div className="css-yishiqianruyujingfuzhi-title">修改阀值</div>*/}
                    <div className="css-yishiqianruyujingfuzhi">{isModalOpenOUt == 1 ? '疑似迁入预警阀值' : '疑似迁出预警阀值'}</div>
                    {/*<InputNumber min={-10000000000} max={10000000}*/}
                    {/*             defaultValue={`${isModalOpenOUt}`==1?`${defaultValueNumber}`:`${moveOutValue}`}*/}
                    {/*             defaultValue={defaultValueArr}*/}
                    {/*             controls={true}*/}
                    {/*             value={`${isModalOpenOUt}` == 1 ? `${defaultValueNumber}` : `${moveOutValue}`}*/}
                    {/*             onChange={this.onChangeInputNumber.bind(this)}/>*/}
                    <div className="css-inputButton">
                        <Input
                            // value={`${isModalOpenOUt}` == 1 ? `${defaultValueNumber}` : `${moveOutValue}`}
                            value={defaultValueArr}
                            onChange={this.onChangeInput.bind(this)}
                        />
                        <CaretUpOutlined  className="css-inputButton1" onClick={this.onClickUp.bind(this)} />
                        <CaretDownOutlined className="css-inputButton2" onClick={this.onClickOut.bind(this)} />
                        {/*<div className="css-inputButton1" onClick={this.onClickUp.bind(this)}><CaretUpOutlined  className="css-inputButton1" onClick={this.onClickUp.bind(this)} /></div>*/}
                        {/*<div className="css-inputButton2" onClick={this.onClickOut.bind(this)}><CaretDownOutlined /></div>*/}

                    </div>


                    <div
                        className="css-qianruzhushi">{isModalOpenOUt == 1 ? '注：当居住区块内感知到的人员积分>预警阈值时，进行预警' : '注：当居住区块内感知到的人员积分＜预警阈值时，进行预警'}</div>
                </Modal>
                {/*<Modal*/}
                {/*    title="修改阀值"*/}
                {/*    // style={{height:"500px"}}*/}
                {/*    visible={isModalOpenOUt}*/}
                {/*    className="css-yishiqianruyujingfuzhi-modal"*/}
                {/*    onOk={this.handleOk.bind(this)}*/}
                {/*    onCancel={this.handleCancel.bind(this)}*/}
                {/*>*/}
                {/*    /!*<div className="css-yishiqianruyujingfuzhi-title">修改阀值</div>*!/*/}
                {/*    <div className="css-yishiqianruyujingfuzhi">疑似迁出预警阀值</div>*/}
                {/*    <InputNumber min={1} max={10000000} defaultValue={moveOutValue}*/}
                {/*                 onChange={this.onChange.bind(this)}/>*/}
                {/*    <div className="css-qianruzhushi">注：当居住区块内感知到的人员积分＜预警阈值时，进行预警</div>*/}
                {/*</Modal>*/}
            </div>
        );

    }

    handlePageChange(currentPage, currentPageSize) {
        this.setState(
            {
                currentPage,
                currentPageSize,
            },
            () => {
                this.getSmartEstateMoveInOutConfig();
            },
        );
    }

    //行政区域
    handleChangeName(e) {

        this.setState({
            areaName: e.target.value,
        });
    }

    //小区名称
    handleChangeEqName(e) {
        this.setState({
            seName: e.target.value,
        });

    }

//    搜索
    handleSearch() {
        this.getSmartEstateMoveInOutConfig();
    }

//    重置
    handleReset() {
        this.setState({
            seName: '',
            areaName: '',
        }, () => {
            this.getSmartEstateMoveInOutConfig();
        });

    }

//    修改迁入阀值

    onModificationImmigration(value) {
        const { chooseList, defaultValueNumber, seId, chooseIds ,isModalOpenOUt,defaultValueArr} = this.state;
        let number = chooseIds[0].move_in_value;
        let outId = chooseIds[0].move_out_value;
        let id = chooseList.join(',');
        if(value ==1 ){
            this.setState({
                defaultValueArr:number
            })

        }else{
            this.setState({
                defaultValueArr:outId
            })

        }

        this.setState({
            isModalOpen: true,
            isModalOpenOUt: value,
            seId: id,

        },()=>{
            if (isModalOpenOUt == 1) {
                this.setState({
                    defaultValueNumber: number,
                });
            } else {
                this.setState({
                    moveOutValue: outId,
                });
            }
        });

    }

    onChangeInputNumber(value) {

        const { isModalOpenOUt } = this.state;
        if (isModalOpenOUt == 1) {
            this.setState({
                defaultValueNumber: value,
            });

        } else {
            this.setState({
                moveOutValue: value,
            });
        }


    }

    /*确定*/
    handleOk() {
        const { defaultValueNumber,isModalOpenOUt ,moveOutValue,defaultValueArr} = this.state;
        let inputNumber =defaultValueArr
        if(isModalOpenOUt==1){
            this.setState({
                defaultValueNumber:inputNumber,
                currentPage:1,
            },()=>{
                this.saveSmartEstateMoveInOutConfig();
                // this.getSmartEstateMoveInOutConfig();
            })

        }else{
            this.setState({
                moveOutValue:inputNumber,
                currentPage:1,
            },()=>{
                this.saveSmartEstateMoveInOutConfig();
                // this.getSmartEstateMoveInOutConfig();
            })
        }
        this.setState({
            isModalOpen: false,

        });

    }

    //取消
    handleCancel() {
        this.setState({
            isModalOpen: false,
        });
    }
    onClickUp(){

        const {isModalOpenOUt,defaultValueNumber,moveOutValue,defaultValueArr}=this.state
        let number = defaultValueArr +1
        this.setState({
            defaultValueArr:number
        })

    }
    onClickOut(){
        const {isModalOpenOUt,defaultValueNumber,moveOutValue,defaultValueArr}=this.state
        let number = defaultValueArr -1
        this.setState({
            defaultValueArr:number
        })
    }
    onChangeInput(e){
        this.setState({
            defaultValueArr:e.target.value
        })

    }

}