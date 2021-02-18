package utils;

import java.util.*;

import org.java_websocket.WebSocket;

public class WSUtils {

    private static final Map<WebSocket, String> wsUserMap = new HashMap<WebSocket, String>();
    private static final Map<String,Group>wsGroupMap=new HashMap();
    private static final Map<String,User>usernameMap=new HashMap();
    /**
     * 通过websocket连接获取其对应的用户
     *
     * @param conn
     * @return
     */
    public static String getUsernameByWs(WebSocket conn) {
        return wsUserMap.get(conn);
    }

    /**
     * 根据userName获取WebSocket,这是一个list,此处取第一个
     * 因为有可能多个websocket对应一个userName（但一般是只有一个，因为在close方法中，我们将失效的websocket连接去除了）
     */
    public static WebSocket getWsByUser(String userName) {
        Set<WebSocket> keySet = wsUserMap.keySet();
        synchronized (keySet) {
            for (WebSocket conn : keySet) {
                String cuser = wsUserMap.get(conn);
                if (cuser.equals(userName)) {
                    return conn;
                }
            }
        }
        return null;
    }

    /**
     * 向连接池中添加连接
     *
     */
    public static String addUser( WebSocket conn,User user) {
        // 添加连接
        wsUserMap.put(conn, user.username);
        if(!usernameMap.containsKey(user.username)){
            usernameMap.put(user.username,user);
        }
        Set<String>groupIdSet=wsGroupMap.keySet();
        //向对应用户组添加新成员（已存在时）或者创建新用户组
        if (groupIdSet.contains(user.groupId)){
            Group group=wsGroupMap.get(user.groupId);
            group.members.add(user.username);
        }else{
            Group group=Group.builder().creator(user.username).groupId(user.groupId)
                    .members(new HashSet()).build();
            //添加组长
            group.members.add(user.username);
            wsGroupMap.put(user.groupId,group);
        }

        return "success";
    }

    /**
     * 获取所有连接池中的用户，因为set是不允许重复的，所以可以得到无重复的user数组
     *
     * @return
     */
    public static Collection<String> getOnlineUser() {
        List<String> setUsers = new ArrayList<String>();
        Collection<String> setUser = wsUserMap.values();
        for (String u : setUser) {
            setUsers.add(u);
        }
        return setUsers;
    }

    /**
     * 移除连接池中的连接
     *
     */
    public static boolean removeUser(WebSocket conn) {
        if (wsUserMap.containsKey(conn)) {
            String username=getUsernameByWs(conn);
            //获取对应的用户和用户组
            User user=usernameMap.get(username);
            Group group=wsGroupMap.get(user.groupId);
            //组已经不存在
            if(group==null){
                wsUserMap.remove(conn); // 移除连接
                return true;
            }
            //项目创建者离开 解散该组
            if(group.creator.equals(username)){
                wsGroupMap.remove(user.groupId);
            } else{
                //成员离开
                group.members.remove(user.username);
            }
            wsUserMap.remove(conn); // 移除连接
            return true;
        } else {
            return false;
        }
    }

    /**
     * 在特定组的用户组内广播
     *
     */
    public static void sendMessageToGroupUser(WebSocket sender, String message) {
        Set<WebSocket> keySet = wsUserMap.keySet();
        //用户确实存在
        if (null == sender || null == wsUserMap.get(sender)){
            return;
        }
        String senderName=wsUserMap.get(sender);
        User user=usernameMap.get(senderName);
        Group group=wsGroupMap.get(user.groupId);
        synchronized (keySet){
            for(WebSocket conn : keySet){
                //如果是发送者或者不在组中，跳过
                if(sender==conn||!group.members.contains(wsUserMap.get(conn))){
                    continue;
                }
                String targetName = wsUserMap.get(conn);
                if ( targetName!= null) {
                    conn.send(message);
                }
            }
        }
    }

    /**
     * 向所有的用户发送消息
     *
     */
    public static void sendMessageToAll(String message,WebSocket creator) {
        Set<WebSocket> keySet = wsUserMap.keySet();
        synchronized (keySet) {
            for (WebSocket conn : keySet) {
                if(conn==creator){
                    continue;
                }
                String user = wsUserMap.get(conn);
                if (user != null) {
                    conn.send(message);
                }
            }
        }
    }

}
