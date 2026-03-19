package com.duyell.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author 53473
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")

public class JwtProperties {
    /**
     * 读取配置文件中的jwt相关配置
     */
    private String secretKey;
    private long expirationTime;
}