package com.duyell.mapper;

import com.duyell.model.Building;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author 53473
 */
@Mapper
public interface BuildingMapper {
    /**
     * 查询所有建筑信息
     * @return 建筑信息列表
     */
    @Select("SELECT * FROM building ")
    List<Building> selectAll();

    /**
     * 插入建筑信息
     * @param building 建筑信息
     * @return true表示成功，false表示失败
     */
    @Insert("INSERT INTO building (building_id, building_name, building_address, building_feature) VALUES (#{buildingId}, #{buildingName}, #{buildingAddress}, #{buildingFeature})")
    boolean insert(Building building);

    /**
     * 查询楼盘总数
     * @return 楼盘总数
     */
    @Select("SELECT COUNT(*) FROM building")
    int countAllBuildings();
}
