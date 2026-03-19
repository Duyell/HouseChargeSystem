package com.duyell.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * @author 53473
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PropertyQuery {
    /**房产类型（如“两室一厅”）*/
    private String propertyType;
    /** 阳台方向（“朝南”）*/
    private String balconyDirection;
    /** 价格范围*/
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    /** 建筑面积范围 */
    private BigDecimal minBuildArea;
    private BigDecimal maxBuildArea;
    /** 可用面积范围*/
    private BigDecimal minUsableArea;
    private BigDecimal maxUsableArea;
    /** 楼层范围*/
    private Integer minFloor;
    private Integer maxFloor;


}