package utils;

import lombok.*;

//每个用户只有一个讨论组
@Data
@Builder
public class User {
    String username;
    String groupId;
    String password;
}
