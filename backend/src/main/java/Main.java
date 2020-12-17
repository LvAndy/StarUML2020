import action.WSServer;
import org.java_websocket.WebSocketImpl;

public class Main {
    public static void main(String[] args) {
        WebSocketImpl.DEBUG = false;
        int port = 9090; // 端口
        WSServer s = new WSServer(port);//实例化一个监听服务器
        s.start();//启动服务器
    }
}
