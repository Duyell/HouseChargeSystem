package com.duyell.service;

import com.duyell.mapper.UserMapper;
import com.duyell.model.LoginResponseDto;
import com.duyell.model.User;
import com.duyell.util.BcryptUtil;
import com.duyell.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author 53473
 */

@Service
public class UserService {
    private UserMapper userMapper;
    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    /**
     * 生成新用户ID
     */
    private String generateUserId() {
        // 读取数据库中的用户数量，加1，再在前面加U，得到U001的格式
        int count = userMapper.selectMaxUserIdNum() + 1;
        return "U" + String.format("%03d", count);
    }
    /** 用户注册（加密密码）
     * @param user 用户对象
     * @return true 注册成功，false 注册失败
     */
    public boolean register(User user) {
        // 1. 检查手机号是否已注册
        if (userMapper.selectByPhone(user.getPhone()) != null) {
            return false;
        }
        // 2. 生成用户ID
        user.setUserId(generateUserId());
        // 3. 默认角色为C端用户（1）
        user.setRole("1");
        // 4. 对密码进行 BCrypt 加密
        String encryptedPassword = BcryptUtil.encode(user.getPassword());
        user.setPassword(encryptedPassword);
        // 5. 存入数据库
        return userMapper.insert(user);
    }

    /**
     * 用户登录
     * @param phone 手机号
     * @param password 密码（明文）
     * @return true 登录成功，false 登录失败
     */
    public LoginResponseDto login(String phone, String password) {
        // 1. 从数据库中查询用户信息
        User user = userMapper.selectByPhone(phone);
        if (user == null) {
            return null;
        }
        // 2. 对密码进行 BCrypt 验证
        String encryptedPassword = user.getPassword();
        if (!BcryptUtil.matches(password, encryptedPassword)) {
            return null;
        }
        // 3. 生成 JWT 令牌
        String jwtToken = JwtUtil.generateToken(user.getUserId(), user.getRole());
        // 4. 返回登录类
        LoginResponseDto loginResponseDto = new LoginResponseDto();
        loginResponseDto.setUserId(user.getUserId());
        loginResponseDto.setName(user.getName());
        loginResponseDto.setRole(user.getRole());
        loginResponseDto.setToken(jwtToken);
        loginResponseDto.setExpireTime(JwtUtil.getExpireTime());
        return loginResponseDto;
    }


    public List<User> getAllUsers() {
        return userMapper.getAllUsers();
    }
}
