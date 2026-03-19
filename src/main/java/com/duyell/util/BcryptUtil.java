package com.duyell.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
/**
 * @author 53473
 */
public class BcryptUtil {
    private static final BCryptPasswordEncoder ENCODER = new BCryptPasswordEncoder();

    /**
     * 加密密码
     * @param password 原始明文密码
     * @return 加密后的密码
     */
    public static String encode(String password) {
        return ENCODER.encode(password);
    }

    /**
     * 验证密码
     * @param rawPassword 原始明文密码（用户输入的密码）
     * @param encodedPassword 加密后的密码（数据库中保存的密码）
     * @return 验证结果，true表示验证成功，false表示验证失败
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return ENCODER.matches(rawPassword, encodedPassword);
    }
}
