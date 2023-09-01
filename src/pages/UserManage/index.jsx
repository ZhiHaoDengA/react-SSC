import React, { useMemo } from 'react';
import './index.less';
import axios from 'axios';
// import store from '@/store';
import {
    Select,
    Input,
    Button,
    Table,
    Space,
    notification,
    Modal,
    Form,
    Tree,
    message,
    Radio,
    Cascader,
} from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';

const { Search } = Input;
const dataList = [];

export default class YongHuGuanLiPage extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.resetFormRef = React.createRef();
        this.state = {
            isClassify: true, //判断 方案要素文本框 显示隐藏
            data: [
                // 表格数据
                {
                    user_id: '大洋网格001',
                    account: '3',
                    name: '小米',
                    address: '深圳市',
                    department: 1835689564,
                    idNumber: '524521698457565878',
                    key: 0,
                },
                {
                    user_id: '大洋网格002',
                    account: 'N',
                    name: '小红',
                    address: '临海',
                    department: 1835689564,
                    idNumber: '52452169845756587X',
                    key: 1,
                },
            ],
            columns: [
                {
                    title: '用户账号',
                    dataIndex: 'account',
                    key: 'account',
                },
                {
                    title: '姓名',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '身份证号',
                    dataIndex: 'id_card',
                    key: 'id_card',
                },
                {
                    title: '部门',
                    dataIndex: 'department',
                    key: 'department',
                },
                {
                    title: '角色',
                    dataIndex: 'role',
                    key: 'role',
                },
                {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (_, record) => {
                        return record.status === 0 ? <span>禁用</span> : <span>正常</span>;
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
                                onClick={this.onClickOpenModal.bind(this, record, '修改')}
                            >
                                修改
                            </a>
                            <a
                                className="css-delete-btn"
                                onClick={this.onClickDelete.bind(this, record)}
                            >
                                删除
                            </a>
                            <a
                                className="css-set-btn"
                                onClick={this.resetPassword.bind(this, record)}
                            >
                                重置密码
                            </a>
                        </Space>
                    ),
                },
            ],
            region: '', // 搜索角色
            name: '', // 搜索姓名
            expandedKeys: [], // （受控）展开指定的树节点
            searchValue: '', // 左侧树搜索值
            autoExpandParent: true, // 是否自动展开父节点
            treeDataList: [], // 左侧树状数据
            deleteName: '', // 删除信息姓名
            isDeleteModalOpen: false, // 删除提示modal显隐
            isModifyModalOpen: false, // 修改表格信息modal显隐
            isModalOpen: false, // 新增网格信息modal显隐
            modalTitle: '', // 新建/修改 modal名
            defaultData: [], // 接收树状数据 DataNode[]
            currentCode: '', //当前选择的网格code
            editId: '', //编辑数据id
            deleteId: '', //删除数据id
            currentPage: 1,
            currentPageSize: 10,
            totalNumber: 0,
            isResetModalShow: false,
            chooseList: [], //勾选的数据列表
            resetModalId: '', //重置密码的用户id
            isMoveModalShow: false,
            modalExpandedKeys: [],
            modalAutoExpandParent: [],
            modalTreeDataList: [],
            chooseMoveId: 0,
            chooseKey: '',
        };
    }

    onMounted() {
        this.getMapDataList();
    }

    //获取角色数据
    getRoleDataList() {
        axios.get(`` + '/api/lh/roleManagement/getDataList');
    }

    //获取地图数据
    getMapDataList() {
        axios
            .get(`${GetQtController().inParam.dataUrl}` + `/api/lh/getBranchMenuData?is_tree=1`)
            .then(res => {
                this.setState(
                    {
                        defaultData: res.data.data,
                    },
                    () => {
                        this.generateList(res.data.data);
                        this.treeData();
                        this.modalTreeData();
                        if (res.data.data.length !== 0) {
                            this.onClickSearch(res.data.data[0].id);
                        } else {
                            this.onClickSearch('');
                        }
                    }
                );
            });
    }

    /**
     * 表格-搜索提交
     */
    onClickSearch(key) {
        const { region, name, currentCode, currentPage, currentPageSize, totalNumber, chooseKey } =
            this.state;
        console.log('search-state', this.state);
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/userManagement/getData?id=${
                    key ? key : chooseKey
                }&name=${name}&role=${region}&current=${currentPage}&page_size=${currentPageSize}`
            )
            .then(res => {
                this.setState({
                    data: res.data.data,
                    totalNumber: res.data.count,
                });
            });
    }

    /**
     * 表格-重置搜索框
     */
    onClickReset() {
        console.log('重置', this.state);
        this.setState(
            {
                name: '',
                region: '',
            },
            () => {
                this.onClickSearch();
            }
        );
    }

    /**
     * 表格-修改网格信息
     *
     * @param value 当前修改的数据信息
     * @param btnName 新增-add、修改-modify
     */
    onClickOpenModal(value, btnName) {
        console.log(value);
        console.log('btnName:', btnName);
        this.setState(
            {
                modalTitle: btnName,
                isModalOpen: true, // 打开modal
            },
            () => {
                // 新增网格数据
                if (btnName === '新建') {
                    // 点新【新增网格】按钮打开modal重置数据
                    this.formRef.current.setFieldsValue({
                        user_id: null,
                        account: null,
                        name: null,
                        department: null,
                        idNumber: null,
                    });
                }

                // 修改网格数据
                if (btnName === '修改') {
                    const { account, name, department, id_card, role, status, id } = value;
                    this.formRef.current.setFieldsValue({
                        id,
                        account,
                        name,
                        id_card,
                        department,
                        role,
                        status,
                    });
                }
            }
        );
    }

    /**
     * 表格-删除按钮
     *
     * @param value 需要删除的表格信息
     */
    onClickDelete(value) {
        this.setState({
            isDeleteModalOpen: true,
            deleteName: value.name,
            deleteId: value.id,
        });
        console.log('删除按钮', value);
    }

    /**
     * 表格-数据修改或新建保存
     *
     * @param typeName 新建/修改
     */
    handleOk(typeName) {
        console.log('typeName:', typeName);

        // 获取表单数据
        const formValue = this.formRef.current.getFieldsValue();

        // validateFields-触发表单验证
        this.formRef.current
            .validateFields()
            .then(values => {
                console.log('validateFields-values:', values);
                if (typeName === '新增用户') {
                    axios
                        .post(
                            `${GetQtController().inParam.dataUrl}` +
                            '/api/lh/userManagement/addUser',
                            {
                                id: 0,
                                account: formValue.account,
                                name: formValue.name,
                                id_card: formValue.id_card,
                                department: formValue.department,
                                role: formValue.role,
                                status: formValue.status,
                            }
                        )
                        .then(res => {
                            message.success('添加成功');
                            this.onClickSearch();
                        });
                } else if (typeName === '修改')
                    axios
                        .post(
                            `${GetQtController().inParam.dataUrl}` +
                            '/api/lh/userManagement/addUser',
                            {
                                id: formValue.id,
                                account: formValue.account,
                                name: formValue.name,
                                id_card: formValue.id_card,
                                department: formValue.department,
                                role: formValue.role,
                                status: formValue.status,
                            }
                        )
                        .then(res => {
                            this.setState({
                                editId: '',
                            });
                            message.success('修改成功');
                            this.onClickSearch();
                        });
                // 验证成功关闭弹窗
                this.formRef.current.resetFields();
                this.setState({
                    isModalOpen: false,
                });
            })
            .catch(errorInfo => {
                // 验证错误信息
                console.log('validateFields-errorInfo:', errorInfo);
            });
    }

    /**
     * 删除表格信息二次确认
     */
    deleteInfo() {
        let { chooseList, deleteId } = this.state;

        axios
            .post(`${GetQtController().inParam.dataUrl}` + '/api/lh/userManagement/deleteUser', {
                id: deleteId ? [deleteId] : chooseList.map(item => item.id),
            })
            .then(res => {
                // 接口返回删除成功，弹出通知提醒框
                this.setState({ isDeleteModalOpen: false, deleteId: '' });
                this.onClickSearch();

                notification['success']({
                    message: '已成功！',
                    description: `${this.state.deleteName}，已删除`,
                });
            });
    }

    /**
     * 处理数据，每个节点的数据string[] 例[{key: '0-0', title: '0-0'}]
     */
    generateList(data) {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { id, name } = node;
            dataList.push({
                id: id,
                name: name,
            });
            if (node.partList) {
                this.generateList(node.partList);
            }
        }
    }

    /**
     * 左侧菜单搜索
     *
     * @param e 获取输入值e.target.value
     */
    onChangeSearch(e) {
        console.log('左侧搜索:', e);
        let { defaultData } = this.state;
        const { value } = e.target;

        // 获取搜索节点的父级 string[]
        console.log(dataList);
        const newExpandedKeys = dataList
            .map(item => {
                if (item.name.indexOf(value) > -1) {
                    return this.getParentKey(item.id, defaultData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);

        console.log('newExpandedKeys', newExpandedKeys);
        this.setState(
            {
                expandedKeys: newExpandedKeys,
                searchValue: value,
                autoExpandParent: true,
            },
            () => {
                this.treeData();
            }
        );
    }

    /**
     * 转移用户弹窗搜索
     *
     * @param e 获取输入值e.target.value
     */
    onChangeModalSearch(e) {
        let { defaultData } = this.state;
        const { value } = e.target;

        // 获取搜索节点的父级 string[]
        console.log(dataList);
        const newExpandedKeys = dataList
            .map(item => {
                if (item.name.indexOf(value) > -1) {
                    return this.getParentKey(item.id, defaultData);
                }
                return null;
            })
            .filter((item, i, self) => item && self.indexOf(item) === i);

        this.setState(
            {
                modalExpandedKeys: newExpandedKeys,
                searchValue: value,
                modalAutoExpandParent: true,
            },
            () => {
                this.modalTreeData();
            }
        );
    }

    /**
     * 根据搜索遍历tree节点
     *
     * @param key 每一个节点 '0-1-1'
     * @param tree 所有的节点 [{title: '0-1-1', key: '0-1-1', children: Array(3)}]
     */
    getParentKey(key, tree) {
        // console.log('getParentKey-key', key);
        // console.log('getParentKey-tree', tree);
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.partList) {
                if (node.partList.some(item => item.id === key)) {
                    parentKey = node.id;
                } else if (this.getParentKey(key, node.partList)) {
                    parentKey = this.getParentKey(key, node.partList);
                }
            }
        }
        return parentKey;
    }

    /**
     * 点击打开的节点
     *
     * @param newExpandedKeys string[]点击打开的父节点
     */
    onExpand(newExpandedKeys) {
        this.setState({
            expandedKeys: newExpandedKeys,
            autoExpandParent: false,
        });
    }

    onModalExpand(newExpandedKeys) {
        this.setState({
            modalExpandedKeys: newExpandedKeys,
            modalAutoExpandParent: false,
        });
    }

    /**
     * 根据搜索展示树
     */
    treeData() {
        const { searchValue } = this.state;
        let { defaultData } = this.state;
        console.log(defaultData, searchValue);

        const loop = data => {
            return data.map(item => {
                console.log(item);
                const strTitle = item.name;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.partList) {
                    return {
                        name: title,
                        id: item.id,
                        partList: loop(item.partList),
                    };
                }
                return {
                    name: title,
                    id: item.id,
                };
            });
        };
        this.setState({
            treeDataList: loop(defaultData),
        });
    }

    /**
     * 根据搜索展示树
     */
    modalTreeData() {
        const { searchValue } = this.state;
        let { defaultData } = this.state;
        console.log(defaultData, searchValue);

        const loop = data => {
            return data.map(item => {
                console.log(item);
                const strTitle = item.name;
                const index = strTitle.indexOf(searchValue);
                const beforeStr = strTitle.substring(0, index);
                const afterStr = strTitle.slice(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="site-tree-search-value">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{strTitle}</span>
                    );
                if (item.partList) {
                    return {
                        name: title,
                        id: item.id,
                        partList: loop(item.partList),
                    };
                }
                return {
                    name: title,
                    id: item.id,
                };
            });
        };
        this.setState({
            modalTreeDataList: loop(defaultData),
        });
    }

    /**
     * 选中节点
     *
     * @param selectedKeys 选中的节点key值
     * @param e {selected, selectedNodes, node, event} selectedNodes-选中的节点及当前节点的子集 node-选中节点的相关参数
     */
    onSelect(selectedKeys, e) {
        // 可以根据选中的节点，修改表格的数据(this.state.data);
        let { name, region } = this.state;
        if (e.selected) {
            axios
                .get(
                    `${GetQtController().inParam.dataUrl}` +
                    `/api/lh/userManagement/getData?id=${selectedKeys}&name=${name}&region=${region}`
                )
                .then(res => {
                    this.setState({
                        data: res.data.data,
                        chooseKey: selectedKeys,
                    });
                });
        }
    }

    moveModalSelect(selectedKeys, e) {
        console.log(selectedKeys, e);
        this.setState({
            chooseMoveId: selectedKeys,
        });
    }

    handlePageChange(currentPage, currentPageSize) {
        this.setState(
            {
                currentPageSize,
                currentPage,
            },
            () => {
                this.onClickSearch();
            }
        );
    }

    resetPassword(value) {
        console.log(value);
        this.setState({ isResetModalShow: true, resetModalId: value.id });
    }

    confirmResetPassword() {
        this.resetFormRef.current.validateFields().then(res => {
            axios
                .post(`${GetQtController().inParam.dataUrl}` + `/api/lh/userManagement/resetUser`, {
                    id: this.state.resetModalId,
                    password: this.resetFormRef.current.getFieldsValue().password,
                })
                .then(res => {
                    this.setState({
                        resetModalId: '',
                        isResetModalShow: false,
                    });
                    this.onClickSearch();
                    this.resetFormRef.current.resetFields();
                });
        });
    }

    confirmMoveUser() {
        let { chooseMoveId, chooseList } = this.state;
        console.log(chooseMoveId, chooseList);
        if (chooseMoveId !== 0) {
            axios
                .post(`${GetQtController().inParam.dataUrl}` + `/api/lh/userManagement/moveUser`, {
                    user_id: chooseList.map(item => item.id),
                    department_id: chooseMoveId,
                })
                .then(res => {
                    message.success('用户转移成功!');
                    this.setState({
                        isMoveModalShow: false,
                    });
                    this.onClickSearch();
                });
        } else {
            message.error('请选择你要转移的部门');
        }
    }

    validatorId(rule, value, callback) {
        let regx = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!value) {
            callback(new Error('请输入身份证号'));
        } else if (regx.test(value)) {
            callback();
        } else {
            callback(new Error('身份证不正确'));
        }
    }

    render() {
        const {
            data,
            columns,
            region,
            name,
            isDeleteModalOpen,
            isModalOpen,
            modalTitle,
            deleteName,
            expandedKeys,
            autoExpandParent,
            treeDataList,
            defaultData,
            currentPage,
            currentPageSize,
            totalNumber,
            isResetModalShow,
            chooseList,
            deleteId,
            isMoveModalShow,
            modalExpandedKeys,
            modalAutoExpandParent,
            modalTreeDataList,
        } = this.state;
        console.log(treeDataList, defaultData);
        console.log(modalTreeDataList);
        return (
            <div className="wanggeliliang 3D_ignore">
                {/*左边树状部分*/}
                <div className="css-left">
                    <Search
                        style={{
                            marginBottom: 8,
                        }}
                        placeholder="请输入部门名称"
                        onChange={this.onChangeSearch.bind(this)}
                    />
                    <Tree
                        onExpand={this.onExpand.bind(this)}
                        expandedKeys={expandedKeys}
                        autoExpandParent={autoExpandParent}
                        treeData={treeDataList}
                        onSelect={this.onSelect.bind(this)}
                        fieldNames={{ title: 'name', key: 'id', children: 'partList' }}
                        height={820}
                    />
                </div>
                {/*右侧内容查询部分*/}
                <div className="css-right">
                    <div className="css-header">
                        <div className="css-first">
                            <div className="css-formItem">
                                <div className="css-label">姓名</div>
                                <Input
                                    placeholder="请输入姓名"
                                    className="css-input"
                                    type="text"
                                    allowClear
                                    value={name}
                                    onChange={e => {
                                        this.setState({
                                            name: e.target.value,
                                        });
                                        console.log('name-value', e.target.value);
                                    }}
                                />
                            </div>
                            <div className="css-formItem">
                                <div className="css-label">角色</div>
                                <Input
                                    placeholder="请输入角色"
                                    className="css-input"
                                    type="text"
                                    allowClear
                                    value={region}
                                    onChange={e => {
                                        this.setState({
                                            region: e.target.value,
                                        });
                                    }}
                                />
                            </div>
                            <Button
                                className="css-search-btn"
                                icon={<SearchOutlined />}
                                onClick={this.onClickSearch.bind(this)}
                            >
                                搜索
                            </Button>
                            <Button
                                className="css-reset-btn"
                                icon={<UndoOutlined />}
                                onClick={this.onClickReset.bind(this)}
                            >
                                重置
                            </Button>
                        </div>
                        <div className="css-first">
                            <Button
                                className="css-link-btn"
                                type="primary"
                                onClick={this.onClickOpenModal.bind(this, {}, '新增用户')}
                            >
                                新增用户
                            </Button>
                            <Button
                                className="css-link-btn"
                                type="primary"
                                onClick={() => {
                                    this.setState({ isMoveModalShow: true });
                                }}
                                disabled={chooseList.length === 0}
                            >
                                转移用户
                            </Button>
                            <Button
                                disabled={chooseList.length === 0}
                                className="css-link-btn"
                                type="danger"
                                onClick={() => {
                                    this.setState({ isDeleteModalOpen: true });
                                }}
                            >
                                删除
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
                                    });
                                },
                            }}
                        />
                    </div>
                </div>
                {/*新增修改弹窗弹窗*/}
                <Modal
                    title={modalTitle}
                    visible={isModalOpen}
                    className="css-modal-style"
                    // onOk={this.handleOk.bind(this)}
                    onCancel={() => {
                        this.setState({
                            isModalOpen: false,
                        });
                    }}
                    footer={[
                        <Button
                            key="primary"
                            type="primary"
                            onClick={this.handleOk.bind(this, modalTitle)}
                        >
                            保存
                        </Button>,
                        <Button
                            key="Default"
                            type="Default"
                            onClick={() => {
                                this.setState({ isModalOpen: false });
                            }}
                        >
                            取消
                        </Button>,
                    ]}
                >
                    <Form
                        ref={this.formRef}
                        name="edit"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={{
                            user_id: null,
                            account: null,
                            name: null,
                            department: null,
                            idNumber: null,
                        }}
                    >
                        <Form.Item
                            labelCol={{ span: 4, offset: 2 }}
                            label="账号"
                            name="account"
                            rules={[{ required: true, message: '请输入账号' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4, offset: 2 }}
                            label="姓名"
                            name="name"
                            rules={[{ required: true, message: '请输入姓名' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4, offset: 2 }}
                            label="身份证号"
                            name="id_card"
                            rules={[
                                {
                                    validator: this.validatorId,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4, offset: 2 }}
                            label="部门"
                            name="department"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择部门',
                                },
                            ]}
                        >
                            <Cascader
                                showSearch
                                onChange={(value, options) => {
                                    this.setState({ chooseLabel: options.label });
                                }}
                                placeholder={'请选择'}
                                options={defaultData}
                                fieldNames={{
                                    label: 'name',
                                    value: 'id',
                                    children: 'partList',
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4, offset: 2 }}
                            label="角色"
                            name="role"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择角色',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                onChange={(value, options) => {
                                    this.setState({ chooseLabel: options.label });
                                }}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').includes(input)
                                }
                                placeholder={'请选择'}
                                // options={store.getState().areaList}
                            />
                        </Form.Item>
                        <Form.Item
                            labelCol={{ span: 4, offset: 2 }}
                            initialValue={1}
                            label={'状态'}
                            name='status'
                        >
                            <Radio.Group>
                                <Radio value={1}>正常</Radio>
                                <Radio value={0}>禁用</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    className={'css-move-modal'}
                    visible={isMoveModalShow}
                    title="转移用户"
                    onOk={this.confirmMoveUser.bind(this)}
                    onCancel={() => {
                        this.setState({
                            isMoveModalShow: false,
                        });
                    }}
                >
                    <Search
                        style={{
                            marginBottom: 8,
                            width: '399px',
                        }}
                        placeholder="请输入部门名称"
                        onChange={this.onChangeModalSearch.bind(this)}
                    />
                    <div className={'css-tree-box'}>
                        <Tree
                            onExpand={this.onModalExpand.bind(this)}
                            expandedKeys={modalExpandedKeys}
                            autoExpandParent={modalAutoExpandParent}
                            treeData={modalTreeDataList}
                            onSelect={this.moveModalSelect.bind(this)}
                            height={320}
                            fieldNames={{
                                title: 'name',
                                key: 'id',
                                children: 'partList',
                            }}
                        />
                    </div>
                    <span className={'css-text'}>请选择当前所选用户即将转移的目标部门</span>
                </Modal>
                {/*重置密码弹窗*/}
                <Modal
                    name="reset"
                    title="重置密码"
                    visible={isResetModalShow}
                    footer={[
                        <Button
                            key="primary"
                            type="primary"
                            onClick={this.confirmResetPassword.bind(this)}
                        >
                            保存
                        </Button>,
                        <Button
                            key="Default"
                            type="Default"
                            onClick={() => {
                                this.resetFormRef.current.resetFields();
                                this.setState({ isResetModalShow: false });
                            }}
                        >
                            取消
                        </Button>,
                    ]}
                >
                    <Form ref={this.resetFormRef} name={'resetForm'}>
                        <Form.Item
                            label={'新密码'}
                            name={'password'}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject(new Error('请输入密码'));
                                        } else if (value.length < 8 || value.length > 20) {
                                            return Promise.reject(
                                                new Error('不符合复杂度要求，请重新新输入密码')
                                            );
                                        } else if (
                                            !(
                                                /^[\w-!\.~;:@#\$%\^&\*\(\)\[\]\?+=]*$/.test(
                                                    value
                                                ) &&
                                                (((value.match(/[0-9]/g) ||
                                                            value.match(/[A-Za-z]/g)) &&
                                                        value.match(
                                                            /[-!\.~;_:@#\$%\^&\*\(\)\[\]\?+=]/g
                                                        )) ||
                                                    (value.match(/[0-9]/g) &&
                                                        value.match(/[A-Za-z]/g)))
                                            )
                                        ) {
                                            return Promise.reject(
                                                new Error('不符合复杂度要求，请重新新输入密码')
                                            );
                                        } else {
                                            return Promise.resolve();
                                        }
                                    },
                                },
                            ]}
                        >
                            <Input.Password placeholder={'请输入密码'} />
                        </Form.Item>
                        <div className="css-modal-message">
                            要求：密码要求8-20位，至少包含2种字符组合（字母、数字、特殊字符）
                        </div>
                    </Form>
                </Modal>
                {/*删除弹窗*/}
                <Modal
                    name="delete"
                    title="提示"
                    className="css-modal-delete"
                    okText="删除"
                    visible={isDeleteModalOpen}
                    okButtonProps={{
                        type: 'primary',
                        danger: true,
                    }}
                    onCancel={() => this.setState({ isDeleteModalOpen: false })}
                    onOk={this.deleteInfo.bind(this)}
                >
                    {deleteId ? (
                        <p>{`删除用户【${deleteName}】，请确认是否继续删除？`}</p>
                    ) : (
                        <p>{`当前即将删除用户数：${chooseList.length}人，一经删除不可恢复，请确认是否删除？`}</p>
                    )}
                </Modal>
            </div>
        );
    }
}


