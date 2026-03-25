package com.duyell.interceptor;

import com.duyell.util.JwtUtil;
import jakarta.servlet.http.*;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * @author 53473
 */
import com.duyell.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import java.io.PrintWriter;

public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//        // 1. 获取前端传的token请求头
//        String token = request.getHeader("token");
//        System.out.println("前端传入的Token：" + token); // 后端打印Token，方便排查
//
//        // 2. Token为空/无效 → 拦截，返回合法JSON+UTF-8编码
//        if (token == null || token.isEmpty() || !JwtUtil.validateToken(token)) {
//            // 关键：设置响应格式为JSON+UTF-8，解决乱码和解析失败
//            response.setContentType("application/json;charset=UTF-8");
//            response.setCharacterEncoding("UTF-8");
//            response.setStatus(401); // 401状态码
//
//            // 返回合法JSON响应体（前端能正常解析）
//            PrintWriter out = response.getWriter();
//            out.write("{\"code\":401,\"msg\":\"请先登录或Token失效\"}");
//            out.flush(); // 强制刷新输出流
//            out.close();
//            return false;
//        }
//
//        // 3. Token有效 → 解析用户信息并放行
//        request.setAttribute("userId", JwtUtil.getUserIdFromToken(token));
//        request.setAttribute("role", JwtUtil.getRoleFromToken(token));
//        request.setAttribute("expireTime", JwtUtil.getExpireTime());
        String jwt = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }
        // 2. Cookie里没有，从请求头读（接口请求用，你原本的逻辑）
        if (jwt == null) {
            jwt = request.getHeader("token");
        }
        // 3. 用你原本的JWT工具类验证（一字不改）
        if (jwt == null || !JwtUtil.validateToken(jwt)) {
            response.sendRedirect("/login.html"); // 未登录跳登录页
            return false;
        }
        // 4. 验证通过，放行（你原本的逻辑）
        request.setAttribute("userId", JwtUtil.getUserIdFromToken(jwt));
        request.setAttribute("role", JwtUtil.getRoleFromToken(jwt));
        return true; // 直接返回true，无需调用父类方法
    }
}
