package com.duyell.controller;

import com.duyell.mapper.ReservationMapper;
import com.duyell.model.Reservation;
import com.duyell.model.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author 53473
 */
@RestController
@RequestMapping("/reservation")
public class ReservationController {
    private ReservationMapper reservationMapper;
    @Autowired
    public void setReservationMapper(ReservationMapper reservationMapper) {
        this.reservationMapper = reservationMapper;
    }

    @RequestMapping("/allReservation")
    public List<Reservation> getAllReservations() {
        return reservationMapper.selectAll();
    }

    /**
     * 新增预订记录
     */
    @PostMapping("/addReservation")
    public Result addReservation(@RequestBody Reservation reservation) {
        // 生成唯一预订ID,读取预订记录数量，R001
        String maxId = reservationMapper.selectMaxReservationId();
        int newIdNum = 1;
        if (maxId != null && !maxId.isEmpty()) {
            // 解析数字部分（R003 → 3）
            String numStr = maxId.substring(1);
            newIdNum = Integer.parseInt(numStr) + 1;
        }
        String reservationId = "R" + String.format("%03d", newIdNum);
        reservation.setReservationId(reservationId);
        // 设置预订时间（后端统一控制，避免前端时间不一致）
        reservation.setReservationTime(LocalDateTime.now());

        boolean success = reservationMapper.insert(reservation);
        return success ? Result.success(reservationId) : Result.error(500, "预订记录保存失败");
    }

    /**
     * 删除预订记录
     */
    @PostMapping("/deleteReservation")
    public Result deleteReservation(@RequestBody Reservation reservation) {
        boolean success = reservationMapper.deleteReservation(reservation.getUserId(), reservation.getPropertyId());
        return success ? Result.success(null) : Result.error(500, "预订记录删除失败");
    }

    /**
     * 根据用户ID查询预订记录
     */
    @RequestMapping("/reservationByUser")
    public List<Reservation> getReservationByUser(String userId) {
        return reservationMapper.selectByUser(userId);
    }
}
