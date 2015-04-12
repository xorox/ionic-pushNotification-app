// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ngCordova', 'LocalStorageModule', 'ionic']);

app
.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Listen for push notifications on device ready status
    $rootScope.$on(
      '$cordovaPush:notificationReceived',
      function (event, notification) {
        if(ionic.Platform.isIOS()) {
          // working iOS
          if (notification.alert) {
            navigator.notification.alert(notification.alert);
          }
        } else if(ionic.Platform.isAndroid()) {
          // working Android
          switch(notification.event) {
            case 'registered':
              if (notification.regid.length > 0 ) {
                alert('registration ID = ' + notification.regid);
              }
              break;

            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
              break;

            case 'error':
              alert('GCM error = ' + notification.msg);
              break;

            default:
              alert('An unknown GCM event has occurred');
              break;
          }
        }      
      });
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('tab', {
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tab.news', {
      url: '/news',
      views: {
        'tab-news': {
          templateUrl: 'templates/tab-news.html',
          controller: 'NewsCtrl'
        }
      }
    });
});
