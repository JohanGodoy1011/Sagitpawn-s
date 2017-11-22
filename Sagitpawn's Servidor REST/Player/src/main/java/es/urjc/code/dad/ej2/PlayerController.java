package es.urjc.code.dad.ej2;
import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;;

@RestController
public class PlayerController {
	
	private List<Player> jugadores = new ArrayList<>();
	
	@GetMapping("/jugadores")
	public List<Player> getJugadores() {
		return jugadores;
	}
	
	@GetMapping("/jugadores/{id}") 
	public ResponseEntity<Player> getJugador(@PathVariable int id) {
		if (jugadores.get(id) != null) {
			return new ResponseEntity<>(jugadores.get(id), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping("/jugadores")
	@ResponseStatus(HttpStatus.CREATED)
	public Player postJugador(@RequestBody Player jugador) {
		jugadores.add(jugador);
		return jugador;
	}
		
	
	@PutMapping("/jugadores/{id}")
	@ResponseStatus(HttpStatus.ACCEPTED)
	public Player putAnuncio(@PathVariable int id, @RequestBody Player a) {
		jugadores.set(id, a);
		return jugadores.get(id);
	}
	
	
	@DeleteMapping("/jugadores/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Player delPlayer(@PathVariable int id) {
		return jugadores.remove(id);
	}

	@GetMapping("/jugadores/{id}/puntos")
	public int getPuntos(@PathVariable int id) {
		return (jugadores.get(id)).getPuntos();
	}
	
}
