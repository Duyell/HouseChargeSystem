package com.duyell.controller;

import com.duyell.mapper.PropertyMapper;
import com.duyell.model.Property;
import com.duyell.model.PropertyQuery;
import com.duyell.model.PropertyStatusDTO;
import com.duyell.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author 53473
 */
@RestController
@RequestMapping("/property")
public class PropertyController {

    private PropertyMapper propertyMapper;
    @Autowired
    public void setPropertyMapper(PropertyMapper propertyMapper) {
        this.propertyMapper = propertyMapper;
    }
    /**
     * 查询所有房产
      */
    @GetMapping("/allProperties")
    public List<Property> getAllProperties() {
        return propertyMapper.selectAll();
    }

    /**
     * 测试查询单条房产
      */
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable String id) {
        return propertyMapper.selectById(id);
    }

    @GetMapping("/search")
    public List<Property> getPropertyByCondition(PropertyQuery query) {
        return propertyMapper.selectByCondition(query);
    }

    /**
     * 插入房产
     */
    @PostMapping("/addProperty")
    public Result addProperty(@RequestBody Property property) {
        int count = propertyMapper.countAllProperties();
        String propertyId = "P" + String.format("%03d", count + 1);
        property.setPropertyId(propertyId);
        boolean result =  propertyMapper.insert(property);
        return result? Result.success(propertyId) : Result.error(500, "插入失败");
    }

    /**
     * 更新房产状态（用于预订后修改为"已售"）
     * @param propertyId 房产编号
     */
    @PutMapping("/updateStatus/{propertyId}")
    public Result updatePropertyStatus(@PathVariable String propertyId, @RequestBody PropertyStatusDTO propertyStatusDTO) {
        boolean rows = propertyMapper.updateStatus(propertyId, propertyStatusDTO.getRoomStatus());
        return rows? Result.success("状态更新成功") : Result.error(404, "房产不存在或状态更新失败");

    }

    /**
     * 更新房产信息
     * @param property 房产信息
     */
    @PutMapping("/updateProperty")
    public Result updateProperty(@RequestBody Property property) {
        boolean rows = propertyMapper.update(property);
        return rows? Result.success("信息更新成功") : Result.error(404, "房产不存在或信息更新失败");
    }

}