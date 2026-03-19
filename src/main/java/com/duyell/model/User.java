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
public class User {
    /** 用户编号*/
    private String userId;
    /** 姓名*/
    private String name;
    /** 手机号*/
    private String phone;
    /**身份证号*/
    private String idCard;
    /** 密码*/
    private String password;
    /** 角色标识（1=C端用户，2=B端公司管理人员）*/
    private String role;
}
