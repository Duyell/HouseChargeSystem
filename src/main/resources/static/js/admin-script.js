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

        // 如果切换到查询广场或房产看台，加载数据
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

        // 显示结果
        displayProperties(properties);
    } catch (error) {
        console.error('查询房产失败:', error);
        alert('查询房产失败，请重试');
    }
}

// 显示房产列表
function displayProperties(properties) {
    const tableBody = document.getElementById('propertyTableBody');
    tableBody.innerHTML = '';

    if (properties.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">没有找到符合条件的房产</td></tr>';
        return;
    }

    properties.forEach(property => {
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
                <button class="edit-btn" data-id="${property.propertyId}">编辑</button>
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

    // 为编辑按钮添加事件
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const propertyId = this.getAttribute('data-id');
            loadPropertyForEdit(propertyId);
        });
    });
}

// 加载房产信息到编辑表单
async function loadPropertyForEdit(propertyId) {
    try {
        const response = await fetchWithToken(`/property/${propertyId}`);
        const property = await response.json();

        document.getElementById('editPropertyId').value = property.propertyId;
        document.getElementById('editBuildingId').value = property.buildingId || '';
        document.getElementById('editPropertyType').value = property.propertyType || '';
        document.getElementById('editBalconyDirection').value = property.balconyDirection || '';
        document.getElementById('editPropertyPrice').value = property.propertyPrice;
        document.getElementById('editBuildingArea').value = property.buildingArea;
        document.getElementById('editUsableArea').value = property.usableArea;
        document.getElementById('editFloor').value = property.floor;
        document.getElementById('editRoomStatus').value = property.roomStatus;

        // 显示编辑弹窗
        document.getElementById('editPropertyModal').style.display = 'flex';
    } catch (error) {
        console.error('加载房产信息失败:', error);
        alert('加载房产信息失败，请重试');
    }
}

// 关闭编辑弹窗
document.getElementById('closeEditModal').addEventListener('click', function() {
    document.getElementById('editPropertyModal').style.display = 'none';
});

document.getElementById('cancelEdit').addEventListener('click', function() {
    document.getElementById('editPropertyModal').style.display = 'none';
});

// 点击弹窗外部关闭
window.addEventListener('click', function(event) {
    const modal = document.getElementById('editPropertyModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// 处理编辑表单提交
document.getElementById('editPropertyForm').addEventListener('submit', async function(e) {
    e.preventDefault();



    let houseTypeImage = '';

    switch(document.getElementById('editPropertyType').value) {
        case '一室一厅':
            houseTypeImage = 'images/1R1T.jpg';
            break;
        case '两室一厅':
            houseTypeImage = 'images/2R1T.jpg';
            break;
        case '两室两厅':
            houseTypeImage = 'images/2R2T.jpg';
            break;
        case '三室一厅':
            houseTypeImage = 'images/3R1T.jpg';
            break;
        case '三室两厅':
            houseTypeImage = 'images/3R2T.jpg';
            break;
        case '四室及以上':
            houseTypeImage = 'images/4R.jpg';
            break;
        default:
            houseTypeImage = '';
    }

    // 收集表单数据
    const propertyData = {
        propertyId: document.getElementById('editPropertyId').value,
        buildingId: document.getElementById('editBuildingId').value,
        propertyType: document.getElementById('editPropertyType').value,
        balconyDirection: document.getElementById('editBalconyDirection').value,
        propertyPrice: parseFloat(document.getElementById('editPropertyPrice').value),
        buildingArea: parseFloat(document.getElementById('editBuildingArea').value),
        usableArea: parseFloat(document.getElementById('editUsableArea').value),
        floor: parseInt(document.getElementById('editFloor').value),
        houseTypeImg: houseTypeImage,
        roomStatus: document.getElementById('editRoomStatus').value === 'true'
    };

    // 验证
    if (isNaN(propertyData.propertyPrice) || propertyData.propertyPrice <= 0) {
        alert('请输入有效的价格');
        return;
    }

    if (!propertyData.buildingId) {
            alert('请选择所属楼盘');
            return;
    }

    try {
        // 发送更新请求
        const response = await fetchWithToken('/property/updateProperty', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(propertyData)
        });

        const result = await response.json();

        if (response.ok) {
            alert('房产信息更新成功');
            document.getElementById('editPropertyModal').style.display = 'none';
            // 重新加载房产列表
            searchProperties();
        } else {
            alert('更新失败: ' + (result.msg || '未知错误'));
        }
    } catch (error) {
        console.error('更新房产信息失败:', error);
        alert('更新房产信息失败，请重试');
    }
});

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
        document.getElementById('modalImg').src = "../"+property.houseTypeImg;
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


// 确保DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏切换逻辑（确保公司管理页面能正常显示）
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有导航按钮的活跃状态
            navBtns.forEach(b => b.classList.remove('active'));
            // 隐藏所有页面区块
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            // 激活当前导航和对应页面
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // 公司管理页面的标签页切换逻辑
    const tabBtns = document.querySelectorAll('.management-tabs .tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签按钮的活跃状态
            tabBtns.forEach(b => b.classList.remove('active'));
            // 隐藏所有标签内容
            document.querySelectorAll('#company-management .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            // 激活当前标签和对应内容
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
                // 切换到户型登记时加载楼盘列表
                if (tabId === 'house-type-register') {
                    loadBuildingNames();
                }
            }
        });
    });



    // 楼盘表单提交
    document.getElementById('buildingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        let isValid = true;

        // 验证必填字段
        const name = document.getElementById('buildingName').value.trim();
        if (!name) {
            document.getElementById('buildingNameError').textContent = '请输入楼盘名称';
            isValid = false;
        } else {
            document.getElementById('buildingNameError').textContent = '';
        }

        const address = document.getElementById('buildingAddress').value.trim();
        if (!address) {
            document.getElementById('buildingAddressError').textContent = '请输入楼盘地址';
            isValid = false;
        } else {
            document.getElementById('buildingAddressError').textContent = '';
        }

        if (isValid) {
            const formData = {
                buildingName: name,
                buildingAddress: address,
                buildingFeature: document.getElementById('buildingFeature').value.trim()
            };

            try {
                const response = await fetchWithToken('/building/addBuilding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                // 先判断HTTP响应状态
                if (!response.ok) {
                    throw new Error('网络响应异常');
                }

                const result = await response.json(); // 解析为JSON

                if (result.code === 0) { // 成功状态码
                    alert('楼盘登记成功！');
                    form.reset(); // 使用保存的表单引用重置
                    document.getElementById('buildingModal').style.display = 'none';
                    // 刷新楼盘列表
                    loadBuildings();
                } else {
                    // 后端返回的具体错误信息
                    alert('登记失败：' + result.message);
                }
            } catch (error) {
                console.error('提交失败:', error);
            }
        }
    });


    // 户型表单提交
    document.getElementById('houseTypeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        // 验证所属楼盘
        const buildingId = document.getElementById('buildingId').value;
        if (!buildingId) {
            document.getElementById('buildingIdError').textContent = '请选择所属楼盘';
            isValid = false;
        } else {
            document.getElementById('buildingIdError').textContent = '';
        }

        // 验证户型类型
        const propertyType = document.getElementById('housePropertyType').value;
        if (!propertyType) {
            document.getElementById('housePropertyTypeError').textContent = '请选择户型';
            isValid = false;
        } else {
            document.getElementById('housePropertyTypeError').textContent = '';
        }

        // 验证阳台方向
        let balconyDirection = document.getElementById('houseBalconyDirection').value;
        //东改成朝东
        if(balconyDirection == "东"){
            balconyDirection = "朝东";
        }else if(balconyDirection == "西"){
            balconyDirection = "朝西";
        }else if(balconyDirection == "南"){
            balconyDirection = "朝南";
        }else if(balconyDirection == "北"){
            balconyDirection = "朝北";
        }
        if (!balconyDirection) {
            document.getElementById('houseBalconyDirectionError').textContent = '请选择阳台方向';
            isValid = false;
        } else {
            document.getElementById('houseBalconyDirectionError').textContent = '';
        }

        // 验证价格
        let housePrice = document.getElementById('housePrice').value;
        housePrice = housePrice*10000;
        if (!housePrice || housePrice <= 0) {
            document.getElementById('housePriceError').textContent = '请输入有效的价格';
            isValid = false;
        } else {
            document.getElementById('housePriceError').textContent = '';
        }

        // 验证建筑面积
        const buildingArea = document.getElementById('houseBuildingArea').value;
        if (!buildingArea || buildingArea <= 0) {
            document.getElementById('houseBuildingAreaError').textContent = '请输入有效的建筑面积';
            isValid = false;
        } else {
            document.getElementById('houseBuildingAreaError').textContent = '';
        }

        // 验证使用面积
        const usableArea = document.getElementById('houseUsableArea').value;
        if (!usableArea || usableArea <= 0 || usableArea > buildingArea) {
            document.getElementById('houseUsableAreaError').textContent = '请输入有效的使用面积（不能大于建筑面积）';
            isValid = false;
        } else {
            document.getElementById('houseUsableAreaError').textContent = '';
        }

        // 验证楼层
        const floor = document.getElementById('houseFloor').value;
        if (!floor || floor <= 0) {
            document.getElementById('houseFloorError').textContent = '请输入有效的楼层';
            isValid = false;
        } else {
            document.getElementById('houseFloorError').textContent = '';
        }

        if (isValid) {
            // 根据户型类型生成户型图路径
            let houseTypeImage = '';
            switch(propertyType) {
                case '一室一厅':
                    houseTypeImage = 'images/1R1T.jpg';
                    break;
                case '两室一厅':
                    houseTypeImage = 'images/2R1T.jpg';
                    break;
                case '两室两厅':
                    houseTypeImage = 'images/2R2T.jpg';
                    break;
                case '三室一厅':
                    houseTypeImage = 'images/3R1T.jpg';
                    break;
                case '三室两厅':
                    houseTypeImage = 'images/3R2T.jpg';
                    break;
                case '四室及以上':
                    houseTypeImage = 'images/4R.jpg';
                    break;
                default:
                    houseTypeImage = '';
            }

            // 构建表单数据
            const formData = {
                buildingId: buildingId,
                propertyType: propertyType,
                balconyDirection: balconyDirection,
                propertyPrice: housePrice,
                buildingArea: buildingArea,
                usableArea: usableArea,
                floor: floor,
                houseTypeImg: houseTypeImage,
                roomStatus: false // 默认为未售状态
            };

            console.log('提交户型数据:', formData);

            // 发送数据到后端
            console.log('表单提交触发'); // 检查控制台是否输出
            fetchWithToken('/property/addProperty', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(result => {
                if (result.code === 0) {
                    alert('户型登记成功！');
                    this.reset(); // 重置表单
                } else {
                    alert('登记失败：' + result.message);
                }
            })
            .catch(error => {
                console.error('提交失败:', error);
                alert('网络错误，提交失败');
            });
        }
    });

    // 加载楼盘列表函数
    function loadBuildingNames() {
        // 从后端获取楼盘列表，并把楼盘名字并填充到下拉框
        const buildingSelect = document.getElementById('buildingId');
        buildingSelect.innerHTML = '';
        const buildingsResponse = fetchWithToken('/building/allBuildings');
        buildingsResponse.then(response => response.json()).then(buildings => {
            buildings.forEach(building => {
                const option = document.createElement('option');
                option.value = building.buildingId;
                option.textContent = building.buildingName;
                buildingSelect.appendChild(option);
            });
        });
    }

});
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


// 页面加载时获取所有楼盘信息
async function loadEditBuildings() {
    try {
        const response = await fetchWithToken('/building/allBuildings');
        const buildings = await response.json();

        const buildingSelect = document.getElementById('editBuildingId');
        buildings.forEach(building => {
            const option = document.createElement('option');
            option.value = building.buildingId;
            option.textContent = building.buildingName;
            buildingSelect.appendChild(option);
        });
    } catch (error) {
        console.error('加载楼盘信息失败:', error);
    }
}

// 在页面加载完成后调用
window.addEventListener('load', loadEditBuildings);

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





