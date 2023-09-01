import React from 'react';
import './index.less';
import axios from 'axios';
// import store from '@/store';
import { Button, Form, Input, message, Modal, Radio, Select, Space, Switch, Table, Tag } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
export default class DeviceLink extends React.Component {
    villageFormRef = React.createRef();
    statusFormRef = React.createRef();
    editFormRef = React.createRef();
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
                    title: '设备ID',
                    dataIndex: 'camera_id',
                    key: 'camera_id',
                },
                {
                    title: '设备名称',
                    dataIndex: 'name',
                    key: 'name',
                    width: '300',
                },
                {
                    title: '关联居住区块名称',
                    dataIndex: 'estate_name',
                    key: 'estate_name',
                },
                {
                    title: '所属街道',
                    dataIndex: 'street_name',
                    key: 'street_name',
                },
                {
                    title: '进出标识',
                    dataIndex: 'icon',
                    key: 'icon',
                    render: (_, record) => {
                        if (record.is_in === 1) {
                            return <Tag color={'success'}>进区</Tag>;
                        } else if (record.is_in === 2) {
                            return <Tag color={'warning'}>出区</Tag>;
                        } else {
                            return <Tag color={'warning'}>未知</Tag>;
                        }
                    },
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
                            <a
                                className="css-set-btn"
                                onClick={this.openEditModal.bind(this, record)}
                            >
                                编辑
                            </a>

                            <a className='css-delete-btn' onClick={()=>{
                                axios.post(GetQtController().inParam.dataUrl + `/api/lh/estate/delSmartEstateDevice`,{
                                    data:[record.camera_id]
                                }).then(res=>{
                                    message.success('清除成功')
                                    this.getDataList()
                                })
                            }}>清除关联</a>
                        </Space>
                    ),
                },
            ],
            searchParams: {
                name: '',
                eqName: '',
                streetName:'',
                status: null,
            },
            currentPage: 1,
            currentPageSize: 10,
            totalNumber: 0,
            isVillageModalShow: false,
            isStatusModalShow: false,
            isEditModalShow: false,
            chooseList: [],
            communityList: [],
            modalData: {},
            selectedRowKeys:[]
        };
    }

    // onMounted() {
    //     store.subscribe(() => {
    //         this.setState(store.getState());
    //     });
    //     this.getZACommunity();
    // }

    changeSwitchStatus(obj){
        console.log(obj)
        axios.get(GetQtController().inParam.dataUrl + `/api/lh/estate/setSmartEstateAutoStatus?auto_id=${obj.camera_id}&auto_type=1&status=${obj.auto}`).then(res=>{
            if(res.data.code === 0){
                message.success('修改成功')
                this.getDataList()
            }
        })
    }

    onPreEnter() {
        console.log('进入');
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
    onEnter() {
        this.getDataList();
    }

    handleSet(value) {
        console.log(value);
    }

    handleDelete(value) {
        console.log(value);
    }

    openEditModal(value) {
        console.log(value);
        console.log(this.state.communityList);
        this.setState(
            {
                isEditModalShow: true,
                modalData: value,
            },
            () => {
                this.editFormRef.current.setFieldsValue(value);
            }
        );
    }

    handleChangeEqName(e) {
        let { searchParams } = this.state;

        this.setState({
            searchParams: {
                ...searchParams,
                eqName: e.target.value,
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

    handleChangeStatus(value) {
        let { searchParams } = this.state;

        this.setState({
            searchParams: {
                ...searchParams,
                status: value,
            },
        });
    }

    handleSearch() {
        this.setState({
            currentPage:1
        },()=>{
            this.getDataList();
        })
    }

    getDataList() {
        let { searchParams, currentPage, currentPageSize } = this.state;

        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/estate/getSmartEstateDeviceData?is_in=${searchParams.status}&device_name=${searchParams.eqName}&estate_name=${searchParams.name}&street_name=${searchParams.streetName}&current=${currentPage}&page_size=${currentPageSize}`
            )
            .then(res => {
                this.setState({
                    data: res.data.data,
                    totalNumber: res.data.count,
                });
            });
    }

    handleReset() {
        this.setState(
            {
                searchParams: {
                    name: '',
                    eqName: '',
                    status: null,
                },
            },
            () => {
                this.getDataList();
            }
        );
    }

    //翻页
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

    //关联居住区块
    handleAddVillage() {
        let { chooseList } = this.state;
        this.villageFormRef.current.validateFields().then(response => {
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + '/api/lh/estate/bindSmartEstateDevice',
                    {
                        data: chooseList.map(item => {
                            return {
                                id: item.id,
                                code: item.camera_id,
                                is_in: String(item.is_in),
                                // nick_name: item.nick_name,
                                se_id: this.villageFormRef.current.getFieldsValue().name || 0,
                                lng: item.lng,
                                lat: item.lat,
                            };
                        }),
                    }
                )
                .then(res => {
                    message.success('关联居住区块成功');

                    this.setState({
                        isVillageModalShow: false,
                        chooseList:[],
                        selectedRowKeys:[]
                    });

                    this.villageFormRef.current.resetFields();
                    this.getDataList();
                });
        });
    }

    //关联进出标识
    handleAddStatus() {
        let { chooseList } = this.state;

        axios
            .post(`${GetQtController().inParam.dataUrl}` + '/api/lh/estate/bindSmartEstateDevice', {
                data: chooseList.map(item => {
                    return {
                        id: item.id,
                        code: item.camera_id,
                        is_in: String(this.statusFormRef.current.getFieldsValue().status),
                        // nick_name: item.nick_name,
                        se_id: item.estate_id,
                        lng: item.lng,
                        lat: item.lat,
                    };
                }),
            })
            .then(res => {
                message.success('绑定进出标识成功');

                this.setState({
                    isStatusModalShow: false,
                    chooseList:[],
                    selectedRowKeys:[]
                });

                this.statusFormRef.current.resetFields();
                this.getDataList();
            });
    }

    //编辑
    handleEditData(value) {
        let { modalData } = this.state;
        let params = this.editFormRef.current.getFieldsValue();
        this.editFormRef.current.validateFields().then(res => {
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + '/api/lh/estate/bindSmartEstateDevice',
                    {
                        data: [
                            {
                                id: modalData.id,
                                code: modalData.camera_id,
                                lng: modalData.lng,
                                lat: modalData.lat,
                                se_id: params.estate_id ? params.estate_id : 0,
                                // nick_name: params.nick_name,
                                is_in: params.is_in ? String(params.is_in) : '0',
                            },
                        ],
                    }
                )
                .then(res => {
                    message.success('修改成功');
                    this.setState(
                        {
                            isEditModalShow: false,
                            modalData: {},
                        },
                        () => {
                            this.getDataList();
                        }
                    );
                    this.editFormRef.current.resetFields();
                });
        });
    }

    closeVillageModal() {
        this.villageFormRef.current.resetFields();
        this.setState({
            isVillageModalShow: false,
        });
    }

    closeStatusModal() {
        this.statusFormRef.current.resetFields();
        this.setState({
            isStatusModalShow: false,
        });
    }

    closeEditModal() {
        this.editFormRef.current.resetFields();
        this.setState({
            isEditModalShow: false,
        });
    }

    openVillageModal() {
        this.setState({
            isVillageModalShow: true,
        });
    }

    openStatusModal() {
        this.setState({
            isStatusModalShow: true,
        });
    }

    handleChangeStreetName(e){
        let {searchParams} = this.state
        this.setState({
            searchParams:{
                ...searchParams,
                streetName:e.target.value
            }
        })
    }

    deleteLink(){
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
                axios.post(GetQtController().inParam.dataUrl + `/api/lh/estate/delSmartEstateDevice`,{
                    data:chooseList.map(item=>item.camera_id)
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
            chooseList,
            searchParams,
            currentPage,
            currentPageSize,
            totalNumber,
            isVillageModalShow,
            isStatusModalShow,
            isEditModalShow,
            selectedRowKeys
        } = this.state;
        return (
            // style={{ display: this.state.isSelfShow ? "block" : "none" }}
            <div className="css-device-link">
                <div className="css-header">
                    <div className="css-first">
                        <div className="css-formItem">
                            <div className="css-label">街道</div>
                            <Input
                                onChange={value => {
                                    this.handleChangeStreetName(value);
                                }}
                                value={searchParams.streetName}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">设备名称</div>
                            <Input
                                onChange={value => {
                                    this.handleChangeEqName(value);
                                }}
                                value={searchParams.eqName}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">居住区块</div>
                            <Input
                                onChange={value => {
                                    this.handleChangeName(value);
                                }}
                                value={searchParams.name}
                                placeholder={'请输入关键字检索'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">进出标识</div>

                            <Select
                                value={searchParams.status}
                                onChange={value => {
                                    this.handleChangeStatus(value);
                                }}
                                placeholder={'请选择'}
                                defaultValue={searchParams.status}
                                options={[
                                    {
                                        value: 0,
                                        label: '未知',
                                    },
                                    {
                                        value: 1,
                                        label: '进区',
                                    },
                                    {
                                        value: 2,
                                        label: '出区',
                                    },
                                ]}
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
                    <div className="css-secound">
                        <Button
                            disabled={chooseList.length === 0}
                            onClick={this.openVillageModal.bind(this)}
                            className="css-link-btn"
                        >
                            关联居住区块
                        </Button>
                        <Button
                            disabled={chooseList.length === 0}
                            onClick={this.openStatusModal.bind(this)}
                            className="css-link-btn"
                        >
                            进出标识
                        </Button>
                        <Button
                            disabled={chooseList.length === 0}
                            onClick={this.deleteLink.bind(this)}
                            className="css-link-btn"
                        >
                            清除关联
                        </Button>
                    </div>
                </div>
                <div className="css-content">
                    <Table
                        scroll={{ y: 582 }}
                        dataSource={data}
                        columns={columns}
                        rowKey={record => record.id}
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
                        rowSelection={{
                            type: 'checkbox',
                            onChange: (selectedRowKeys, selectedRows) => {
                                console.log(selectedRowKeys, selectedRows);
                                this.setState({
                                    chooseList: selectedRows,
                                    selectedRowKeys:selectedRowKeys
                                });
                            },
                            selectedRowKeys:selectedRowKeys
                        }}
                    />
                </div>
                <Modal
                    title={'关联居住区块'}
                    visible={isVillageModalShow}
                    onOk={this.handleAddVillage.bind(this)}
                    onCancel={this.closeVillageModal.bind(this)}
                >
                    <Form
                        ref={this.villageFormRef}
                        name={'villageForm'}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >
                        <Form.Item
                            label={'居住区块'}
                            name="name"
                        >
                            <Select
                                optionFilterProp="label"
                                showSearch
                                allowClear
                                placeholder={'请选择'}
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
                <Modal
                    title={'进出标识'}
                    visible={isStatusModalShow}
                    onOk={this.handleAddStatus.bind(this)}
                    onCancel={this.closeStatusModal.bind(this)}
                >
                    <Form
                        ref={this.statusFormRef}
                        name={'statusForm'}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >
                        <Form.Item label={'进出标识'} name="status">
                            <Select
                                placeholder={'请选择'}
                                allowClear
                                options={[
                                    {
                                        value: 0,
                                        label: '未知',
                                    },
                                    {
                                        value: 1,
                                        label: '进区',
                                    },
                                    {
                                        value: 2,
                                        label: '出区',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={'编辑'}
                    visible={isEditModalShow}
                    onOk={this.handleEditData.bind(this)}
                    onCancel={this.closeEditModal.bind(this)}
                >
                    <Form
                        ref={this.editFormRef}
                        name={'editForm'}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >

                        <Form.Item label={'设备名称'} name="name">
                            <Input disabled placeholder={'请输入设备名称'} />
                        </Form.Item>
                        <Form.Item
                            label={'居住区块'}
                            name="estate_id"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: '请选择居住区块',
                            //     },
                            // ]}
                        >
                            <Select
                                optionFilterProp="label"
                                showSearch
                                allowClear
                                placeholder={'请选择居住区块'}
                                options={[
                                    {
                                        label: '无',
                                        value: 0,
                                    },
                                    ...this.state.communityList.map(item => {
                                        return {
                                            label: item.name,
                                            value: item.id,
                                        };
                                    }),
                                ]}
                            />
                        </Form.Item>
                        {/*<Form.Item*/}
                        {/*    label={'设备别称'}*/}
                        {/*    name="nick_name"*/}
                        {/*    rules={[*/}
                        {/*        {*/}
                        {/*            required: true,*/}
                        {/*            message: '请输入设备别称',*/}
                        {/*        },*/}
                        {/*    ]}*/}
                        {/*>*/}
                        {/*    <Input placeholder={'请输入设备别称'} />*/}
                        {/*</Form.Item>*/}
                        <Form.Item label={'进出标识'} name="is_in">
                            <Select
                                allowClear
                                placeholder={'请选择'}
                                options={[
                                    {
                                        value: 0,
                                        label: '未知',
                                    },
                                    {
                                        value: 1,
                                        label: '进区',
                                    },
                                    {
                                        value: 2,
                                        label: '出区',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
