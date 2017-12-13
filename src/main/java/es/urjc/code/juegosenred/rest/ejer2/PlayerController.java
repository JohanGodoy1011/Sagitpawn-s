package es.urjc.code.juegosenred.rest.ejer2;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;;


@RestController
public class PlayerController {

	@Autowired
	private playerService pS;
	
	
	@GetMapping("/jugadores")
	public List<Player> getJugadores() {
		return pS.getPlayers();
	}
	
	@GetMapping("/jugadores/{id}") 
	public ResponseEntity<Player> getJugador(@PathVariable String id) {
		if (pS.getPlayer(id) != null) {
			return new ResponseEntity<>(pS.getPlayer(id), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/jugadores/{id}/puntos")
	public int getPuntos(@PathVariable String id) {
		return (pS.getPlayer(id)).getPuntos();
	}
	
	@GetMapping("/jugadores/puntos")
	public int getPuntuacion() {
		return (pS.getPuntuacion());
	}

	
	@PostMapping("/jugadores")
	@ResponseStatus(HttpStatus.CREATED)
	public playerService postJugador(@RequestBody Player jugador) {
		pS.addPlayer(jugador);
		return pS;
	}
	
	@PutMapping("/jugadores/{id}")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public Player putPuntuacion(@PathVariable String id, @RequestBody Player play) {
		int a = play.getPuntos();
		pS.modPlayer(id, a);
		return pS.getPlayer(id);
	}
	
	
}
