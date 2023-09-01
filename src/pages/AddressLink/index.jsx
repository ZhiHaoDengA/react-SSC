import React from 'react';
import './index.less';
import axios from 'axios';
// import store from '@/store';
import { Select, Input, Button, Table, Space, Modal, Form, Radio, message, Switch } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

class AddressLink extends React.Component {
    addFormRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            isClassify: true, //判断 方案要素文本框 显示隐藏
            data: [
                {
                    name: '123',
                    address: 0,
                    area: '5555',
                    key: 0,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
                {
                    name: '123',
                    address: 1,
                    area: '5555',
                    key: 1,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
            ],
            columns: [
                {
                    title: '楼栋地址',
                    dataIndex: 'address',
                    key: 'address',
                },
                {
                    title: '关联智安小区名称',
                    dataIndex: 'estate_name',
                    key: 'estate_name',
                },
                {
                    title: '市县区',
                    dataIndex: 'city',
                    key: 'city',
                },
                {
                    title: '街道',
                    dataIndex: 'street',
                    key: 'street',
                },
                {
                    title: '村居社区',
                    dataIndex: 'area',
                    key: 'area',
                },
                {
                    title:'区域绑定自动计算',
                    dataIndex: 'auto',
                    key:'auto',
                    render:(_,record)=>{
                        return(
                            <Switch checkedChildren='开' unCheckedChildren='关' defaultChecked={record.auto == 1} onChange={this.changeSwitchStatus.bind(this,record)}></Switch>
                        )
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    render: (_, record) => (
                        <Space size="middle">
                            <a className="css-set-btn" onClick={this.handleEdit.bind(this, record)}>
                                编辑
                            </a>
                            <a className="css-red" onClick={()=>{
                                axios.post(GetQtController().inParam.dataUrl + `/api/lh/estate/delSmartEstateBuilding`,{
                                    data:[record.id]
                                }).then(res=>{
                                    message.success('清除成功')
                                    this.getDataList()
                                })
                            }}>
                                清除关联
                            </a>
                            {/*<a className='css-delete-btn' onClick={this.handleDelete.bind(this,record)}>删除</a>*/}
                        </Space>
                    ),
                },
            ],
            searchParams: {
                areaName: '', //行政区域
                status: '0', //关联状态
                address: '', //标准地址
                name: '', //居住区块
            },
            isAddModalShow: false,
            modalData: {},
            currentPage: 1,
            currentPageSize: 10,
            chooseList: [],
            totalNumber: 0,
            communityList: [],
        };
    }
    /**
     *
     * 修改的地方,获取关联居住区块列表
     */
    getZACommunity() {
        axios
            .get(`${GetQtController().inParam.dataUrl}` + '/api/lh/estate/getSmartEstateData?page_size=2000')
            .then(res => {
                if (res.data.code == 0) {
                    console.log(res.data.data);
                    this.setState({
                        communityList: res.data.data,
                    });
                }
            });
    }

    changeSwitchStatus(obj){
        console.log(obj)
        axios.get(GetQtController().inParam.dataUrl + `/api/lh/estate/setSmartEstateAutoStatus?auto_id=${obj.id}&auto_type=2&status=${obj.auto}`).then(res=>{
            if(res.data.code === 0){
                message.success('修改成功')
                this.getDataList()
            }
        })
    }

    handleSet(value) {
        console.log(value);
    }

    handleDelete(value) {
        console.log(value);
    }

    onMounted() {
        store.subscribe(() => {
            this.setState(store.getState());
        });
        this.getZACommunity();
    }

    onEnter() {
        this.getDataList();
    }

    handleChangeStatus(value) {
        let { searchParams } = this.state;
        this.setState({
            searchParams: {
                ...searchParams,
                status: value,
            },
        });
    }

    handleChangeArea(e) {
        let { searchParams } = this.state;
        this.setState({
            searchParams: {
                ...searchParams,
                areaName: e.target.value,
            },
        });
    }

    handleChangeAddress(e) {
        let { searchParams } = this.state;
        this.setState({
            searchParams: {
                ...searchParams,
                address: e.target.value,
            },
        });
    }

    handleChangeName(e) {
        let { searchParams } = this.state;
        this.setState({
            searchParams: {
                ...searchParams,
                name: e.target.value,
            },
        });
    }

    handleSearch() {
        this.getDataList();
    }

    handleReset() {
        this.setState(
            {
                searchParams: {
                    areaName: '', //行政区域
                    status: '0', //关联状态
                    address: '', //标准地址
                    name: '', //居住区块
                },
                currentPage: 1,
                currentPageSize: 50,
            },
            () => {
                this.getDataList();
            }
        );
    }
    f;

    handleEdit(value) {
        console.log(this.state.communityList);
        this.setState(
            {
                modalData: value,
                isAddModalShow: true,
            },
            () => {
                this.addFormRef.current.setFieldsValue({
                    address: value.address,
                    area: value.estate_id,
                });
            }
        );
    }

    handlePageChange(currentPage, currentPageSize) {
        this.setState(
            {
                currentPageSize,
                currentPage,
            },
            () => {
                this.getDataList();
            }
        );
    }

    handleAddData() {
        let { modalData, chooseList } = this.state;
        console.log(modalData);
        this.addFormRef.current.validateFields().then(res => {
            if (modalData.id) {
                //编辑
                axios
                    .post(
                        `${GetQtController().inParam.dataUrl}` +
                        '/api/lh/estate/bindSmartEstateBuilding',
                        {
                            data: [
                                {
                                    id: Number(modalData.id ? modalData.id : 0),
                                    estate_id: this.addFormRef.current.getFieldsValue().area || 0,
                                    building_id: modalData.id,
                                },
                            ],
                        }
                    )
                    .then(res => {
                        if (res.data.code == 0) {
                            message.success('修改成功');
                            this.setState({
                                isAddModalShow: false,
                                modalData: {},
                            });
                            this.getDataList();
                        }
                    });
            } else {
                //创建
                axios
                    .post(
                        `${GetQtController().inParam.dataUrl}` +
                        '/api/lh/estate/bindSmartEstateBuilding',
                        {
                            data: chooseList.map(item => {
                                return {
                                    id: 0,
                                    estate_id: this.addFormRef.current.getFieldsValue().area,
                                    building_id: item.id,
                                };
                            }),
                        }
                    )
                    .then(res => {
                        if (res.data.code == 0) {
                            message.success('关联成功');
                            this.setState({
                                isAddModalShow: false,
                            });
                            this.getDataList();
                        }
                    });
            }
            this.addFormRef.current.resetFields();
        });
    }

    openAddModal() {
        this.setState({
            isAddModalShow: true,
        });
    }

    closeAddModal() {
        this.setState({
            isAddModalShow: false,
            modalData: {},
        });
        this.addFormRef.current.resetFields();
    }

    getDataList() {
        let { searchParams, currentPage, currentPageSize } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/estate/getSmartEstateBuildingData?bind_status=${searchParams.status}&region=${searchParams.areaName}&address=${searchParams.address}&estate_name=${searchParams.name}&current=${currentPage}&page_size=${currentPageSize}`
            )
            .then(res => {
                this.setState({
                    data: res.data.data,
                    totalNumber: res.data.count,
                });
            });
    }

    deleteAdd(){
        let {chooseList} = this.state

        Modal.confirm({
            width:400,
            className:'css-delete-modal',
            title:'批量删除',
            icon:'',
            closable:true,
            content:(
                <div>
                    是否清除选中数据关联?
                </div>
            ),
            okText:'确认清除',
            onOk:()=>{
                axios.post(GetQtController().inParam.dataUrl + `/api/lh/estate/delSmartEstateBuilding`,{
                    data:chooseList.map(item=>item.id)
                }).then(res=>{
                    message.success('清除成功')
                    this.getDataList()
                })
            },
            onCancel:()=>{

            }
        })
    }

    render() {
        let {
            data,
            columns,
            isAddModalShow,
            modalData,
            chooseList,
            searchParams,
            currentPage,
            currentPageSize,
            totalNumber,
        } = this.state;
        return (
            // style={{ display: this.state.isSelfShow ? "block" : "none" }}
            <div className="css-address-link">
                <div className="css-header">
                    <div className="css-first">
                        <div className="css-formItem">
                            <div className="css-label">行政区域</div>
                            <Input
                                value={searchParams.areaName}
                                onChange={value => {
                                    this.handleChangeArea(value);
                                }}
                                placeholder={'请输入行政区域'}
                                className="css-input"
                            />
                            {/*<Input placeholder={'请选择行政区划'} className='css-input'></Input>*/}
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">关联状态</div>
                            <Select
                                value={searchParams.status}
                                onChange={value => {
                                    this.handleChangeStatus(value);
                                }}
                                placeholder={'请选择'}
                                options={[
                                    {
                                        value: '0',
                                        label: '全部',
                                    },
                                    {
                                        value: '1',
                                        label: '已关联',
                                    },
                                    {
                                        value: '2',
                                        label: '未关联',
                                    },
                                ]}
                                className="css-input"
                                style={{ width: '100px' }}
                            />
                            {/*<Input placeholder={'请选择行政区划'} className='css-input'></Input>*/}
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">标准地址</div>
                            <Input
                                value={searchParams.address}
                                onChange={value => {
                                    this.handleChangeAddress(value);
                                }}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">居住区块</div>
                            <Input
                                value={searchParams.name}
                                onChange={value => {
                                    this.handleChangeName(value);
                                }}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <Button
                            onClick={this.handleSearch.bind(this)}
                            className="css-search-btn"
                            icon={<SearchOutlined />}
                        >
                            搜索
                        </Button>
                        <Button
                            onClick={this.handleReset.bind(this)}
                            className="css-reset-btn"
                            icon={<UndoOutlined />}
                        >
                            重置
                        </Button>
                    </div>
                    <div style={{display:'flex',marginTop:'20px'}}>
                        <Button
                            type='primary'
                            style={{marginRight:'16px'}}
                            disabled={chooseList.length <= 0}
                            onClick={this.openAddModal.bind(this)}
                        >
                            批量关联智安小区
                        </Button>
                        <Button
                            type='primary'
                            danger
                            disabled={chooseList.length <= 0}
                            onClick={this.deleteAdd.bind(this)}
                        >
                            批量清除关联
                        </Button>
                    </div>
                </div>
                <div className="css-content">
                    <Table
                        scroll={{ y: 582 }}
                        dataSource={data}
                        columns={columns}
                        pagination={{
                            position: ['bottomRight'],
                            showQuickJumper: true,
                            showSizeChanger: true,
                            current: Number(currentPage),
                            pageSize: Number(currentPageSize),
                            total: totalNumber,
                            showTotal: function (total) {
                                return `共${totalNumber}条`;
                            },
                            onChange: (currentPage, currentPageSize) => {
                                this.handlePageChange(currentPage, currentPageSize);
                            },
                        }}
                        rowKey={record => record.id}
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log(selectedRowKeys, selectedRows);
                                this.setState({
                                    chooseList: selectedRows,
                                });
                            },
                        }}
                    />
                </div>
                <Modal
                    title={modalData.address ? '编辑' : '关联居住区块'}
                    visible={isAddModalShow}
                    onOk={this.handleAddData.bind(this)}
                    onCancel={this.closeAddModal.bind(this)}
                >
                    <Form
                        ref={this.addFormRef}
                        name={'addForm'}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >
                        {modalData.address && (
                            <Form.Item
                                label={'地址'}
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入地址',
                                    },
                                ]}
                            >
                                <Input disabled placeholder={'请输入地址'} />
                            </Form.Item>
                        )}
                        <Form.Item label={'居住区块'} name="area">
                            <Select
                                optionFilterProp="label"
                                allowClear
                                showSearch
                                placeholder={'请选择居住区块'}
                                options={this.state.communityList.map(item => {
                                    return {
                                        label: item.name,
                                        value: item.id,
                                    };
                                })}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
export default AddressLink;
