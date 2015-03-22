//////////////////////////////
// Plugin PushingBox for SARAH
//
// Author: Sailman 83
//
//////////////////////////////
exports.action = function(data, callback, config, SARAH) 
{
	//http://127.0.0.1:8080/sarah/PushingBox?qui=Thomas&titre=Message&dictation=test
	// RECUPERATION DE LA CONFIG
	var config = config.modules.PushingBox;
	var retour = statut(500,'Variable non implementé','La variable de retour n\'a pas était modifier, ceci et la déclaration de la variablesss');
	// VERIFICATION DES DATA ET CONFIGURATION MINIMAL DU PLUGIN
	if (!data.message)
		data.dictation =data.dictation;
	else
		data.dictation =data.message;
	if (!data.dictation ||!data.qui)
		return callback(statut(501,'Appel invalide','Je n\'ai pas compris la demande, veillez la reformuler'));
    else
    {
		if (!data.dictation)
			data.message =data.dictation;
		if ((!config.ID_Utilisateur_1)||(config.ID_Utilisateur_1 == ''))
			return callback(statut(501,'Config invalide','Clé API non saisie pour l\'utilsateur principal'));
		
		//DEFINITION DES VARIABLES
		var nom_utilisateur ='';
		var url ='';
		var request = require ("request");
			//CLE PAR DEFAUT 
		var api_key_default = config.ID_Utilisateur_1;	
			// NOM DE L'UTILISATEUR ENTRE DANS LE XML
		var utilisateur = data.qui;
			// RECUPERATION DU MESSAGE		
		var dictation = data.dictation;
			// SUPPRESSION DE LA PARTI D'ODRE DONNE POUR SARAH
		dictation = dictation.replace(/Sarah dis a/g,' ').replace(/Sarah dit a/g,' ').replace(/Sarah dit à/g,' ');

		// SELECTION DE L'UTILISATEUR
		switch(utilisateur)
		{ 
			// POUR CHAQUE UTILISATEUR VERIFICATION DE LA CONFIG
			// RECUPERATION DU NOM ET DE L'ID
			case config.Nom_Utilisateur_1:
				api_key = api_key_default;
				nom_utilisateur = config.Nom_Utilisateur_1;
				break;
			case config.Nom_Utilisateur_2:
				if ((!config.ID_Utilisateur_2)||(config.ID_Utilisateur_2 == ''))
					return callback(statut(501,'Config invalide','Clé API 2 non saisie pour l\'utilisateur'));
				nom_utilisateur = config.Nom_Utilisateur_2;
				api_key = config.ID_Utilisateur_2;
				break;
			case config.Nom_Utilisateur_3:
				if ((!config.ID_Utilisateur_3)||(config.ID_Utilisateur_3 == ''))
					return callback(statut(501,'Config invalide','Clé API 3 non saisie pour l\'utilisateur'));
				nom_utilisateur = config.Nom_Utilisateur_3;
				api_key = config.ID_Utilisateur_3;
				break;
			case config.Nom_Utilisateur_4:
				if ((!config.ID_Utilisateur_4)||(config.ID_Utilisateur_4 == ''))
					return callback(statut(501,'Config invalide','Clé API 4 non saisie pour l\'utilisateur'));
				nom_utilisateur = config.Nom_Utilisateur_4;
				api_key = config.ID_Utilisateur_4;
				break;
			default:
				return callback(statut(501,'Config ou appel invalide','Utilisateur non reconnu'));
		}
		// CREATION DE L'URL POUR LE SERVICE PUSHINGBOX.COM
		url = "http://api.pushingbox.com/pushingbox?devid="+api_key+"&titre="+data.titre+"&msg="+dictation;
		
		// ENVOI DE LA REQUE AU SERVICE
		request({'uri' : url}, 
                function (err, response, body) 
                {
                    if (!err)
                    {
                        if(response.statusCode == 200) 
                            retour = statut(200,'OK',"Message envoyé à " + nom_utilisateur);
                    }
                    else
                        retour = statut(response.statusCode);
                    callback(retour);
                });
	}		
}

var statut = function(code,message,signification,tts)
{
	//DETAIL DES CODES STATUT http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	//DECLARATION DES VARIABLES
	var retour='';
	var data = '{"code":"","message":"","signification":"","tts":""}';
	// TRANSFORMATION DU JSON AU FORMAT STRING EN OBJET JSON
	var objet = JSON.parse(data);	
	// MESSAGE INDICANT UN MAUVAISE APPEL DE LA FONCTION
	if (!code)
    {
		objet.code='501';
		objet.message='Code statut manquant';
		objet.signification='La fonction a était appelé sans code de statut';
		objet.tts=objet.signification;
		return objet;
	}
    else 
		// DEFINITION DU CODE DE RETOUR
		objet.code=code;
	// MESSAGE PAR DEFAUT SI PAS DE MESSAGE
	if (!message)
		objet.message='Code : '+objet.code;
	else
		// DEFINITION DU MESSAGE DE RETOUR
		objet.message=message;
	// SIGNIFICATION PAR DEFAUT SI PAS DE SIGNIFICATION
	if (!signification)
		objet.signification='Le code de statut '+objet.code +' a était retourné';
	else
		// DEFINITION DU SIGNIFICATION DE RETOUR
		objet.signification=signification;
	// TTS PAR DEFAUT SI PAS DE TTS
	if (!tts)
		objet.tts=objet.signification;
	else
		// DEFINITION DU TTS DE RETOUR
		objet.tts=tts;
	// RETOUR DU JSON
	return objet;
}
	