package action;

import com.google.gson.Gson;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import utils.User;
import utils.WSUtils;

import java.net.InetSocketAddress;

public class WSServer extends WebSocketServer {


    public WSServer(int port) {
        super(new InetSocketAddress(port));
    }

    public WSServer(InetSocketAddress address) {
        super(address);
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        // ws连接的时候触发的代码，onOpen中我们不做任何操作
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        //断开连接时候触发代码
        userLeave(conn);
        System.out.println("closed");
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        String msg = "收到信息："+message;
        String[]infor=msg.split(" ");
        if (message.contains("login")) {
            User user =User.builder().username(infor[1]).groupId(infor[2]).password(infor[3]).build();
            System.out.println(message);
            userJoin(conn, user);//用户加入
        }
        WSUtils.sendMessageToGroupUser(conn, msg);
    }


    @Override
    public void onError(WebSocket conn, Exception ex) {
        //错误时候触发的代码
        System.out.println("on error");
        ex.printStackTrace();
    }
    /**
     * 去除掉失效的websocket链接
     * @param conn
     */
    private void userLeave(WebSocket conn){
        WSUtils.removeUser(conn);
    }

    /**
     * 将websocket加入用户池
     * @param conn
     * @param user
     */
    private void userJoin(WebSocket conn,User user){
        WSUtils.addUser(conn,user);
    }

}
