package es.urjc.code.dad.ej2;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class playerService {
	
	private Map<String, Player> playerMap = new HashMap<String, Player>();
	
	public playerService() {
		
	}
	
	public Player getPlayer(String n) {
		return playerMap.get(n);
	}
	
	public List<Player> getPlayers(){
		return new ArrayList<Player>(playerMap.values());
	}
	
	public void addPlayer(Player p) {
		playerMap.put(p.getNombre(), p);
	}
	
	public void modPlayer(String name, int puntos) {
		Player p = playerMap.get(name);
		p.setPuntos(puntos);
		
	}
	
}
