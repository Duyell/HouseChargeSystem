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
public class LoginResponseDto {
    /**
     * 用户 ID
     */
    private String userId;
    /**
     * 用户名称
     */
    private String name;
    /**
     * 用户角色
     */
    private String role;
    /**
     * Token
     */
    private String token;
    /** Token 过期时间戳*/
    private long expireTime;
}
