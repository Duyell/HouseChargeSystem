// 获取表单元素
const loginForm = document.querySelector('.login-form');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');

// 表单提交事件处理
loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // 阻止表单默认提交行为

    // 获取输入值
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();

    // 简单验证
    if (!phone) {
        alert('请输入手机号');
        return;
    }
    if (!password) {
        alert('请输入密码');
        return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
        alert('请输入有效的手机号');
        return;
    }

    try {
        // 发送登录请求
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, password })
        });

        // 解析响应数据
        const result = await response.json();

        // 处理响应结果
        if (result.code === 0) {
            // 登录成功：保存token和用户信息
            const { token, userId, role } = result.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);

            // 根据角色跳转到不同页面（示例）
            if (role === '1') {
                window.location.href = 'user/index.html'; // C端用户首页
            } else if (role === '2') {
                window.location.href = 'admin/index.html'; // B端管理页
            }
        } else {
            // 登录失败：显示错误信息
            alert(result.message || '登录失败，请重试');
        }
    } catch (error) {
        console.error('登录请求失败:', error);
        alert('网络错误，请稍后重试');
    }
});