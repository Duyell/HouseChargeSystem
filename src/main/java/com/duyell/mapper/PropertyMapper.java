package com.duyell.mapper;

import com.duyell.model.Property;
import com.duyell.model.PropertyQuery;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author 53473
 */
@Mapper
public interface PropertyMapper {
    /**
     * 列出所有房源信息
     * @return 房源信息列表
     */
    @Select("SELECT * FROM property")
    List<Property> selectAll();

    /**
     * 根据房源ID查询房源信息
     * @param propertyId 房源ID
     * @return 房源信息
     */
    @Select("SELECT * FROM property WHERE property_id = #{propertyId}")
    Property selectById(String propertyId);

    /**
     * 根据条件查询房源信息
     * @param query 条件
     * @return 房源信息列表
     */
    List<Property> selectByCondition(PropertyQuery query);

    /**
     * 返回房源总数
     * @return 房源总数
     */
    @Select("SELECT COUNT(*) FROM property")
    int countAllProperties();

    /**
     * 房产登记
     * @param property 房产信息
     * @return true表示成功，false表示失败
     */
    @Insert("INSERT INTO property(property_id, property_type, balcony_direction, property_price, building_area, usable_area, floor, house_type_img, room_status, building_id) VALUES(#{propertyId}, #{propertyType}, #{balconyDirection}, #{propertyPrice}, #{buildingArea}, #{usableArea}, #{floor}, #{houseTypeImg}, #{roomStatus}, #{buildingId})")
    boolean insert(Property property);

    /**
     * 更新房产状态
     * @param propertyId 房产编号
     * @param roomStatus 状态
     * @return （1=成功，0=失败）
     */
    @Update("UPDATE property SET room_status = #{roomStatus} WHERE property_id = #{propertyId}")
    boolean updateStatus(@Param("propertyId") String propertyId, @Param("roomStatus") boolean roomStatus);

    /**
     * 更新房产完整信息（新增修改功能）
     * @param property 房产信息
     * @return 1=成功，0=失败
     */
    @Update("UPDATE property SET " +
            "property_type = #{propertyType}, " +
            "balcony_direction = #{balconyDirection}, " +
            "property_price = #{propertyPrice}, " +
            "building_area = #{buildingArea}, " +
            "usable_area = #{usableArea}, " +
            "floor = #{floor}, " +
            "house_type_img = #{houseTypeImg}, " +
            "building_id = #{buildingId} " +
            "WHERE property_id = #{propertyId}")
    boolean update(Property property);
}
