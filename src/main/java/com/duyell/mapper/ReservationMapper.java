package com.duyell.mapper;

import com.duyell.model.Reservation;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author 53473
 */
@Mapper
public interface ReservationMapper {
    /**
     * 列出所有预订记录信息
     * @return 预订记录信息列表
     */
    @Select("SELECT * FROM reservation")
    List<Reservation> selectAll();

    /**
     * 统计所有预订记录数量
     * @return 预订记录数量
     */
    @Select("SELECT COUNT(*) FROM reservation")
    int countAllReservations();

    /**
     * 新增预订记录
     * @param reservation 预订信息
     * @return true表示成功，false表示失败
     */
    @Insert("INSERT INTO reservation (reservation_id, user_id, property_id, reservation_time) " +
            "VALUES (#{reservationId}, #{userId}, #{propertyId}, #{reservationTime})")
    boolean insert(Reservation reservation);

    /**
     * 根据用户Id和房源Id删除预订记录
     * @param userId 用户Id
     * @param propertyId 房源Id
     * @return true表示成功，false表示失败
     */
    @Delete("DELETE FROM reservation WHERE user_id = #{userId} AND property_id = #{propertyId}")
    boolean deleteReservation(String userId, String propertyId);

    /**
     * 根据用户id查询预订记录
     * @param userId 用户id
     * @return 预订记录列表
     */
    @Select("SELECT * FROM reservation WHERE user_id = #{userId}")
    List<Reservation> selectByUser(String userId);

    /**
     * 查询最大id
     * @return 最大id
     */
    @Select("SELECT MAX(reservation_id) FROM reservation")
    String selectMaxReservationId();
}
