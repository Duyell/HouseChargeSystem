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
public class LoginRequest {
    private String phone;
    private String password;
}
