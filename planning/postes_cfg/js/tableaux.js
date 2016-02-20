/**
Planning Biblio, Version 2.3
Licence GNU/GPL (version 2 et au dela)
Voir les fichiers README.md et LICENSE
@copyright 2011-2016 Jérôme Combes

Fichier : planning/postes_cfg/js/tableaux.js
Création : 4 février 2015
Dernière modification : 20 février 2016
@author Jérôme Combes <jerome@planningbiblio.fr>

Description :
Fichier regroupant les scripts JS nécessaires aux pages planning/postes_cfg/* (affichage et modification des tableaux)
Fichier intégré par le fichier include/header.php avec la fonction getJSFiles.
*/


// Supprime des groupes de tableaux en cliquant sur les croix rouges
function supprimeGroupe(id){
  var nom=$("#td-groupe-"+id+"-nom").text();
  if(confirm("Etes vous sûr(e) de vouloir supprimer le groupe \""+nom+"\"?")){
    $.ajax({
      url: "planning/postes_cfg/ajax.supprimeGroupe.php",
      type: "post",
      dataType: "json",
      data: {id: id},
      success: function(){
	var tr=$("#tr-groupe-"+id).next("tr");
	while(tr.length>0){
	  var class1=tr.attr("class");
	  var class2=class1=="tr1"?"tr2":"tr1";
	  tr.removeClass();
	  tr.addClass(class2);
	  tr=tr.next("tr");
	}
 	$("#tr-groupe-"+id).remove();
	CJInfo("Le groupe \""+nom+"\" a été supprimé avec succès","success");
      },
      error: function(result){
	CJInfo("Une erreur est survenue lors de la suppression du groupe \""+nom+"\"","error");
      }
    });
  }
}


// Suppression des lignes en cliquant sur les croix rouges
function supprimeLigne(id){
  var nom=$("#td-ligne-"+id+"-nom").text();
  if(confirm("Etes-vous sûr(e) de vouloir supprimer la ligne \""+nom+"\" ?")){
    $.ajax({
      url: "planning/postes_cfg/ajax.supprimeLigne.php",
      type: "post",
      dataType: "json",
      data: {id: id},
      success: function(){
	var tr=$("#tr-ligne-"+id).next("tr");
	while(tr.length>0){
	  var class1=tr.attr("class");
	  var class2=class1=="tr1"?"tr2":"tr1";
	  tr.removeClass();
	  tr.addClass(class2);
	  tr=tr.next("tr");
	}
 	$("#tr-ligne-"+id).remove();
	CJInfo("Le ligne \""+nom+"\" a été supprimée avec succès","success");
      },
      error: function(result){
	CJInfo("Une erreur est survenue lors de la suppression de la ligne \""+nom+"\"","error");
      }
    });
  }
}

// Suppression des tableaux en cliquant sur les croix rouges
function supprimeTableau(tableau){
  var nom=$("#td-tableau-"+tableau+"-nom").text();
  if(confirm("Etes vous sûr(e) de vouloir supprimer le tableau \""+nom+"\"?\nLes groupes utilsant ce tableau seront également supprimés")){
    $.ajax({
      url: "planning/postes_cfg/ajax.supprimeTableau.php",
      type: "post",
      dataType: "json",
      data: {tableau: tableau},
      success: function(){
	msg=encodeURIComponent("Le tableau \""+nom+"\" a été supprimé avec succès");
	window.location.href="index.php?page=planning/postes_cfg/index.php&msgType=success&msg="+msg;
      },
      error: function(result){
	CJInfo("Une erreur est survenue lors de la suppression du tableau \""+nom+"\"\n"+result.responseText,"error");
      }
    });
  }
}

//	--------------------------------	Tableaux - Horaires	-------------------------	//
function add_horaires(tableau){
  for(i=0;i<50;i++){
    if(document.getElementById("tr_"+tableau+"_"+i).style.display=="none"){
      document.getElementById("tr_"+tableau+"_"+i).style.display="";
      return;
    }
  }
}

function change_horaires(elem){
  tmp=elem.name.split("_");
  tmp[2]++;
  elem2="debut_"+tmp[1]+"_"+tmp[2];
  for(i=0;i<document.form2.elements.length;i++){
    if(document.form2.elements[i].name==elem2){
      document.form2.elements[i].selectedIndex=elem.selectedIndex;
      break;
    }
  }
}
//	--------------------------------	FIN Tableaux - Horaires	-------------------------	//
//	--------------------------------	Tableaux - Lignes	-------------------------	//
function ajout(nom,id){
  id++;
  for(i=id;i<100;i++){
    if(document.getElementById("tr_"+nom+i).style.display=="none"){
      document.getElementById("tr_"+nom+i).style.display="";
      fin=i;
      break;
    }
  }
  for(i=fin;i>id;i--){
    j=i-1;
    document.form4.elements[nom+i].selectedIndex=document.form4.elements[nom+j].selectedIndex;
    document.form4.elements[nom+i].className=document.form4.elements[nom+j].className;
    document.getElementById("td_"+nom+i+"_0").className=document.getElementById("td_"+nom+j+"_0").className;
  }
  document.form4.elements[nom+id].selectedIndex=0;
  document.form4.elements[nom+id].className=null;
  document.getElementById("td_"+nom+i+"_0").className=null;
}

function couleur2(elem,td){
  if(elem.checked)
    document.getElementById(td).className="cellule_grise";
  else
    document.getElementById(td).className="";
}

function supprime_tab(nom,id){
  document.form4.elements["select_"+nom+id].value="";
  document.getElementById("tr_select_"+nom+id).style.display="none";
  i=1;
}
//	--------------------------------	FIN Tableaux - Lignes	-------------------------	//

function ctrl_nom(me){
  exist=false;
  valeur=me.value.toLowerCase();
  valeur=valeur.trim();
  for(i=0;i<grp_nom.length;i++){
    if(valeur==grp_nom[i]){
      exist=true;
    }
  }
  document.getElementById("submit").disabled=false;
  document.getElementById("nom_utilise").style.display="none";
  me.style.border=null;
  me.style.background="#FFFFFF";
    
  if(exist){
    me.style.border="solid 3px red";
    me.style.background="#FFCCCC";
    document.getElementById("submit").disabled=true;
    document.getElementById("nom_utilise").style.display="";
  }
}

//	Suppression des élements sélectionnés (page de suppression)
function supprime_select(page){
  ids=new Array();
  i=0;
  while(document.form.elements["chk"+i]){
    elem=document.form.elements["chk"+i];
    if(elem.checked){
      ids.push(elem.value);
    }
    i++;
  }
  if(!ids[0]){
    alert("Les éléments sélectionnés ne peuvent être supprimés.");
  }
  else if(confirm("Etes-vous sûr(e) de vouloir supprimer les éléments sélectionnés ?\nLes groupes utilisant ces éléments seront également supprimés")){
    $.ajax({
      url: page,
      type: "get",
      data: "ids="+ids,
      success: function(result){
	msg=encodeURIComponent("Les éléments sélectionnés ont été supprimés avec succès");
	window.location.href="index.php?page=planning/postes_cfg/index.php&msgType=success&msg="+msg;
      },
      error: function(){
	CJInfo("Une erreur est survenue lors de la suppression.","error");
      }
    });
  }
}

function tableauxInfos(){
  $.ajax({
    url: "planning/postes_cfg/ajax.infos.php",
    type: "get",
    dataType: "json",
    data: {id:$("#id").val(), nom:$("#nom").val(), nombre:$("#nombre").val(), site:$("#site").val()},
    success: function(){
      var msg=encodeURIComponent("Les informations ont été modifiées avec succès");
      location.href="index.php?page=planning/postes_cfg/modif.php&numero="+$("#id").val()+"&cfg-type=0&msg="+msg+"&msgType=success";
    },
    error: function(){
      CJInfo("Une erreur est survenue lors de la modification des informations","error");
    }
  });
}

$(function(){
  $("#infos").click(function(){
    $(".tableaux-valide").attr("href","javascript:tableauxInfos();");
  });

  $("#horaires").click(function(){
    $(".tableaux-valide").attr("href","javascript:document.form2.submit();");
  });

  $("#lignes").click(function(){
    $(".tableaux-valide").attr("href","javascript:configLignes();");
  });
});