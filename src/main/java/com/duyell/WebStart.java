package com.duyell;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author 53473
 */
@SpringBootApplication
@MapperScan("com.duyell.mapper" )
public class WebStart {
    public static void main(String[] args) {
        SpringApplication.run(WebStart.class, args);
    }
}
