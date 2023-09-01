import React from 'react';
import './index.less';
import axios from 'axios';
// import store from '@/store';
import { Form, Input, Button, Table, Space, Modal, Select, Radio, message, Tree } from 'antd';
import { SearchOutlined, UndoOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default class RoleManage extends React.Component {
    addFormRef = React.createRef();
    roleFormRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            isClassify: true, //判断 方案要素文本框 显示隐藏
            data: [],
            columns: [
                {
                    title: '编码',
                    dataIndex: 'code',
                    key: 'code',
                },
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '排序',
                    dataIndex: 'sort',
                    key: 'sort',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                },
                {
                    title: '创建时间',
                    dataIndex: 'time',
                    key: 'time',
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    render: (_, record) => (
                        <Space size="middle">
                            <a className="css-set-btn" onClick={this.handleSet.bind(this, record)}>
                                修改
                            </a>
                            <a
                                className="css-set-btn"
                                onClick={this.handleSetRole.bind(this, record)}
                            >
                                分配权限
                            </a>
                            <a
                                className="css-delete-btn"
                                onClick={this.openDeleteModal.bind(this, record)}
                            >
                                删除
                            </a>
                        </Space>
                    ),
                },
            ],
            searchName: '', //搜索名称
            isAddModalShow: false,
            modalData: {},
            deleteModalData: {},
            currentPage: 1,
            currentPageSize: 10,
            totalNumber: 0,
            chooseLabel: '',
            sortNumber: 0,
            isRoleModalShow: false,
            treeNameList: ['管理后台', '三维客户端', '三维编辑端'],
            roleModalChooseIndex: 0,
            managementTreeData: [],
            threeDTreeData: [],
            editTreeData: [],
            roleModalData: {
                code: '',
                backChooseKeys: [],
                frontChooseKeys: [],
                editChooseKeys: [],
            },
        };
    }

    // onEnter() {
    //     this.getDataList();
    //
    //     console.log(store.getState().areaList);
    // }

    getBackTreeData(code) {
        let { roleModalData } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/roleManagement/getBackTree?code=${code}`
            )
            .then(res => {
                this.setState({
                    managementTreeData: res.data.data,
                    roleModalData: {
                        ...roleModalData,
                        backChooseKeys: res.data.chooseKeys,
                    },
                });
            });
    }

    getFrontTreeData(code) {
        let { roleModalData } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/roleManagement/getFrontTree?code=${code}`
            )
            .then(res => {
                this.setState({
                    threeDTreeData: res.data.data,
                    roleModalData: {
                        ...roleModalData,
                        frontChooseKeys: res.data.chooseKeys,
                    },
                });
            });
    }

    getEditTreeData(code) {
        let { roleModalData } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/roleManagement/getEditTree?code=${code}`
            )
            .then(res => {
                this.setState({
                    editTreeData: res.data.data,
                    roleModalData: {
                        ...roleModalData,
                        editChooseKeys: res.data.chooseKeys,
                        code,
                    },
                });
            });
    }

    handleSet(value) {
        console.log(value);
        this.setState(
            {
                isAddModalShow: true,
                modalData: value,
            },
            () => {
                this.addFormRef.current.setFieldsValue({
                    name: value.name,
                    msg: value.msg,
                    status: value.status,
                    sort: value.sort,
                });
                this.setState({
                    sortNumber: value.sort,
                });
            }
        );
    }

    handleSetRole(value) {
        const { name, code } = value;
        let { roleModalData } = this.state;
        this.setState(
            {
                isRoleModalShow: true,
            },
            () => {
                this.roleFormRef.current.setFieldsValue({
                    name,
                });
                this.getBackTreeData(code);
                this.getFrontTreeData(code);
                this.getEditTreeData(code);
            }
        );
    }

    onMounted() {
        store.subscribe(() => {
            this.setState(store.getState());
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
        let { searchName, currentPage, currentPageSize } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/roleManagement/getDataList?name=${searchName}&current=${currentPage}&page_size=${currentPageSize}`
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

    handleAdd() {
        this.setState({
            isAddModalShow: true,
        });
    }

    closeAddModal() {
        this.setState({
            isAddModalShow: false,
            modalData: {},
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
        this.setState({
            isDeleteModalShow: true,
            deleteModalData: value,
        });
    }

    deleteData(value) {
        axios
            .post(`${GetQtController().inParam.dataUrl}` + '/api/lh/roleManagement/deleteRole', {
                data: {
                    code: value.code,
                },
            })
            .then(res => {
                this.setState({
                    isDeleteModalShow: false,
                });
                message.success('角色删除成功');
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
        let params = this.addFormRef.current.getFieldsValue();
        let { sortNumber, modalData } = this.state;
        const { name, msg, status } = params;

        this.addFormRef.current.validateFields().then(res => {
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + `/api/lh/roleManagement/addNewPerson`,
                    {
                        id: modalData.name ? modalData.id : 0,
                        name,
                        sort: sortNumber,
                        msg,
                        status,
                    }
                )
                .then(res => {
                    modalData.name ? message.success('修改成功') : message.success('添加成功');
                    this.setState({
                        isAddModalShow: false,
                    });
                    this.addFormRef.current.resetFields();
                    this.getDataList();
                });
        });
    }

    onClickReduceNumber() {
        console.log(this.addFormRef.current.getFieldsValue());
        let { sortNumber } = this.state;

        if (sortNumber <= 0) {
            this.setState({
                sortNumber: 0,
            });
        } else {
            this.setState({
                sortNumber: --sortNumber,
            });
        }
    }

    onClickAddNumber() {
        let { sortNumber } = this.state;

        this.setState({
            sortNumber: ++sortNumber,
        });
    }

    handleAddRole() {
        const { roleModalData } = this.state;
        let params = this.roleFormRef.current.getFieldsValue();
        console.log(params);
        axios
            .post(`${GetQtController().inParam.dataUrl}` + `/api/lh/roleManagement/addNewRole`, {
                data: {
                    ...roleModalData,
                },
            })
            .then(res => {
                message.success('分配权限成功');
                this.setState({
                    isRoleModalShow: false,
                    roleModalData: {
                        code: '',
                        backChooseKeys: [],
                        frontChooseKeys: [],
                        editChooseKeys: [],
                    },
                });
                this.roleFormRef.current.resetFields();
                this.getDataList();
            });
    }

    render() {
        let {
            roleModalData,
            managementTreeData,
            threeDTreeData,
            editTreeData,
            searchName,
            treeNameList,
            roleModalChooseIndex,
            isRoleModalShow,
            sortNumber,
            data,
            columns,
            isAddModalShow,
            modalData,
            deleteModalData,
            totalNumber,
            isDeleteModalShow,
            currentPage,
            currentPageSize,
        } = this.state;
        return (
            // style={{ display: this.state.isSelfShow ? "block" : "none" }}
            <div className="css-roleManage">
                <div className="css-header">
                    <div className="css-first">
                        <div className="css-formItem">
                            <div className="css-label">名称</div>
                            <Input
                                value={searchName}
                                onChange={value => {
                                    this.handleChangeName(value);
                                }}
                                placeholder={'请输入角色名称'}
                                className="css-input"
                            ></Input>
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
                        <Button onClick={this.handleAdd.bind(this)} className="css-link-btn">
                            新增角色
                        </Button>
                    </div>
                </div>
                <div className="css-content">
                    <Table
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
                    />
                </div>
                <Modal
                    title={modalData.name ? '修改角色' : '新增角色'}
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
                            label={'角色名称'}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入角色名称',
                                },
                            ]}
                        >
                            <Input placeholder={'输入角色名称'} />
                        </Form.Item>
                        <Form.Item label={'排序'} name="sort">
                            <div style={{ display: 'flex' }}>
                                <Button
                                    style={{ width: '32px', height: '32px' }}
                                    onClick={this.onClickReduceNumber.bind(this)}
                                    className="css-reduce-btn"
                                    icon={<MinusOutlined />}
                                />
                                <Input
                                    style={{ textAlign: 'center', width: '96px', height: '32px' }}
                                    value={sortNumber}
                                    readonly={'readonly'}
                                    string={''}
                                />
                                <Button
                                    style={{ width: '32px', height: '32px' }}
                                    onClick={this.onClickAddNumber.bind(this)}
                                    className="css-reduce-btn"
                                    icon={<PlusOutlined />}
                                />
                            </div>
                        </Form.Item>
                        <Form.Item label={'角色说明'} name="msg">
                            <TextArea style={{ height: '76px' }} placeholder={'输入角色说明'} />
                        </Form.Item>
                        <Form.Item initialValue={1} label={'状态'} name={'status'}>
                            <Radio.Group>
                                <Radio value={1}>正常</Radio>
                                <Radio value={0}>禁用</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    className="css-roleModal"
                    title={'分配权限'}
                    visible={isRoleModalShow}
                    onOk={this.handleAddRole.bind(this)}
                    onCancel={() => {
                        this.setState({ isRoleModalShow: false });
                    }}
                >
                    <Form
                        ref={this.roleFormRef}
                        name={'roleForm'}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >
                        <Form.Item
                            style={{ marginBottom: '0px' }}
                            label={'角色名称'}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入角色名称',
                                },
                            ]}
                        >
                            <Input disabled={true} placeholder={'输入角色名称'} />
                        </Form.Item>
                        <div className="css-tab">
                            {treeNameList &&
                                treeNameList.map((item, index) => {
                                    return (
                                        <div
                                            className={
                                                index === roleModalChooseIndex
                                                    ? 'css-tab-box-choose'
                                                    : 'css-tab-box'
                                            }
                                            onClick={() => {
                                                this.setState({ roleModalChooseIndex: index });
                                            }}
                                        >
                                            {item}
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="css-overflow-box">
                            {roleModalChooseIndex === 0 && (
                                <Tree
                                    height={320}
                                    checkable
                                    defaultCheckedKeys={roleModalData.backChooseKeys}
                                    onCheck={e => {
                                        this.setState({ backChooseKeys: e });
                                    }}
                                    treeData={managementTreeData}
                                />
                            )}
                            {roleModalChooseIndex === 1 && (
                                <Tree
                                    height={320}
                                    checkable
                                    defaultCheckedKeys={roleModalData.frontChooseKeys}
                                    onCheck={e => {
                                        this.setState({ frontChooseKeys: e });
                                    }}
                                    treeData={threeDTreeData}
                                />
                            )}
                            {roleModalChooseIndex === 2 && (
                                <Tree
                                    height={320}
                                    checkable
                                    defaultCheckedKeys={roleModalData.editChooseKeys}
                                    onCheck={e => {
                                        this.setState({ editChooseKeys: e });
                                    }}
                                    treeData={editTreeData}
                                />
                            )}
                        </div>
                    </Form>
                </Modal>
                <Modal
                    title={'提示'}
                    visible={isDeleteModalShow}
                    footer={[
                        <Button
                            type={'primary'}
                            danger
                            onClick={this.deleteData.bind(this, deleteModalData)}
                        >
                            删除
                        </Button>,
                        <Button onClick={this.closeDeleteModal.bind(this)}>取消</Button>,
                    ]}
                >
                    {deleteModalData.bind === 0 ? (
                        <span>
                            您当前删除的角色为【{deleteModalData.name}】，请确认是否继续删除？
                        </span>
                    ) : (
                        <span>
                            该角色已绑定用户，若继续删除，则自动解除该角色与用户的绑定关系。是否继续删除？
                        </span>
                    )}
                </Modal>
            </div>
        );
    }
}

