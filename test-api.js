const testApi = async () => {
    console.log('开始测试API...');

    try {
        console.log('正在请求 http://localhost:3000/auth/login');
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'same-origin',
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'admin123'
            })
        });

        console.log('响应状态:', response.status);
        const data = await response.json();
        console.log('响应数据:', data);
    } catch (error) {
        console.error('错误:', error);
    }
};

testApi();