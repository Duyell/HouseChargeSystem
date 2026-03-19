package com.duyell.util;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * @author 53473
 */
@Aspect
@Component
public class DatabaseLogAspect {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseLogAspect.class);

    @Before("execution(* com.duyell.mapper.*Mapper.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("执行数据库操作：{}，参数：{}",
                joinPoint.getSignature().getName(),
                joinPoint.getArgs());
    }

    @AfterReturning(pointcut = "execution(* com.duyell.mapper.*Mapper.*(..))", returning = "result")
    public void logAfter(Object result) {
        logger.info("数据库操作结果：{}", result);
    }
}