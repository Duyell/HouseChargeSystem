// 页面导航切换
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 移除所有活跃状态
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        // 添加当前活跃状态
        this.classList.add('active');
        const sectionId = this.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');

        // 首次切换到查询广场时加载所有数据，后续切换不重复加载
        if (sectionId === 'search' && !window.searchInitialized) {
            searchProperties();
            window.searchInitialized = true; // 标记为已初始化
        } else if (sectionId === 'buildings') {
            loadBuildings();
        }
    });
});

// 查询房产
document.getElementById('searchBtn').addEventListener('click', searchProperties);

// 重置查询条件
document.getElementById('resetBtn').addEventListener('click', function() {
    document.querySelectorAll('#search input, #search select').forEach(el => {
        el.value = '';
    });
});

// 关闭详情弹窗
document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('propertyModal').style.display = 'none';
});

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('propertyModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 查询房产数据
async function searchProperties() {
    // 构建查询参数
    const query = {
        propertyType: document.getElementById('propertyType').value,
        balconyDirection: document.getElementById('balconyDirection').value,
        minPrice: document.getElementById('minPrice').value ? parseFloat(document.getElementById('minPrice').value) * 10000 : null,
        maxPrice: document.getElementById('maxPrice').value ? parseFloat(document.getElementById('maxPrice').value) * 10000 : null,
        minBuildArea: document.getElementById('minBuildArea').value ? parseFloat(document.getElementById('minBuildArea').value) : null,
        maxBuildArea: document.getElementById('maxBuildArea').value ? parseFloat(document.getElementById('maxBuildArea').value) : null,
        minUsableArea: document.getElementById('minUsableArea').value ? parseFloat(document.getElementById('minUsableArea').value) : null,
        maxUsableArea: document.getElementById('maxUsableArea').value ? parseFloat(document.getElementById('maxUsableArea').value) : null,
        minFloor: document.getElementById('minFloor').value ? parseInt(document.getElementById('minFloor').value) : null,
        maxFloor: document.getElementById('maxFloor').value ? parseInt(document.getElementById('maxFloor').value) : null
    };

    // 参数验证
    const errors = []; // 收集错误信息

    // 类型检查
    if (query.minPrice !== null && isNaN(query.minPrice)) {
        errors.push('最低价格必须是有效的数字');
    }
    if (query.maxPrice !== null && isNaN(query.maxPrice)) {
        errors.push('最高价格必须是有效的数字');
    }
    if (query.minBuildArea !== null && isNaN(query.minBuildArea)) {
        errors.push('最小建筑面积必须是有效的数字');
    }
    if (query.maxBuildArea !== null && isNaN(query.maxBuildArea)) {
        errors.push('最大建筑面积必须是有效的数字');
    }
    if (query.minUsableArea !== null && isNaN(query.minUsableArea)) {
        errors.push('最小使用面积必须是有效的数字');
    }
    if (query.maxUsableArea !== null && isNaN(query.maxUsableArea)) {
        errors.push('最大使用面积必须是有效的数字');
    }
    if (query.minFloor !== null && isNaN(query.minFloor)) {
        errors.push('最低楼层必须是有效的整数');
    }
    if (query.maxFloor !== null && isNaN(query.maxFloor)) {
        errors.push('最高楼层必须是有效的整数');
    }

    // 值范围检查
    if (query.minPrice !== null && query.minPrice < 0) {
        errors.push('最低价格不能为负数');
    }
    if (query.maxPrice !== null && query.maxPrice < 0) {
        errors.push('最高价格不能为负数');
    }
    if (query.minBuildArea !== null && query.minBuildArea < 0) {
        errors.push('最小建筑面积不能为负数');
    }
    if (query.maxBuildArea !== null && query.maxBuildArea < 0) {
        errors.push('最大建筑面积不能为负数');
    }
    if (query.minUsableArea !== null && query.minUsableArea < 0) {
        errors.push('最小使用面积不能为负数');
    }
    if (query.maxUsableArea !== null && query.maxUsableArea < 0) {
        errors.push('最大使用面积不能为负数');
    }
    if (query.minFloor !== null && query.minFloor <= 0) {
        errors.push('最低楼层必须是正整数');
    }
    if (query.maxFloor !== null && query.maxFloor <= 0) {
        errors.push('最高楼层必须是正整数');
    }

    // 逻辑检查（范围合理性）
    if (query.minPrice !== null && query.maxPrice !== null && query.minPrice > query.maxPrice) {
        errors.push('最低价格不能大于最高价格');
    }
    if (query.minBuildArea !== null && query.maxBuildArea !== null && query.minBuildArea > query.maxBuildArea) {
        errors.push('最小建筑面积不能大于最大建筑面积');
    }
    if (query.minUsableArea !== null && query.maxUsableArea !== null && query.minUsableArea > query.maxUsableArea) {
        errors.push('最小使用面积不能大于最大使用面积');
    }
    if (query.minFloor !== null && query.maxFloor !== null && query.minFloor > query.maxFloor) {
        errors.push('最低楼层不能大于最高楼层');
    }

    // 如果有错误，弹窗提示并终止查询
    if (errors.length > 0) {
        alert('查询参数错误：\n' + errors.join('\n')); // 用换行分隔多个错误
        return; // 不执行后续查询
    }

    try {
        // 构建查询URL
        let url = '/property/search?';
        Object.entries(query).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                url += `${key}=${encodeURIComponent(value)}&`;
            }
        });

        // 发送请求
        const response = await fetchWithToken(url);
        const properties = await response.json();

        // 获取当前用户的预订记录
        const reservationsResponse = await fetchWithToken(`/reservation/reservationByUser?userId=${localStorage.getItem('userId')}`);
        const reservations = await reservationsResponse.json();

        // 传入预订记录到显示函数
        displayProperties(properties, reservations);

    } catch (error) {
        console.error('查询房产失败:', error);
        alert('查询房产失败，请重试');
    }
}

// 显示房产列表
function displayProperties(properties,reservations) {
    const tableBody = document.getElementById('propertyTableBody');
    tableBody.innerHTML = '';

    if (properties.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">没有找到符合条件的房产</td></tr>';
        return;
    }

    properties.forEach(property => {
        // 判断是否是当前用户预订的房产
        const isUserReserved = reservations.some(reservation => reservation.propertyId === property.propertyId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${property.propertyId}</td>
            <td>${property.propertyType || '-'}</td>
            <td>${property.balconyDirection || '-'}</td>
            <td>${property.propertyPrice.toFixed(2)}</td>
            <td>${property.buildingArea.toFixed(2)}</td>
            <td>${property.floor}</td>
            <td>${property.roomStatus ?  '已售' : '可预订'}</td>
            <td>
                <button class="view-btn" data-id="${property.propertyId}">查看详情</button>
                ${!property.roomStatus ? `<button class="book-btn" data-id="${property.propertyId}">预订</button>` : ''}
                ${isUserReserved ? `<button class="cancel-btn" data-id="${property.propertyId}">取消预订</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });

    // 为查看详情按钮添加事件
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-id');
            showPropertyDetail(propertyId);
        });
    });

    // 为预订按钮添加事件
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const propertyId = this.getAttribute('data-id');
            // 显示确认提示框
            if (confirm('确定要预订该房产吗？预订后将锁定该房源，请及时完成后续流程。')) {
                try {
                    // 1. 调用后端预订接口，保存预订记录
                    const userId = localStorage.getItem('userId'); // 从本地存储获取当前用户ID
                    const reservationResponse = await fetchWithToken('/reservation/addReservation', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: userId,
                            propertyId: propertyId,

                        })
                    });

                    if (!reservationResponse.ok) {
                        throw new Error('预订失败，请重试');
                    }

                    // 2. 调用后端接口，修改房产状态为"已售"（roomStatus=true）
                    const updateResponse = await fetchWithToken(`/property/updateStatus/${propertyId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ roomStatus: true })
                    });

                    if (!updateResponse.ok) {
                        throw new Error('更新房产状态失败');
                    }

                    // 3. 提示成功并刷新列表
                    alert('预订成功！');
                    searchProperties();
                } catch (error) {
                    console.error('预订出错:', error);
                    alert(error.message);
                }
            }
        });
    });

    // 在预订按钮事件监听后添加
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const propertyId = this.getAttribute('data-id');
            if (confirm('确定要取消预订该房产吗？')) {
                try {
                    const userId = localStorage.getItem('userId');

                    // 1. 删除预订记录
                    const deleteResponse = await fetchWithToken(`/reservation/deleteReservation`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: userId,
                            propertyId: propertyId
                        })
                    });

                    if (!deleteResponse.ok) {
                        throw new Error('取消预订失败，请重试');
                    }

                    // 2. 更新房产状态为可预订
                    const updateResponse = await fetchWithToken(`/property/updateStatus/${propertyId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ roomStatus: false })
                    });

                    if (!updateResponse.ok) {
                        throw new Error('更新房产状态失败');
                    }

                    // 3. 提示成功并刷新列表
                    alert('取消预订成功！');
                    searchProperties();
                } catch (error) {
                    console.error('取消预订出错:', error);
                    alert(error.message);
                }
            }
        });
    });
}

// 显示房产详情
async function showPropertyDetail(propertyId) {
    try {
        const response = await fetchWithToken(`/property/${propertyId}`);
        const property = await response.json();

        // 获取关联的楼盘信息
        let buildingName = '未知楼盘';
        try {
            const buildingResponse = await fetchWithToken('/building/allBuildings');
            const buildings = await buildingResponse.json();
            const building = buildings.find(b => b.buildingId === property.buildingId);
            if (building) {
                buildingName = building.buildingName;
            }
        } catch (e) {
            console.error('获取楼盘信息失败:', e);
        }

        // 填充弹窗内容
        document.getElementById('modalTitle').textContent = `${property.propertyType} - ${buildingName}`;
        document.getElementById('modalImg').src = "../"+property.houseTypeImg ;
        document.getElementById('modalImg').alt = `${property.propertyType}户型图`;

        const modalInfo = document.getElementById('modalInfo');
        modalInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">房产编号:</span>
                <span>${property.propertyId}</span>
            </div>
            <div class="info-item">
                <span class="info-label">房产类型:</span>
                <span>${property.propertyType || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">阳台方向:</span>
                <span>${property.balconyDirection || '-'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">价格:</span>
                <span>${property.propertyPrice.toFixed(2)}万元</span>
            </div>
            <div class="info-item">
                <span class="info-label">建筑面积:</span>
                <span>${property.buildingArea.toFixed(2)}㎡</span>
            </div>
            <div class="info-item">
                <span class="info-label">使用面积:</span>
                <span>${property.usableArea.toFixed(2)}㎡</span>
            </div>
            <div class="info-item">
                <span class="info-label">楼层:</span>
                <span>${property.floor}</span>
            </div>
            <div class="info-item">
                <span class="info-label">楼盘名称:</span>
                <span>${buildingName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">状态:</span>
                <span>${property.roomStatus ?  '已售' : '可预订' }</span>
            </div>
        `;

        // 显示弹窗
        document.getElementById('propertyModal').style.display = 'flex';
    } catch (error) {
        console.error('获取房产详情失败:', error);
        alert('获取房产详情失败，请重试');
    }
}



// 加载楼盘信息
async function loadBuildings() {
    try {
        // 获取所有楼盘
        const buildingResponse = await fetchWithToken('/building/allBuildings');
        const buildings = await buildingResponse.json();

        // 获取所有房产和预订信息
        const propertyResponse = await fetchWithToken('/property/allProperties');
        const properties = await propertyResponse.json();

        const reservationResponse = await fetchWithToken('/reservation/allReservation');
        const reservations = await reservationResponse.json();

        // 显示楼盘列表
        displayBuildings(buildings, properties, reservations);
    } catch (error) {
        console.error('加载楼盘信息失败:', error);
        alert('加载楼盘信息失败，请重试');
    }
}

// 显示楼盘列表
function displayBuildings(buildings, properties, reservations) {
    const buildingList = document.getElementById('buildingList');
    buildingList.innerHTML = '';

    if (buildings.length === 0) {
        buildingList.innerHTML = '<p>暂无楼盘信息</p>';
        return;
    }

    buildings.forEach(building => {
        // 计算该楼盘的总房产数和已预订数
        const buildingProperties = properties.filter(p => p.buildingId === building.buildingId);
        const total = buildingProperties.length;

        // 计算已预订数量
        let reserved = buildingProperties.filter(p => p.roomStatus == true).length;


        // 创建楼盘卡片
        const card = document.createElement('div');
        card.className = 'building-card';
        card.innerHTML = `
            <div class="building-img">
                <img src="../images/${building.buildingName}.jpg" alt="${building.buildingName}">
            </div>
            <div class="building-info">
                <h3 class="building-name">${building.buildingName}</h3>
                <p class="building-address">地址: ${building.buildingAddress}</p>
                <p class="building-feature">特点: ${building.buildingFeature || '暂无信息'}</p>
                <p class="booking-rate">预订情况: ${reserved}/${total} (${total > 0 ? Math.round(reserved / total * 100) : 0}%)</p>
            </div>
        `;
        buildingList.appendChild(card);
    });
}

 // 登出功能实现
document.querySelector('.logout-btn').addEventListener('click', function() {
    if(confirm('确定要退出登录吗？')) {
        // 清除本地存储的用户信息
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');


        // 跳转到登录页
        window.location.href = '../login.html';
    }
});

// ========== 新增：全局带Token的fetch封装（核心修复） ==========
async function fetchWithToken(url, options = {}) {
    // 从本地取登录时保存的token
    const token = localStorage.getItem('token');

    if(!token){
        window.location.href = '../login.html';
        return;
    }
    // 合并请求头，自动带上token（和后端拦截器约定的字段一致）
    options.headers = {
        'Content-Type': 'application/json', // 保持原有Content-Type
        'token': token , // 关键：添加token请求头
        ...options.headers // 保留原有请求头（比如PUT/POST的Content-Type）
    };
    // 发送请求并返回响应

    return fetch(url, options);
}