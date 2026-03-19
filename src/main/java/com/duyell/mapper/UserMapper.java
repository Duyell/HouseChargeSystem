package com.duyell.mapper;

import com.duyell.model.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @author 53473
 */
@Mapper
public interface UserMapper {
    /**
     * 获取所有用户信息
     * @return 用户列表
     */
    @Select("SELECT * FROM user")
    List<User> getAllUsers();

    /** 根据手机号查询用户
     * @param phone 手机号
     * @return 用户对象
     */
    @Select("SELECT * FROM user WHERE phone = #{phone}")
    User selectByPhone(String phone);

    /** 注册新用户
     * @param user 用户对象
     * @return 1表示成功，0表示失败
     * */
    @Insert("INSERT INTO user(user_id, name, phone, id_card, password, role) " +
            "VALUES(#{userId}, #{name}, #{phone}, #{idCard}, #{password}, #{role})")
    boolean insert(User user);

    /** 更新密码
     * @param user 用户对象
     * @return 1表示成功 0表示失败
     */
    @Update("UPDATE user SET password = #{password} WHERE phone = #{phone}")
    boolean updatePassword(User user);

    /**
     * 查询当前最大的用户ID序号（提取U后面的数字部分）
     * @return 最大的用户ID序号
     */
    @Select("SELECT MAX(CAST(SUBSTRING(user_id, 2) AS UNSIGNED)) FROM user")
    Integer selectMaxUserIdNum();
}
