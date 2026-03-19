package com.duyell.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author 53473
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    /** 0表示成功，1表示失败 */
    private int code;
    private String message;
    private T data;

    public static Result success(Object data) {
        return new Result<>(0, "成功", data);
    }

    public static<T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null);
    }
}
