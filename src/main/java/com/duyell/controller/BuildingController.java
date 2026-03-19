package com.duyell.controller;

import com.duyell.mapper.BuildingMapper;
import com.duyell.model.Building;
import com.duyell.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author 53473
 */
@RestController
@RequestMapping("/building")
public class BuildingController {
    private BuildingMapper buildingMapper;
    @Autowired
    public void setBuildingMapper(BuildingMapper buildingMapper) {
        this.buildingMapper = buildingMapper;
    }

    /**
     * 查询所有房产
     */
    @GetMapping("/allBuildings")
    public List<Building> getAllBuildings() {
        return buildingMapper.selectAll();
    }

    /**
     * 插入房产
     */
    @PostMapping("/addBuilding")
    public Result insertBuilding(@RequestBody Building building) {
        if( building.getBuildingName() == null || building.getBuildingAddress() == null || building.getBuildingFeature() == null){
            System.out.println("失败，楼盘名称、地址、特点不能为空！");
            return Result.error(400, "楼盘名称、地址、特点不能为空！");
        }
        int count = buildingMapper.countAllBuildings();
        //生成楼盘编号 B001, B002, B003, ...
        String buildingId = "B" + String.format("%03d", count + 1);
        building.setBuildingId(buildingId);
        boolean success = buildingMapper.insert(building);
        return success? Result.success(building) : Result.error(500, "插入失败！");
    }
}
