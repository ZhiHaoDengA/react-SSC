import React from 'react';
import './index.less';
import axios from 'axios';
// import store from '@/store';
// import ElementContent from '../elementContent/index';
import { Form, Input, Button, Table, Space, Modal, Select, Radio, message, Cascader } from 'antd';
import { SearchOutlined, UndoOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

export default class DepartmentManage extends React.Component {
    addFormRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            isClassify: true, //判断 方案要素文本框 显示隐藏
            data: [],
            columns: [
                {
                    title: '部门名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '部门ID',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '排序',
                    dataIndex: 'weight',
                    key: 'weight',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (_, record) => {
                        return record.status == 1 ? '开启' : '禁用';
                    },
                },
                {
                    title: '创建人',
                    dataIndex: 'creater',
                    key: 'creater',
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    render: (_, record) => {
                        let { data } = this.state;

                        return (
                            <Space size="middle">
                                {record.level === 2 && (
                                    <a
                                        className="css-set-btn"
                                        onClick={this.handleAdd.bind(this, record)}
                                    >
                                        新增
                                    </a>
                                )}

                                {data.some(item => {
                                    return item.id == record.id;
                                }) || record.level === 2 ? (
                                    ''
                                ) : (
                                    <a
                                        className="css-set-btn"
                                        onClick={this.handleSet.bind(this, record)}
                                    >
                                        修改
                                    </a>
                                )}
                                {data.some(item => {
                                    return item.id == record.id;
                                }) || record.level === 2 ? (
                                    ''
                                ) : (
                                    <a
                                        className="css-delete-btn"
                                        onClick={this.openDeleteModal.bind(this, record)}
                                    >
                                        删除
                                    </a>
                                )}
                            </Space>
                        );
                    },
                },
            ],
            searchName: '', //小区名称
            searchArea: '', //行政区域
            isAddModalShow: false,
            modalData: { id: 0, sort: 1, weight: '默认数据部门', lastId: '', lastLabel: '' },
            deleteModalData: {},
            currentPage: 1,
            currentPageSize: 50,
            totalNumber: 0,
            chooseLabel: '',
            mapDataList: [], //新增修改弹窗 管辖区域选择内容
            areaNameList: [],
        };
    }

    onEnter() {
        this.getDataList();
    }
    handleAdd(value) {
        console.log(value);
        let { modalData } = this.state;

        this.setState(
            {
                isAddModalShow: true,
                modalData: {
                    ...modalData,
                    lastId: value.id,
                    district: value.district,
                },
            },
            () => {
                this.addFormRef.current.setFieldsValue({
                    weight: value.name,
                });
            }
        );
    }

    handleSet(value) {
        console.log(value);
        let newArray = [];
        if (value.manage_code === 'null') {
            newArray = [];
        } else {
            value.manage_code.split(',').forEach(item => {
                newArray.push(item.split('/'));
            });
        }

        this.setState(
            {
                isAddModalShow: true,
                modalData: {
                    id: value.id,
                    sort: value.level,
                    weight: '默认数据部门',
                    lastId: value.pid,
                    lastLabel: '',
                    name: value.name,
                },
                areaNameList: value.manage_name.split(','),
            },
            () => {
                this.addFormRef.current.setFieldsValue({
                    name: value.name,
                    status: value.status,
                    area: newArray,
                    weight: value.district,
                });
            }
        );
    }

    onMounted() {
        store.subscribe(() => {
            this.setState(store.getState());
            console.log(store.getState().areaList);
        });
        this.getMapDataList();
    }

    getMapDataList() {
        axios.get(`${GetQtController().inParam.dataUrl}` + `/api/lh/getYjxMapData`).then(res => {
            this.setState({
                mapDataList: res.data.data,
            });
        });
    }

    handleChangeName(e) {
        console.log(e.target.value);
        this.setState({
            searchName: e.target.value,
        });
    }

    handleChangeArea(e) {
        this.setState({
            searchArea: e.target.value,
        });
    }

    getDataList() {
        let { searchName, searchArea, currentPage, currentPageSize } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/getBranchMenuData?is_tree=1&branch_name=${searchName}`
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
                searchName: '',
                searchArea: '',
            },
            () => {
                this.getDataList();
            }
        );
    }

    handleSearch() {
        this.getDataList();
    }

    closeAddModal() {
        this.setState({
            isAddModalShow: false,
            modalData: { sort: 1, weight: '默认数据部门', lastId: '', lastLabel: '' },
            chooseLabel: '',
        });
        this.addFormRef.current.resetFields();
    }

    closeDeleteModal() {
        this.setState({
            isDeleteModalShow: false,
            deleteModalData: {},
        });
    }

    openDeleteModal(value) {
        console.log(value);
        this.setState({
            isDeleteModalShow: true,
            deleteModalData: value,
        });
    }

    deleteData(value) {
        axios
            .post(
                `${GetQtController().inParam.dataUrl}` + '/api/lh/userManagement/deleteDepartment',
                {
                    id: value.id,
                }
            )
            .then(res => {
                this.setState({
                    isDeleteModalShow: false,
                });
                message.success('删除部门成功');
                this.getDataList();
            });
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
        let { modalData, mapDataList, areaNameList } = this.state;

        let params = this.addFormRef.current.getFieldsValue();
        console.log(modalData, params);
        this.addFormRef.current.validateFields().then(value => {
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + `/api/lh/userManagement/addDepartment`,
                    {
                        id: modalData.id ? modalData.id : 0,
                        name: params.name,
                        sort: modalData.sort,
                        pid: modalData.lastId,
                        area_id:
                            !params.area || params.area.length === 0
                                ? ['null']
                                : params.area.map(item => {
                                    if (item instanceof Array) {
                                        return item.join('/');
                                    } else {
                                        return item;
                                    }
                                }),
                        area_name: areaNameList.length !== 0 ? areaNameList : ['null'],
                        status: params.status,
                        district: modalData.district,
                    }
                )
                .then(res => {
                    if (res.data.code === 0) {
                        message.success(modalData.id ? '修改成功' : '添加成功');
                        this.setState({
                            modalData: {
                                id: 0,
                                sort: 1,
                                weight: '默认数据部门',
                                lastId: '',
                                lastLabel: '',
                            },
                            isAddModalShow: false,
                        });
                        this.getDataList();
                        this.addFormRef.current.resetFields();
                    } else {
                        message.error('失败');
                    }
                });
        });
    }

    onClickReduce() {
        let { modalData } = this.state;
        if (modalData.sort <= 1) {
            this.setState({
                modalData: {
                    ...modalData,
                    sort: 1,
                },
            });
        } else {
            this.setState({
                modalData: {
                    ...modalData,
                    sort: modalData.sort - 1,
                },
            });
        }
    }

    onClickAdd() {
        let { modalData } = this.state;
        this.setState({
            modalData: {
                ...modalData,
                sort: modalData.sort + 1,
            },
        });
    }

    render() {
        let {
            searchName,
            searchArea,
            data,
            columns,
            isAddModalShow,
            modalData,
            deleteModalData,
            totalNumber,
            isDeleteModalShow,
            currentPage,
            currentPageSize,
            mapDataList,
        } = this.state;
        return (
            // style={{ display: this.state.isSelfShow ? "block" : "none" }}
            <div className="bumenguanli 3D_ignore">
                <div className="css-header">
                    <div className="css-first">
                        <div className="css-formItem">
                            <div className="css-label">部门名称</div>
                            <Input
                                value={searchName}
                                onChange={value => {
                                    this.handleChangeName(value);
                                }}
                                placeholder={'请输入部门名称'}
                                className="css-input"
                            ></Input>
                        </div>
                        {/*<div className='css-formItem'>*/}
                        {/*    <div className='css-label'>*/}
                        {/*        行政区域*/}
                        {/*    </div>*/}
                        {/*    <Input value={searchArea} onChange={(value)=>{this.handleChangeArea(value)}} placeholder={'请输入行政区域'} className='css-input'></Input>*/}
                        {/*</div>*/}
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
                </div>
                <div className="css-content">
                    <Table
                        childrenColumnName={'partList'}
                        rowKey={'id'}
                        dataSource={data}
                        columns={columns}
                        pagination={false}
                        scroll={{ y: 680 }}
                    />
                </div>
                <Modal
                    title={modalData.name ? '修改部门' : '新增部门'}
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
                        <Form.Item
                            label={'部门名称'}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入部门名称',
                                },
                            ]}
                        >
                            <Input placeholder={'输入部门名称'} />
                        </Form.Item>
                        <Form.Item label={'排序'} name="sort">
                            <div style={{ display: 'flex' }}>
                                <Button
                                    onClick={this.onClickReduce.bind(this)}
                                    icon={<MinusOutlined />}
                                ></Button>
                                <Input
                                    readonly={'readonly'}
                                    value={modalData.sort}
                                    style={{ width: '96px', textAlign: 'center' }}
                                ></Input>
                                <Button
                                    onClick={this.onClickAdd.bind(this)}
                                    icon={<PlusOutlined />}
                                ></Button>
                            </div>
                        </Form.Item>
                        <Form.Item
                            label={'所属上级部门'}
                            name="weight"
                            initialValue={modalData.weight}
                        >
                            <Input disabled={true} placeholder={'输入部门名称'} />
                        </Form.Item>
                        <Form.Item initialValue={1} label={'状态'} name={'status'}>
                            <Radio.Group>
                                <Radio value={1}>正常</Radio>
                                <Radio value={0}>禁用</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label={'管辖区域'} name={'area'} initialValue={[]}>
                            <Cascader
                                options={mapDataList}
                                multiple
                                maxTagCount="responsive"
                                fieldNames={{
                                    label: 'areaName',
                                    value: 'areaCode',
                                    children: 'partList',
                                }}
                                onChange={(value, selectOptions) => {
                                    console.log(value, selectOptions);
                                    this.setState({
                                        areaNameList: selectOptions.map(item => {
                                            return item[item.length - 1].areaName;
                                        }),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={'提示'}
                    visible={isDeleteModalShow}
                    onCancel={this.closeDeleteModal.bind(this)}
                    footer={
                        deleteModalData.partList && deleteModalData.partList.length !== 0
                            ? [
                                <Button
                                    type={'primary'}
                                    onClick={this.closeDeleteModal.bind(this)}
                                >
                                    知道了
                                </Button>,
                            ]
                            : [
                                <Button
                                    type={'primary'}
                                    danger
                                    onClick={this.deleteData.bind(this, deleteModalData)}
                                >
                                    删除
                                </Button>,
                                <Button onClick={this.closeDeleteModal.bind(this)}>取消</Button>,
                            ]
                    }
                >
                    {deleteModalData.partList && deleteModalData.partList.length !== 0 ? (
                        <span>
                            该部门已存在子级部门或用户，您需要将子级部门全部删除和用户全部转移后才能删除当前部门。
                        </span>
                    ) : (
                        <span>
                            您当前删除的小区为【{deleteModalData.name}】，请确认是否继续删除？
                        </span>
                    )}
                </Modal>
            </div>
        );
    }
}

