package com.duyell.util;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类：生成 Token、验证 Token、解析 Token 中的信息
 * @author 53473
 */
@Component
public class JwtUtil {



    /** 从配置文件读取密钥和过期时间*/
    private static JwtProperties jwtProperties;
    @Autowired
    public void setJwtProperties(JwtProperties jwtProperties) {
        JwtUtil.jwtProperties = jwtProperties;
    }
    /** 2. 生成签名密钥（内部使用）*/
    private static SecretKey getSecretKey() {
        // 对密钥进行 Base64 编码，确保符合 JWT 要求
        byte[] keyBytes = Base64.getDecoder().decode(jwtProperties.getSecretKey());
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    /**
     * 生成 Token
     * @param userId 用户 ID（放入 Token 的核心信息）
     * @param role 用户角色（如 "1"=普通用户，"2"=管理员，用于权限控制）
     * @return 生成的 Token 字符串
     */
    public static String generateToken(String userId, String role) {
        // 过期时间：当前时间 + 过期时长
        Date expirationDate = new Date(System.currentTimeMillis() + jwtProperties.getExpirationTime());

        // 自定义负载（放入用户 ID、角色等非敏感信息）
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);

        // 生成 Token
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(expirationDate)
                .signWith(getSecretKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 验证 Token 有效性
     * @param token 待验证的 Token
     * @return 验证通过返回 true，否则 false（无效/过期/篡改均返回 false）
     */
    public static boolean validateToken(String token) {
        try {
            // 解析 Token 并验证签名和过期时间
            Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // 捕获所有异常（过期、签名错误、格式错误等）
            return false;
        }
    }

    /**
     * 从 Token 中解析用户 ID
     * @param token 有效的 Token
     * @return 用户 ID（若 Token 无效返回 null）
     */
    public static String getUserIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("userId", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 从 Token 中解析用户角色
     * @param token 有效的 Token
     * @return 用户角色（若 Token 无效返回 null）
     */
    public static String getRoleFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSecretKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 获取 Token 过期时间（用于前端提前刷新）
     * @return 过期时间戳（毫秒）
     */
    public static long getExpireTime() {
        return System.currentTimeMillis() + jwtProperties.getExpirationTime();
    }
}