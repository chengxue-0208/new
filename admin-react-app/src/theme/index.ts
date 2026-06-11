import { theme } from 'antd';

export const cyberpunkTheme = {
  algorithm: theme.darkAlgorithm,

  token: {
    colorPrimary: '#6366f1',
    colorInfo: '#8b5cf6',
    colorSuccess: '#0aff60',
    colorWarning: '#facc15',
    colorError: '#ff0099',
    colorBgContainer: 'rgba(22, 24, 53, 0.6)',
    colorBgLayout: 'rgba(10, 11, 30, 0.8)',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.5)',
    colorBorder: 'rgba(139, 92, 246, 0.3)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  components: {
    Layout: {
      siderBg: 'rgba(22, 24, 53, 0.9)',
      headerBg: 'rgba(22, 24, 53, 0.8)',
      bodyBg: 'transparent',
      headerHeight: 64,
      siderBgCollapsed: 'rgba(10, 11, 30, 1)',
    },

    Card: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBgLayout: 'rgba(10, 11, 30, 0.8)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      borderRadiusLG: 12,
    },

    Menu: {
      colorItemBg: 'transparent',
      colorItemText: 'rgba(255, 255, 255, 0.7)',
      colorItemBgHover: 'rgba(139, 92, 246, 0.2)',
      colorItemTextHover: '#ffffff',
      colorItemBgSelected: 'rgba(139, 92, 246, 0.3)',
      colorItemTextSelected: '#ffffff',
      colorItemBorderRadius: 8,
      colorSubItemBg: 'transparent',
      colorSubItemText: 'rgba(255, 255, 255, 0.6)',
      colorSubItemTextHover: '#ffffff',
    },

    Button: {
      colorPrimary: '#6366f1',
      colorPrimaryHover: '#8b5cf6',
      borderRadius: 6,
    },

    Table: {
      colorBgContainer: 'rgba(30, 31, 58, 0.8)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      headerBg: 'rgba(139, 92, 246, 0.2)',
      headerColor: '#ffffff',
      rowHoverBg: 'rgba(139, 92, 246, 0.1)',
    },

    Input: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      colorText: '#ffffff',
      borderRadius: 6,
    },

    Select: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      colorText: '#ffffff',
      borderRadius: 6,
    },

    Statistic: {
      colorText: 'rgba(255, 255, 255, 0.8)',
    },

    Modal: {
      colorBgContainer: 'rgba(22, 24, 53, 0.9)',
      colorBgMask: 'rgba(10, 11, 30, 0.8)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
    },

    Form: {
      colorText: '#ffffff',
    },

    DatePicker: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      colorText: '#ffffff',
      borderRadius: 6,
    },

  },
};

export default cyberpunkTheme;