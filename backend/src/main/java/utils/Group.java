package utils;

import lombok.Builder;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class Group {
    String creator;
    String groupId;
    HashSet<String> members;

}
