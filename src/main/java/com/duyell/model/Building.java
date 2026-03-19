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

public class Building {
    /**
     * 楼盘编号
     */
    private String buildingId;

    /**
     * 楼盘名称
     */
    private String buildingName;

    /**
     * 楼盘地址
     */
    private String buildingAddress;

    /**
     * 楼盘特点
     */
    private String buildingFeature;
}
