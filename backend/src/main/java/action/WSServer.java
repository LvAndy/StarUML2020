package action;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
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
        System.out.println(msg);
        userJoin(conn,message);//用户加入
        WSUtils.sendMessageToAll(msg,conn);
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
     * @param userName
     */
    private void userJoin(WebSocket conn,String userName){
        WSUtils.addUser(userName, conn);
    }

}
