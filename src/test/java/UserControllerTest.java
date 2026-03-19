import com.duyell.WebStart;
import com.duyell.model.LoginResponseDto;
import com.duyell.model.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.duyell.model.LoginRequest;
import com.duyell.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = WebStart.class)
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // 测试注册
    @Test
    public void testRegister() throws Exception {
        User user = new User();
        user.setName("测试用户");
        user.setPhone("13900139000");
        user.setPassword("123456");
        user.setIdCard("110101199001011235");

        mockMvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk());
    }

    // 测试登录
    @Test
    public void testLogin() throws Exception {
        LoginRequest request = new LoginRequest("13900139000", "87654321");

        // 发送登录请求
        MvcResult result = mockMvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();
        String responseJson = result.getResponse().getContentAsString();
        Result loginResult = objectMapper.readValue(responseJson, Result.class);

        // 验证登录成功
        assertEquals(0, loginResult.getCode()); // 成功状态码
        assertNotNull(loginResult.getData()); // 有返回数据
        LoginResponseDto dto = objectMapper.convertValue(loginResult.getData(), LoginResponseDto.class);
        assertNotNull(dto.getToken()); // 生成了token
        // 解析响应体后打印

        System.out.println("登录接口返回数据：" + responseJson); // 打印完整JSON
    }
}