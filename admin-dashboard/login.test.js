import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('登录页面', () => {
  const htmlPath = resolve(__dirname, './login.html');
  const htmlContent = readFileSync(htmlPath, 'utf-8');

  it('应该包含登录页面结构', () => {
    expect(htmlContent).toContain('VPN 管理后台');
  });

  it('应该包含表单元素', () => {
    expect(htmlContent).toContain('form');
    expect(htmlContent).toContain('input type="email"');
    expect(htmlContent).toContain('input type="password"');
  });

  it('应该包含登录按钮', () => {
    expect(htmlContent).toContain('id="loginBtn"');
    expect(htmlContent).toContain('登录');
  });

  it('应该包含邮箱和密码字段', () => {
    expect(htmlContent).toContain('id="email"');
    expect(htmlContent).toContain('id="password"');
    expect(htmlContent).toContain('name="email"');
    expect(htmlContent).toContain('name="password"');
  });

  it('应该包含错误信息显示区域', () => {
    expect(htmlContent).toContain('id="loginError"');
    expect(htmlContent).toContain('class="login-error"');
  });

  it('应该引用CSS文件', () => {
    expect(htmlContent).toContain('href="css/styles.css"');
  });

  it('应该引用auth.js脚本', () => {
    expect(htmlContent).toContain('src="js/auth.js"');
  });
});