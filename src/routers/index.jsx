import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import AddressLink from '@/pages/AddressLink';
import ControlElement from '@/pages/ControlElement';
import CreateArea from '@/pages/CreateArea';
import DepartmentManage from '@/pages/DepartmentManage';
import DeviceLink from '@/pages/DeviceLink';
import RoleManage from '@/pages/RoleManage';
import ThresholdConfig from "@/pages/ThresholdConfig"
import UserManage from '@/pages/UserManage';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';

const routes = [
  {
    path: "/smart-safety-area",
    key: "/smart-safety-area",
    label:'智安小区后台配置',
    icon:<PieChartOutlined></PieChartOutlined>,
    element: <NotFound/>,
    children: [
      {
        path: "/smart-safety-area/create",
        key: "/smart-safety-area/create",
        label:'小区创建',
        element: <CreateArea />,
      },
      {
        path: "/smart-safety-area/address-link",
        key: "/smart-safety-area/address-link",
        label:'地址关联',
        element: <AddressLink />,
      },
      {
        path: "/smart-safety-area/device-link",
        key: "/smart-safety-area/device-link",
        label:'设备关联',
        element: <DeviceLink />,
      },
      {
        path: "/smart-safety-area/threshold-config",
        key: "/smart-safety-area/threshold-config",
        label:'阈值设置',
        element: <ThresholdConfig />,
      },
    ],
  },
  {
    path:'/source-manage',
    label:'资源管理',
    icon:<DesktopOutlined ></DesktopOutlined >,
    element:'',
    children:[
      {
        path:'/source-manage/control-element',
        key:'/source-manage/control-element',
        label:'静态要素上图',
        element:<ControlElement></ControlElement>
      }
    ]
  },
  {
    path:'/user-management',
    label:'用户管理',
    icon:<ContainerOutlined  ></ContainerOutlined  >,
    element:'',
    children:[
      {
        path:'/user-management/department',
        key:'/user-management/department',
        label:'部门管理',
        element:<DepartmentManage></DepartmentManage>,
      },
      {
        path:'/user-management/role',
        key:'/user-management/role',
        label:'角色管理',
        element:<RoleManage></RoleManage>,
      },
      {
        path:'/user-management/user',
        key:'/user-management/user',
        label:'用户管理',
        element:<UserManage></UserManage>,
      },
    ]
  }
];

export default routes