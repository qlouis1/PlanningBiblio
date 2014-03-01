<?php
/*
Planning Biblio, Version 1.7.4
Licence GNU/GPL (version 2 et au dela)
Voir les fichiers README.txt et COPYING.txt
Copyright (C) 2011-2014 - Jérôme Combes

Fichier : absences/ajax.motifs.php
Création : 28 février 2014
Dernière modification : 28 février 2014
Auteur : Jérôme Combes, jerome@planningbilbio.fr

Description :
Enregistre la liste des motifs d'absences dans la base de données
Appelé lors du clic sur le bouton "Enregistrer" de la dialog box "Liste des motifs" à partir de la fiche absence
*/

session_start();
ini_set('display_errors',0);
ini_set('error_reporting',E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

include "../include/config.php";
include "../include/function.php";
$tab=json_decode($_POST['tab']);

$db=new db();
$db->delete("select_abs");
foreach($tab as $elem){
  $db=new db();
  $db->insert2("select_abs",array("valeur"=>$elem[0],"rang"=>$elem[2]));
}
?>