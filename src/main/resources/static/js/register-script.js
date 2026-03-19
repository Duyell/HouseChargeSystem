// 表单验证与提交逻辑
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 阻止表单默认提交

    // 获取表单数据
    const userData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        idCard: document.getElementById('idCard').value.trim(),
        password: document.getElementById('password').value.trim(),
        confirmPassword: document.getElementById('confirmPassword').value.trim()
    };

    // 验证结果标记
    let isValid = true;

    // 姓名验证
    if (userData.name.length < 2 || userData.name.length > 20) {
        showError('nameError', '姓名长度必须在2-20位之间');
        isValid = false;
    } else {
        hideError('nameError');
    }

    // 手机号验证（11位数字）
    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(userData.phone)) {
        showError('phoneError', '请输入正确的手机号');
        isValid = false;
    } else {
        hideError('phoneError');
    }

    // 身份证号验证（18位）
    const idCardReg = /^\d{17}[\dXx]$/;
    if (!idCardReg.test(userData.idCard)) {
        showError('idCardError', '请输入正确的身份证号');
        isValid = false;
    } else {
        hideError('idCardError');
    }

    // 密码验证
    if (userData.password.length < 6) {
        showError('passwordError', '密码长度不能少于6位');
        isValid = false;
    } else {
        hideError('passwordError');
    }

    // 确认密码验证
    if (userData.password !== userData.confirmPassword) {
        showError('confirmError', '两次密码输入不一致');
        isValid = false;
    } else {
        hideError('confirmError');
    }

    // 验证通过则提交
    if (isValid) {
        // 移除确认密码字段（后端不需要）
        delete userData.confirmPassword;

        // 发送注册请求
        fetch('/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(result => {
            if (result.code === 0) {
                alert('注册成功，即将跳转到登录页');
                window.location.href = 'login.html'; // 跳转到登录页
            } else {
                alert('注册失败：' + result.message);
            }
        })
        .catch(error => {
            console.error('注册请求失败：', error);
            alert('网络错误，请稍后重试');
        });
    }
});

// 显示错误提示
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.previousElementSibling.classList.add('input-error');
}

// 隐藏错误提示
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    errorElement.style.display = 'none';
    errorElement.previousElementSibling.classList.remove('input-error');
}

// 输入框实时验证
const inputs = document.querySelectorAll('.register-form input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        const errorId = this.id + 'Error';
        hideError(errorId);
    });
});