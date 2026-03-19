package com.duyell.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
/**
 * @author 53473
 */
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Reservation {
    /**预订编号*/
    private String reservationId;
    /**关联用户编号*/
    private String userId;
    /**关联房产编号*/
    private String propertyId;
    /** 预订时间 */
    private LocalDateTime reservationTime;
    /** 扩展字段：用户名*/
    private String userName;
    /** 扩展字段：房产类型*/
    private String propertyType;
}
