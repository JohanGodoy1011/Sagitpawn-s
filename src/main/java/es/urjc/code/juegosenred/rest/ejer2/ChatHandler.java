package es.urjc.code.juegosenred.rest.ejer2;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ChatHandler extends TextWebSocketHandler {

	private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
	private ObjectMapper mapper = new ObjectMapper();
	private boolean turnChange = true;
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("New user: " + session.getId());
		sessions.put(session.getId(), session);
		
		try{
			
			ObjectNode newNode = mapper.createObjectNode();
			
			ObjectMapper mapper = new ObjectMapper();
			
			newNode.put("tipo", 0);
			
			int a = Integer.parseInt(newNode.get("tipo").asText()) + 1;
			
			ObjectNode usuario = mapper.createObjectNode();
			
			usuario.put("tipo", 1);
			usuario.put("usuario", session.getId()/*Integer.toString(usuario.size())*/);
			
			if( a == 1){
				try{
				//session.sendMessage(new TextMessage(session.getId().toString()));
				session.sendMessage(new TextMessage(usuario.toString()));
				System.out.println(usuario.toString());
				}catch(Exception e){
					e.printStackTrace();
				}
				System.out.println("Nº Sesión: " + session.getId());
			}
		}catch (Exception e){
			e.printStackTrace();
		}
   }
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Session closed: " + session.getId());
		sessions.remove(session.getId());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		
		
		JsonNode node = mapper.readTree(message.getPayload());
		
		int opcion = Integer.parseInt(node.get("tipo").asText());
		
		switch(opcion){
			
			case 0:
				// Nodo exclusivo para alterar la id
				JsonNode node1 = mapper.readTree(message.getPayload());
				
				for(WebSocketSession participant : sessions.values()) {
					
					if (participant.getId() == session.getId()){
						((ObjectNode)node1).put("id", session.getId());
						node1 = ((JsonNode)node1);
						participant.sendMessage(new TextMessage(node1.toString()));
					}
				}
				
				break;
		
			case 2:
				
				for(WebSocketSession participant : sessions.values()) {
					
					System.out.println(session.getId());
					if (participant.getId() != session.getId()){
						participant.sendMessage(new TextMessage(node.toString()));
					}
				}
				break;
				
			case 3:
				
				for(WebSocketSession participant : sessions.values()) {
					
					System.out.println(session.getId());
					if (participant.getId() != session.getId()){
						participant.sendMessage(new TextMessage(node.toString()));
					}
				}
				break;
				
				
			case 4:
				
				for(WebSocketSession participant : sessions.values()) {
									
					if (participant.getId() != session.getId()){
						turnChange = !turnChange;	
						participant.sendMessage(new TextMessage(node.toString()));
					}
				}
				System.out.println("Message sent: " + node.toString());
				break;
				
			default:
				break;
				
		}
		
	}


}
