var titleForm = 'app-Login',
	inputUsername= document.getElementById('user'),
    inputPassword= document.getElementById('password'),
    inputAdmin= document.getElementById('admin'),
    titleTag = document.getElementById('titleForm'),
    msgErrorUser= document.getElementById('msgErrorUser'),
    msgErrorPass= document.getElementById('msgErrorPass'),
    btnSubmit= document.getElementById('btnSubmit'),
    infoForm= document.getElementById('infoForm'),
    appName = document.getElementById('app-Login'),   
    mainContainer = document.getElementById('mainContainer'),
    comicList = document.getElementById('comicList'),
    sectionLogin = document.getElementById('sectionLogin'),
    modalProfile = document.getElementById('modalProfile'),    
    profileDetail = document.getElementById('profileDetail'),    
    searchComic= document.getElementById('searchComic'),
	inputSort= document.getElementById('inputSort'),    
	inputGenre= document.getElementById('inputGenre'),    
	inputRecommended= document.getElementById('inputRecommended'),    
	inputCharacter= document.getElementById('inputCharacter'),    
    userOk = false,
    passOk = false,
    objUsers,
    users = localStorage.getItem("users") || "",
    userArray = users?JSON.parse(users):[],
    admin;

if (sessionStorage.getItem('userLogued')){
	appName.id = 'app-present';	
	showUserInfo();
	showComics();
	mainContainer.className='wrapper';
}

function showLogin() {
	titleTag.innerHTML = 'Login to ComicStore!';
	appName.id = 'app-Login';
	btnSubmit.value = 'Login';
	infoForm.innerHTML = ''
	infoForm.className="";
	resetElements();
}

function showRegister() {
	titleTag.innerHTML = 'Registration';
	appName.id = 'app-SignUp'
	btnSubmit.value = 'Sign Up';
	infoForm.innerHTML = '';
	resetElements();
}

function formLogin() {
	var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
	var	check = function(string){
		 	for(i = 0; i < specialChars.length;i++){
			    if(string.indexOf(specialChars[i]) > -1){
			       	return true
		    	}
			}
			return false;
		};
	
	//Validation Username
	if (inputUsername.value.length == 0) {
		msgErrorUser.innerHTML = '*Username is required';
	} else if(check(inputUsername.value) == true) {
		msgErrorUser.innerHTML = '*Username has special character';
	} else {
		msgErrorUser.innerHTML = '';
		userOk = true;
	}


	//Validation Password
	if (inputPassword.value.length == 0) {
		msgErrorPass.innerHTML = '*Password is required';
	} else if(inputPassword.value.length < 7) {
		msgErrorPass.innerHTML = '*Your Password Must Be at Least 7 Characters';
	} else if(check(inputPassword.value) == true) {
		msgErrorPass.innerHTML = '*Password has special character';
	} else {
		msgErrorPass.innerHTML = '';
		passOk = true;
	}

	if (userOk && passOk) {		
		if (appName.id === 'app-SignUp'){
			//Register function
			
			var userExists=false;
			userArray.forEach(function(entry) {
				if(inputUsername.value === entry.username){
					userExists = true;
				} 
			});

			if(userExists) {
				infoForm.innerHTML = 'The user \''+inputUsername.value+'\' already exists.';
				infoForm.className="errorText";
			} else {
				objUsers = {"username":inputUsername.value, "password":inputPassword.value, "admin":inputAdmin.checked};
				userArray.push(objUsers);
				localStorage.setItem("users", JSON.stringify(userArray));
				infoForm.innerHTML = 'The user has been created successfully';
				infoForm.className="successText";
			}

		} else {
			//Login function
			var userPassOk = false;


			userArray.forEach(function(entry) {
				if(inputUsername.value === entry.username && inputPassword.value === entry.password){
					userPassOk = true;
				} else {
					userPassOk = false;
				}

				if(userPassOk) {
					msgErrorPass.innerHTML = '';
					sessionStorage.setItem("userLogued", entry.username);
					sessionStorage.setItem("admin", entry.admin);
					showAppLogued();
				} else {
					msgErrorUser.innerHTML = '';
					msgErrorPass.innerHTML = '*Incorrect username or password';
				}
			});
		}
	}
}

function resetElements() {
	msgErrorUser.innerHTML = '';
	msgErrorPass.innerHTML = '';	
	searchComic.value='';
	var options = document.querySelectorAll('#inputSort option');
	for (var i = 0, l = options.length; i < l; i++) {
	    options[i].selected = options[i].defaultSelected;
	}
	var options = document.querySelectorAll('#inputGenre option');
	for (var i = 0, l = options.length; i < l; i++) {
	    options[i].selected = options[i].defaultSelected;
	}
	var options = document.querySelectorAll('#inputCharacter option');
	for (var i = 0, l = options.length; i < l; i++) {
	    options[i].selected = options[i].defaultSelected;
	}
	inputRecommended.checked=false;


}

function showAppLogued() {
	//Run Once
	(sessionStorage.getItem('admin')=="true") ? admin = true : admin = false;	
	appName.id = 'app-present';	
	mainContainer.className='wrapper';
	showUserInfo();
	showComics();

}

function showUserInfo(){
	infoUser= document.getElementById('infoUser');
	if(admin==true){
		infoUser.innerHTML = 'Hi Admin, ' + sessionStorage.getItem('userLogued')+'<span class="caret"></span>';
		profileDetail.innerHTML = 'Your Username is <b>'+ sessionStorage.getItem('userLogued')+'</b> and your are logged as an administrator.';
	}else{
		infoUser.innerHTML = 'Hi User, ' + sessionStorage.getItem('userLogued')+'<span class="caret"></span>';
		profileDetail.innerHTML = 'Your Username is <b>'+ sessionStorage.getItem('userLogued')+'</b> and your are logged as an user.';
	}
	

}


function logout() {
	sessionStorage.removeItem('userLogued');
	sessionStorage.removeItem('admin');
	infoUser.innerHTML = '';
	appName.id = titleForm;
	mainContainer.className='';
	resetElements();
}


function viewProfile(){
	$('#modalProfile').modal('toggle');
}



function showComics(){
	var i=0;	
	while (comicList.firstChild) {
	    comicList.removeChild(comicList.firstChild);
	}
	comicsFiltered=comics;
	if(searchComic.value!=undefined && searchComic.value!=''){			
		comicsFiltered=comicsFiltered.filter(function (entry) {		
		  search=searchComic.value;
		  var str_character = entry.character.toUpperCase(); 
		  var str_title = entry.title.toUpperCase(); 
		  if(inputSort.value=="all"){
		  	var result= str_character.search(search.toUpperCase())!=-1 ? 0 : str_title.search(search.toUpperCase());	
		  } else if(inputSort.value=="title"){
		  	var result= str_title.search(search.toUpperCase());	
		  } else if(inputSort.value=="character"){
		  	var result= str_character.search(search.toUpperCase());
		  }
		  		  
		  if(result!=-1){
		  	return true;
		  }else{
		  	return false;
		  }
		});
	}
	if(inputGenre.value!='all'){
		comicsFiltered=comicsFiltered.filter(function (entry) {				  
		  var str_genre = entry.genre.toUpperCase(); 		
		  var result= str_genre.search(inputGenre.value.toUpperCase());		  		  
		  if(result!=-1){
		  	return true;
		  }else{
		  	return false;
		  }
		});	
	}
	if(inputCharacter.value!='all'){
		comicsFiltered=comicsFiltered.filter(function (entry) {				  
		  var str_character = entry.character.toUpperCase(); 		
		  var result= str_character.search(inputCharacter.value.toUpperCase());		  		  
		  if(result!=-1){
		  	return true;
		  }else{
		  	return false;
		  }
		});	
	}
	
	if(inputRecommended.checked==true){
		comicsFiltered=comicsFiltered.filter(function (entry) {				  
		  var str_tags = entry.tags.toUpperCase(); 		
		  var result= str_tags.search('RECOMMENDED');		  		  
		  if(result!=-1){
		  	return true;
		  }else{
		  	return false;
		  }
		});	
	}

	


	j=0;
	comicsFiltered.forEach(function(item, id) {			         			        			        			     	
		if(i%3==0){
			j++;
			var newLineComic = document.createElement("div");
			newLineComic.className='row row-comic';
			newLineComic.id='row-comic-'+j;
			comicList.appendChild(newLineComic);
			
		}
		var itemComic = document.createElement("div");
		itemComic.className='col-md-4';
		itemComic.id = 'item-comic-'+id;		
		rowSelected=document.getElementById('row-comic-'+j);

		rowSelected.appendChild(itemComic);

		indexItem=document.getElementById('item-comic-'+id);
		
		var articleComic = document.createElement("div");
		articleComic.id='article-comic'+id;
		articleComic.className='article-comic clearfix';		
		indexItem.appendChild(articleComic);
		articleItem=document.getElementById('article-comic'+id);
		
		articleItem.innerHTML += '<div class="article-comic-header">'+item.title+'</div>';
		articleItem.innerHTML += '<div class="article-comic-body"><img  class="article-image" src="'+item.imgSrc+'"title="'+item.title+'" width="140" height="140">';
		articleItem.innerHTML += '<p class="articleText"><b>Genre: </b>'+item.genre+'</p><p class="articleText"><b>Character: </b>'+item.character+'</p>';
		

		if(item.tags=='recommended'){
			var imageRecommended = document.createElement("img");
			imageRecommended.className='article-recommended';
			imageRecommended.src='images/recommended.png';						
			indexItem.appendChild(imageRecommended);
		}
		
		
		if(item.availability=='S'){
			articleItem.innerHTML += '<p class="article-comic-available"><b><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> AVAILABLE</b></p>';
		}else{
			articleItem.innerHTML += '<p class="article-comic-borrowed"><b><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> BORROWED</b></p>';
		}
		articleItem.innerHTML += '</div>';
		articleItem.innerHTML += '</div>';		
		i++;
	});
}



