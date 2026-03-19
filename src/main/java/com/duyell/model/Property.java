package com.duyell.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author 53473
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Property {
    /**
     * 房产编号
     * 房产类型
     * 阳台方向
     * 房产价格
     * 建筑面积
     * 使用面积
     * 楼层
     * 户型图路径
     * 房产状态
     * 关联楼盘编号
     * 扩展字段：楼盘名称（用于前端展示）
     */
    private String propertyId;
    private String propertyType;
    private String balconyDirection;
    private Double propertyPrice;
    private Double buildingArea;
    private Double usableArea;
    private Integer floor;
    private String houseTypeImg;
    private Boolean roomStatus;
    private String buildingId;

}
