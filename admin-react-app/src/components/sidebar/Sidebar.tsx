/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu } from 'antd';
import { LayoutDashboard, Users, Global, ShoppingCart, CreditCard, FileText } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../config/sidebar';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = config.children.map((item) => {
    const Icon = getIcon(item.icon);
    return {
      key: item.path,
      icon: <Icon style={{ color: '#ffffff' }} />,
      label: item.title,
    };
  });

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      LayoutDashboard,
      Users,
      Global,
      ShoppingCart,
      CreditCard,
      FileText,
    } as Record<string, any>;
    return iconMap[iconName] || null;
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
    />
  );
}