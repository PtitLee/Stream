angular.module('StreamApp', ['ui.bootstrap']);

var follow_name = [];
var follow_online = [];
var testislive = '';


var StreamApp = angular.module('StreamApp');

StreamApp.controller('ContentCtrl', function ($scope, $rootScope, $sce) {

  //valeur par défaut
  $rootScope.video_url = $sce.trustAsResourceUrl("//games.dailymotion.com/embed/x1zp0b8?quality=720&autoplay=1");
  $rootScope.chat_url = $sce.trustAsResourceUrl('http://webirc.jeuxvideo.com/#g-e2');


  $rootScope.switch_stream = function(stream_name){
    $rootScope.video_url = $sce.trustAsResourceUrl('http://www.twitch.tv/' + stream_name + '/embed');
    $rootScope.chat_url = $sce.trustAsResourceUrl('http://www.twitch.tv/' + stream_name + '/chat?popout=');
  };


});

StreamApp.controller('ModalCtrl', function ModalCtrl($scope, $rootScope, $sce, $rootScope, $modal, $log) {


  //Gestion de la modal twitch
  $scope.openModalTwitch = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'modal_live_twitch.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {

      }
    });

    modalInstance.result.then(function (stream_name) {

      $rootScope.video_url = $sce.trustAsResourceUrl('http://www.twitch.tv/' + stream_name + '/embed');
      $rootScope.chat_url = $sce.trustAsResourceUrl('http://www.twitch.tv/' + stream_name + '/chat?popout=');

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


  //Gestion de la modal GamingLive
  $scope.openModalGamingLive = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'modal_live_dailymotion.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {

      }
    });

    modalInstance.result.then(function (stream_name) {

      $rootScope.video_url = $sce.trustAsResourceUrl('http://www.twitch.tv/' + stream_name + '/embed');
      $rootScope.chat_url = $sce.trustAsResourceUrl('http://www.twitch.tv/' + stream_name + '/chat?popout=');

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


});

StreamApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.searchLiveStream = function (userName) {
    searchLiveStream('twitch', userName);
  };

  $scope.modal_switchStream = function(){
    $modalInstance.close($('input[name=nom_chaine]:checked').val());
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});




function searchLiveStream(TypeOfStream, userName)
{

  /********************************************/
  /******** Intéraction avec Twitch ***********/
  /********************************************/
  if (TypeOfStream == "twitch") 
  {

    $.getJSON('https://api.twitch.tv/kraken/users/'+userName+'/follows/channels?limit=50&offset=0&callback=?', function(data) {

        follow_name = [];
        for (var i = 0; i < data.follows.length; i++) 
        {
          follow_name.push(data.follows[i].channel.name);
        }

    }).done(function() {

      //clear Online Stream
      $('#emplacement_list_stream_twitch').html("");

      //Fill Online Stream
      WhichTwitchIsLive();

    });

  }

  /*************************************************/
  /******** Intéraction avec Dailymotion ***********/
  /*************************************************/
  else if (TypeOfStream == "dailymotion")
  {

    $.getJSON('https://api.dailymotion.com/user/x1f124w/videos?fields=id,mode,onair,title,&private=0&sort=visited&limit=100', function(data) {

        follow_name = [];
        for (var i = 0; i < data.follows.length; i++) 
        {
          follow_name.push(data.follows[i].channel.name);
        }

    }).done(function() {

      //clear Online Stream
      $('#emplacement_list_stream_dailymotion').html("");

      //Fill Online Stream
      $('#emplacement_list_stream_dailymotion').append('<li class="list-group-item"><input type="radio" name="nom_chaine" value="'+follow_online[i][0]+'" id="'+follow_online[i][0]+'"><label for="'+follow_online[i][0]+'">'+follow_online[i][0]+'</label><span class="badge">'+follow_online[i][1]+'</span></li>');

    });

  }


}


function WhichTwitchIsLive()
{
  follow_online = [];
  for (var j = 0; j < follow_name.length; j++) 
  {

    testislive = $.getJSON('https://api.twitch.tv/kraken/streams/'+ follow_name[j] +'?&callback=?', function(data) 
    {
        if(data.stream != null)
        {
          follow_online.push([data.stream.channel.name,data.stream.channel.game]);
        }
    });

  }

  testislive.complete(function()
  {
    for (var i = 0; i < follow_online.length; i++) 
    {
 
      $('#emplacement_list_stream_twitch').append('<li class="list-group-item"><input type="radio" name="nom_chaine" value="'+follow_online[i][0]+'" id="'+follow_online[i][0]+'"><label for="'+follow_online[i][0]+'">'+follow_online[i][0]+'</label><span class="badge">'+follow_online[i][1]+'</span></li>');
    }
  });

} 