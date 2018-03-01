 // Document ready function that checks whether DOM is ready
  $( document ).ready(function() {
    $("#panel1,#pane2,.container").hide();//initially everything is hidden
    //Firstly the user is promted to enter an ACCESS TOKEN
    var sign = prompt("ENTER YOUR FACEBOOK ACCESS TOKEN\nGet user data permissions of: email, user_birthday, user_hometown, user_location & user_posts.");
    //user input is stored in variable myFacebookToken
    var myFacebookToken = sign;
    //AJAX call to recieve profile details(Name, Id, Birthday, Email id, Hometown, location) & feed as response
    $.ajax('https://graph.facebook.com/v2.12/me?fields=birthday%2Cemail%2Chometown%2Cname%2Cid%2Cfeed%2Clocation&access_token='+myFacebookToken,{
        //If response received successfully, following code is processed
        success : function(response){
            $(".container").show();//As the response has been received successfully, the whole html code inside div class=container is shown
            $(".userName").text(response.name.toUpperCase());//transforms username to uppercase
            $(".profilePicture").attr("src","https://graph.facebook.com/"+response.id+"/picture");//Displays Profile Picture of user
            //function to display profile details
            function displayProfile(){
                    console.log(response);
                    $("#myEmail").text(response.email);   
                    $("#fbIcon").attr('href', 'https://facebook.com/'+response.id+' ');
                    $("#bDay").text(response.birthday);
                    $("#home").text(response.hometown.name);
                    $("#location").text(response.location.name);
                    $("#panel1").slideDown("slow");
            }//end of diplayProfile

            //function to load when user clicks Profile information button
            function getFacebookInfo(){
                //if else condition to check if the Facebook feed is already under display. If so, it will be hidden
                if ( $('#panel1').attr('style') == 'display:none;' ) {
                    displayProfile();
                } 
                else {
                    $('#pane2').hide(); 
                    displayProfile();
                }
            }// end get facebook info

            $("#facebookBtn").on('click',getFacebookInfo);//click function for Profile Informatuon button

            //function to display last 5 feed
            function displayFeed(){
                   $.each(response.feed.data,function(i,item){
                       var profileId= item.id.substr(0, 17);
                       var postId= item.id.substr(18, 17);

                        if(item.story == undefined && item.story == null){
                            $('<div class="col-xs-12 fbFeed panel panel-primary"></div>').append(
                            '<div class="panel-heading"><h4>POST NUMBER '+(i+1)+'</4></div>'+
                            '<div class="panel-body storyPanel" ><h4>STORY</h4><h4>'+response.name+' shared a Post</h4>'+
                            '<a class="storyLink" href="https://www.facebook.com/'+profileId+'/posts/'+postId+'?pnref=story" target="_blank">'+
                            '<button type="button" class="btn btn-primary">VIEW POST</button></a></div>'
                            ).appendTo('#pane2');
                        }
                        
                        else{
                             $('<div class="col-xs-12 fbFeed panel panel-primary"></div>').append(  
                            '<div class="panel-heading"><h4>POST NUMBER '+(i+1)+'</h4></div>'+
                            '<div class="panel-body storyPanel"><h4>STORY</h4><h4>'+item.story+'</h4>'+
                            '<a class="storyLink" href="https://www.facebook.com/'+profileId+'/posts/'+postId+'?pnref=story" target="_blank">'+
                            '<button type="button" class="btn btn-primary">VIEW POST</button></a></div>'
                            ).appendTo('#pane2');   
                            }
                        return i<4;
                     })//end of $.each
                                    
                    $("#pane2").fadeIn("slow");
                       
            }//end of displayFeed

            //function to load when user clicks View last 5 posts in feed button
            function getFacebookFeed(){
                $( "#pane2" ).empty();//To make sure facebook feed is made empty ever time user clicks the button that runs this function
                //if else condition to check if the Profile information is already under display. If so, it will be hidden.
                if ( $('#panel1').attr('style') == 'display:none;' ) {
                    displayFeed();
                } 
                else {
                    $('#panel1').hide(); 
                    displayFeed();
                }
            }//end of getFacebookFeed
                        
            $("#feedBTN").on('click',getFacebookFeed);//click function for View last 5 posts in feed button

        },//end of success

    //To check if there are any errors while entering the Access Token.
    error : function(request,errorType,errorMessage){
        console.log(request.responseJSON.error.message);
        //Error if Access Token entered is expired
        if(request.responseJSON.error.code==190 && request.responseJSON.error.error_subcode==467){
            console.log(request.responseJSON.error.message);
            alert("Your Access Token is expired. Please re-enter a new Token");
            location.reload();
        }
        //Error if Access Token entered is invalid
        else if(request.responseJSON.error.code==190){
            console.log(request.responseJSON.error.message);
            alert("Please fill a valid Access Token");
            location.reload();
        }
    },
    }//end argument list 
    );// end ajax call  
 });//end of doc ready