package com.duyell.controller;

import com.duyell.model.LoginRequest;
import com.duyell.model.LoginResponseDto;
import com.duyell.model.Result;
import com.duyell.model.User;
import com.duyell.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author 53473
 */
@RestController
@RequestMapping("/user")
public class UserController {
    private UserService userService;
    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/allUsers")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @RequestMapping("/login")
    public Result login(@RequestBody LoginRequest loginRequest){
        LoginResponseDto loginInfo = userService.login(loginRequest.getPhone(), loginRequest.getPassword());
        if (loginInfo == null) {
            return Result.error(401, "手机号或密码错误");
        }
        return Result.success(loginInfo);
    }

    @RequestMapping("/register")
    public Result register(@RequestBody User user) {
        boolean success = userService.register(user);
        if (success) {
            return Result.success("注册成功");
        } else {
            return Result.error(400, "手机号已被注册");
        }
    }
}
