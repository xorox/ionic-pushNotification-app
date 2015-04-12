app.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('LoginCtrl', function ($scope, $state, $ionicPopup, UserService, Config, $ionicPlatform, $ionicLoading, $cordovaPush, $rootScope) {
  if (UserService.current()) {
    $state.go('tab.news');
  }

  $scope.login = function() {

    var result = {"username":$scope.username};
    UserService.login(result)
      .then(function (user) {

        if(ionic.Platform.isIOS()) {
          // iOS working
          $ionicPlatform.ready(function () {
            $cordovaPush.register({
              badge: true,
              sound: true,
              alert: true
            }).then(function (result) {
              UserService.registerDevice({
                user: user,
                token: result
              }).then(function () {
                $ionicLoading.hide();
                $state.go('tab.news');
              }, function (err) {
                console.log(err);
              });
            }, function (err) {
              console.log('reg device error', err);
            });
          });
        } else if(ionic.Platform.isAndroid()) {
          $ionicPlatform.ready(function () {
            $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
             // var notification = resp.notification;

             console.log("PUSH RECEIVED: (" + notification.event + ")", event, notification);

             if (notification.event == "registered") {
               console.log("notification:", notification.regid);

               UserService.registerDevice({
                 user: user,
                 token: notification.regid
               }).then(function () {
                 $ionicLoading.hide();
                 $state.go('tab.news');
               }, function (err) {
                 console.log(err);
               });
             }

            });

            var config = {
              "senderID": "939779991058"
            };
            $cordovaPush.register(config).then(function(result) {
              // nothing to do here ;)
            }, function(err) {
              console.log('reg device error', err);
            });
          });
        }

      }, function(err) {
        $ionicPopup.alert({
          title: 'Error',
          template: err
        });
      });
  }
})

.controller('NewsCtrl', function($scope, $ionicLoading, NewsService) {

  $ionicLoading.show({
    template: 'Loading...'
  });

  NewsService.all().then(function (news) {
    $scope.news = news;
    $ionicLoading.hide();
  });

  $scope.refresh = function () {
    NewsService.all().then(function (news) {
      $scope.news = news;
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
});
