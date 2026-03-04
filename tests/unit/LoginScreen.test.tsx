import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginScreen from '../../src/quantum/LoginScreen';

describe('LoginScreen Component', () => {
  const defaultProps = {
    loginUsername: '',
    loginPassword: '',
    loginError: '',
    onUsernameChange: vi.fn(),
    onPasswordChange: vi.fn(),
    onLogin: vi.fn(),
  };

  it('يجب أن يُعرض دون أخطاء', () => {
    render(<LoginScreen {...defaultProps} />);
    expect(document.body).toBeTruthy();
  });

  it('يجب أن يعرض عنوان النظام الكمي الثوري', () => {
    render(<LoginScreen {...defaultProps} />);
    expect(screen.getByText('النظام الكمي الثوري')).toBeInTheDocument();
    expect(screen.getByText('Revolutionary Quantum System')).toBeInTheDocument();
  });

  it('يجب أن يعرض حقل اسم المستخدم', () => {
    render(<LoginScreen {...defaultProps} />);
    const usernameInput = screen.getByPlaceholderText('أدخل اسم المستخدم الكمي');
    expect(usernameInput).toBeInTheDocument();
  });

  it('يجب أن يعرض حقل كلمة السر', () => {
    render(<LoginScreen {...defaultProps} />);
    const passwordInput = screen.getByPlaceholderText('أدخل كلمة السر الآمنة');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('يجب أن يعرض زر تسجيل الدخول', () => {
    render(<LoginScreen {...defaultProps} />);
    expect(screen.getByText('دخول النظام الثوري')).toBeInTheDocument();
  });

  it('يجب أن يستدعي onUsernameChange عند كتابة اسم المستخدم', () => {
    const onUsernameChange = vi.fn();
    render(<LoginScreen {...defaultProps} onUsernameChange={onUsernameChange} />);
    const input = screen.getByPlaceholderText('أدخل اسم المستخدم الكمي');
    fireEvent.change(input, { target: { value: 'testuser' } });
    expect(onUsernameChange).toHaveBeenCalledWith('testuser');
  });

  it('يجب أن يستدعي onPasswordChange عند كتابة كلمة السر', () => {
    const onPasswordChange = vi.fn();
    render(<LoginScreen {...defaultProps} onPasswordChange={onPasswordChange} />);
    const input = screen.getByPlaceholderText('أدخل كلمة السر الآمنة');
    fireEvent.change(input, { target: { value: 'mypassword' } });
    expect(onPasswordChange).toHaveBeenCalledWith('mypassword');
  });

  it('يجب أن يستدعي onLogin عند النقر على زر تسجيل الدخول', () => {
    const onLogin = vi.fn();
    render(<LoginScreen {...defaultProps} onLogin={onLogin} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('يجب أن يستدعي onLogin عند الضغط على Enter في حقل اسم المستخدم', () => {
    const onLogin = vi.fn();
    render(<LoginScreen {...defaultProps} onLogin={onLogin} />);
    const input = screen.getByPlaceholderText('أدخل اسم المستخدم الكمي');
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('يجب أن يستدعي onLogin عند الضغط على Enter في حقل كلمة السر', () => {
    const onLogin = vi.fn();
    render(<LoginScreen {...defaultProps} onLogin={onLogin} />);
    const input = screen.getByPlaceholderText('أدخل كلمة السر الآمنة');
    fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
    expect(onLogin).toHaveBeenCalledTimes(1);
  });

  it('يجب أن لا يعرض رسالة الخطأ عندما تكون فارغة', () => {
    render(<LoginScreen {...defaultProps} loginError="" />);
    expect(screen.queryByText('⚠️')).not.toBeInTheDocument();
  });

  it('يجب أن يعرض رسالة الخطأ عند فشل تسجيل الدخول', () => {
    render(<LoginScreen {...defaultProps} loginError="اسم المستخدم أو كلمة السر غير صحيح" />);
    expect(screen.getByText('اسم المستخدم أو كلمة السر غير صحيح')).toBeInTheDocument();
  });

  it('يجب أن يعرض القيم الممررة في حقول الإدخال', () => {
    render(<LoginScreen {...defaultProps} loginUsername="testuser" loginPassword="mypass" />);
    const usernameInput = screen.getByPlaceholderText('أدخل اسم المستخدم الكمي') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('أدخل كلمة السر الآمنة') as HTMLInputElement;
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('mypass');
  });

  it('يجب أن يعرض اسم المخترع', () => {
    render(<LoginScreen {...defaultProps} />);
    expect(screen.getByText('عبدالعزيز بن سلطان العتيبي')).toBeInTheDocument();
    expect(screen.getByText('Abdulaziz bin Sultan Al-Otaibi')).toBeInTheDocument();
  });
});
