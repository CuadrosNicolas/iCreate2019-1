import { AsyncStorage } from 'react-native';
/**
 * Fichier pour la gestion des sockets et le lancement de commande au serveur
 */
/**
 * Retourne la socket de communication
 */
export var getSocket = () => { alert("ERREUR") };
/**
 * Retourne l'adresse Ip du serveur
 */
export var getIp = ()=>{alert("ERREUR")};
/**
 * Initialise l'adresse ip du serveur
 * @param {*} ip Adresse ip
 */
export var setIp = (ip) => { AsyncStorage.setItem('server_ip', ip);};
/**
 * Fonction pour envoyer une ambiance à lancer sur le serveur
 * @param {*} name Nom de l'ambiance à lancer
 */
export function play_ambiance(name)
{
	getSocket().send(JSON.stringify({ cmd: "playa", arg: name })); // send a message
}
/**
 * Arrête une ambiance
 * @param {*} name Nom de l'ambiance à arrêter
 */
export function stop_ambiance(name) {
	getSocket().send(JSON.stringify({ cmd: "stopa", arg: name })); // send a message
}
/**
 * Stop tout les sons/ambiances en cours
 */
export function stopall() {
	getSocket().send(JSON.stringify({ cmd: "stopall", arg: "" })); // send a message
}
/**
 * Fonction pour envoyer un son à lancer sur le serveur
 * @param {*} name Nom du son à lancer
 */
export function play_sound(name,callback=0) {
	getSocket().send(JSON.stringify({ cmd: "play", arg: name })); // send a message
	getSocket().onmessage = (e) =>
	{
		if(callback)
			callback(e);
		getSocket().onmessage = ()=>{ }
	}
}
/**
 * Arrête un son en cours
 * @param {*} name Nom du son à arrêter
 */
export function stop_sound(name) {
	getSocket().send(JSON.stringify({ cmd: "stop", arg: name })); // send a message
}
/**
 * Charge la socket de connxion au serveur
 * @param {*} error
 */
export function load(error)
{
	/**
	 * Connect the phone to the sound server
	 */
	try
	{
		AsyncStorage.getItem('server_ip').then((server_ip =>{
		socket = new WebSocket('ws://'+server_ip+':8080', 'echo-protocol');
		getIp = () => { return server_ip };
		getSocket = () => { return socket };
		var started = false;
		socket.onopen = () => {
			started = true;
		};
		socket.onerror = (e) => {
			// an error occurred
			alert(e.message);
			error(e);
		};
		// Listen for messages
		socket.onmessage = (e) => {
		};
		socket.onclose = (e) => {
			if(started)
				alert("Erreur : Connexion au serveur interrompu");
			started = true;
		};
		}));
		return true;
	}
	catch(error)
	{
		alert("Erreur : L'adresse ip du serveur n'a pas été enregistré sur l'appareil");
		return false;
	}
}
export function setMessageHandler(handler)
{
	if(socket)
	{
		socket.onmessage = handler;
	}
	else
	{
		alert("The socket is not connected");
	}
}