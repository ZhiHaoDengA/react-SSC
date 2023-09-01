import React, {Component} from "react";
import './index.less'
import { Form, Input, Button, Table, Space, Modal, Select, Radio, message } from 'antd';
import { SearchOutlined, UndoOutlined } from '@ant-design/icons';
import axios from "axios";

export default class CreateArea extends Component{
    addFormRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
                isClassify: true, //判断 方案要素文本框 显示隐藏
                data: [
                {
                    name: '123',
                    id: 0,
                    area: '5555',
                    sort: 0,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
                {
                    name: '123',
                    id: 0,
                    area: '5555',
                    sort: 0,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
                {
                    name: '123',
                    id: 0,
                    area: '5555',
                    sort: 0,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
                {
                    name: '123',
                    id: 0,
                    area: '5555',
                    sort: 0,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
                {
                    name: '123',
                    id: 0,
                    area: '5555',
                    sort: 0,
                    status: '开启',
                    creator: '11',
                    time: '2020',
                },
            ],
                columns: [
                {
                    title: '智安小区名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: '小区编号',
                    dataIndex: 'id',
                    key: 'id',
                },
                {
                    title: '街道',
                    dataIndex: 'street',
                    key: 'street',
                    render: (_, record) => {
                        return (
                            <span>
                                {record.mz_town_name} {record.mz_community_name}
                            </span>
                        );
                    },
                },
                {
                    title:'村居社区',
                    dataIndex: 'area',
                    key:'area'
                },
                {
                    title: '创建人',
                    dataIndex: 'create_user_name',
                    key: 'create_user_name',
                },
                {
                    title: '创建时间',
                    dataIndex: 'create_time',
                    key: 'create_time',
                    // defaultSortOrder: 'descend',
                    // sorter: (a, b) => a.time - b.time,
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
                                className="css-delete-btn"
                                onClick={this.openDeleteModal.bind(this, record)}
                            >
                                删除
                            </a>
                        </Space>
                    ),
                },
            ],
                searchName: '', //小区名称
                searchArea: '', //行政区域
                isAddModalShow: false,
                modalData: {},
                deleteModalData: {},
                currentPage: 1,
                currentPageSize: 10,
                totalNumber: 0,
                chooseLabel: '',
        }
    }

    handleSet(value) {
        console.log(value);
        this.setState(
            {
                isAddModalShow: true,
                modalData: value,
                chooseLabel:
                    value.mz_county_name + '/' + value.mz_town_name + '/' + value.mz_community_name,
            },
            () => {
                this.addFormRef.current.setFieldsValue({
                    name: value.name,
                    area:
                        value.mz_county_code +
                        '/' +
                        value.mz_town_code +
                        '/' +
                        value.mz_community_code,
                    status: value.status,
                });
            }
        );
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

    handleChangeCity(){
        this.setState({
            searchCity: e.target.value,
        });
    }

    handleChangeStreet(){
        this.setState({
            searchStreet: e.target.value,
        });
    }

    handleChange

    getDataList() {
        let { searchName, searchArea, currentPage, currentPageSize } = this.state;
        axios
            .get(
                `${GetQtController().inParam.dataUrl}` +
                `/api/lh/estate/getSmartEstateData?name=${searchName}&region=${searchArea}&current=${currentPage}&page_size=${currentPageSize}`
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
        this.setState(
            {
                isAddModalShow: true,
            },
            () => {
                this.addFormRef.current.resetFields();
            }
        );
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
            .post(`${GetQtController().inParam.dataUrl}` + '/api/lh/estate/delSmartEstateData', {
                data: [String(value.id)],
            })
            .then(res => {
                this.setState({
                    isDeleteModalShow: false,
                });
                message.success('删除小区成功');
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
        let { modalData, chooseLabel } = this.state;
        let params = this.addFormRef.current.getFieldsValue();
        console.log(params, chooseLabel.split('/'));
        this.addFormRef.current.validateFields().then(res => {
            axios
                .post(
                    `${GetQtController().inParam.dataUrl}` + '/api/lh/estate/saveSmartEstateData',
                    {
                        data: [
                            {
                                id: modalData.name ? modalData.id : 0,
                                name: params.name,
                                mz_county_name: chooseLabel.split('/')[0],
                                mz_county_code: params.area.split('/')[0],
                                mz_town_name: chooseLabel.split('/')[1],
                                mz_town_code: params.area.split('/')[1],
                                mz_community_name: chooseLabel.split('/')[2],
                                mz_community_code: params.area.split('/')[2],
                                status: params.status,
                            },
                        ],
                    }
                )
                .then(res => {
                    if (res.data.code == 0) {
                        this.setState(
                            {
                                isAddModalShow: false,
                                chooseLabel: '',
                                modalData: {},
                            },
                            () => {
                                if (modalData.name) {
                                    message.success('修改小区成功');
                                    this.addFormRef.current.resetFields();
                                } else {
                                    message.success('添加小区成功');
                                }
                                this.getDataList();
                            }
                        );
                    }
                });
        });
    }

    render() {
        let {
            searchName,
            searchArea,
            searchCity,
            searchStreet,
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
            <div className="xiaoquchuangjian">
                <div className="css-header">
                    <div className="css-first">
                        <div className="css-formItem">
                            <div className="css-label">小区名称</div>
                            <Input
                                value={searchName}
                                onChange={value => {
                                    this.handleChangeName(value);
                                }}
                                placeholder={'请输入小区名称'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">市县区</div>
                            <Input
                                value={searchCity}
                                onChange={value => {
                                    this.handleChangeCity(value);
                                }}
                                placeholder={'请输入市县区'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">乡镇街道</div>
                            <Input
                                value={searchStreet}
                                onChange={value => {
                                    this.handleChangeStreet(value);
                                }}
                                placeholder={'请输入乡镇街道'}
                                className="css-input"
                            />
                        </div>
                        <div className="css-formItem">
                            <div className="css-label">村居社区</div>
                            <Input
                                value={searchArea}
                                onChange={value => {
                                    this.handleChangeArea(value);
                                }}
                                placeholder={'请输入村居社区'}
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
                        <Button onClick={this.handleAdd.bind(this)} className="css-link-btn">
                            新增小区
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
                    />
                </div>
                <Modal
                    title={modalData.name ? '修改小区' : '新增小区'}
                    open={isAddModalShow}
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
                            label={'居住区块名称'}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入居住区块名称',
                                },
                            ]}
                        >
                            <Input placeholder={'输入居住区块名称'} />
                        </Form.Item>
                        <Form.Item label={'所属区域'} name="area">
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
                        <Form.Item initialValue={1} label={'状态'} name={'status'}>
                            <Radio.Group>
                                <Radio value={1}>正常</Radio>
                                <Radio value={0}>禁用</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title={'提示'}
                    open={isDeleteModalShow}
                    onCancel={this.closeDeleteModal.bind(this)}
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
                    您当前删除的小区为【{deleteModalData.name}】，请确认是否继续删除？
                </Modal>
            </div>
        );
    }
}