import action.WSServer;
import com.google.gson.Gson;
import org.java_websocket.WebSocketImpl;
import utils.User;


public class Main {
    public static void main(String[] args) {
        System.out.println("成功启动");
        WebSocketImpl.DEBUG = false;
        int port = 8092; // 端口
        WSServer s = new WSServer(port);//实例化一个监听服务器
        s.start();//启动服务器
    }
}
