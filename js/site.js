var Site = angular.module('Site', ['ui.router', 'Site.Services', 'ngCookies', 'ngNumeraljs', 'Site.directives']);

Site.url = 'http://72.14.179.56:8010';
Site.auth = { headers:  { 'Authorization': 'Basic YWRtaW5AZGVtbzoxMjM0NTY='} };

Site.config(function config($stateProvider, $urlRouterProvider) {
   
   $stateProvider.state('home', {
	  url: "/",
	  templateUrl: 'partials/home.html',
      controller: 'HomeCtrl'
	})
	
	$stateProvider.state('fileview', {
	  url: "/:fileid",
	  views: {
        '': {
          templateUrl: 'partials/dashboard.html',
          controller: 'DashboardCtrl'
        },
		'Summery@fileview': {
          templateUrl: 'partials/summery.html',
          controller: 'SummeryCtrl'
        },
		'Sentiments@fileview': {
          templateUrl: 'partials/sentiments.html',
          controller: 'SentimentCtrl'
        },
		'TopHashtags@fileview': {
          templateUrl: 'partials/hashtags.html',
          controller: 'HashTagCtrl'
        },
		'TopTweets@fileview': {
          templateUrl: 'partials/tweets.html',
          controller: 'TweetsCtrl'
        },
		'TopFollowers@fileview': {
          templateUrl: 'partials/followers.html',
          controller: 'FollowersCtrl'
        },
		'TopLinks@fileview': {
          templateUrl: 'partials/links.html',
          controller: 'LinksCtrl'
        },
		'DiscoveredSubjects@fileview': {
          templateUrl: 'partials/discoveredsubjects.html',
          controller: 'DiscoveredSubjectsCtrl'
        },
		'HeatMap@fileview': {
          templateUrl: 'partials/heatmap.html',
          controller: 'HeatMapCtrl'
        },
		'TopTrending@fileview': {
          templateUrl: 'partials/trending.html',
          controller: 'TrendingCtrl'
        }
      }
	})
	
	$urlRouterProvider.otherwise('/'); 
	
});

Site.File = {};
Site.Files = {};
Site.Keywords;
Site.Event;

Site.controller('HomeCtrl', function($scope, Files) {
	Files.async().then(function(d) {  $scope.files = d; Site.Files = d });
});

Site.controller('DashboardCtrl', function($scope, $stateParams, $filter, $cookies, $rootScope, Files) {
	$scope.date = new Date();
	
	//var unregisterEvent = $rootScope.$broadcast("cookieready");
	
	Files.async().then(function(d) {
    		$scope.files = d;
			Site.File = $filter('filter')(d, {id: $stateParams['fileid']})[0];
			$scope.file = Site.File;
			var str='';
			for(var x in Site.File.keywords){ str +="&keyword_ids="+Site.File.keywords[x].id; }
			Site.Keywords = str;
			//$cookies.selectedkeywords = str;
			//$scope.$on('$destroy', function() {
			$rootScope.$broadcast("cookieready");
			//})
			//console.log('cookieready');
  	});
});

Site.controller('SummeryCtrl', function($scope, $stateParams, $rootScope, Summery) { 
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
			
		Summery.get($stateParams['fileid'], Site.Keywords).then(function(d) {
			$scope.hashtags = d.number_of_hashtags;
			$scope.links = d.number_of_links;
			$scope.tweeters = d.number_of_tweeters;
			$scope.mentions = d.number_of_mentions;
			$scope.tweets = d.number_of_tweets;
		});
		
	})
	 
});
// tomorrow
Site.controller('SentimentCtrl', function($scope, $stateParams, Sentiment) {
	$scope.positive = {};
	$scope.negative = {};
	$scope.nuteral = {};
	$scope.total = {}

	Sentiment.getPositive($stateParams['fileid'], 1).then(function(d) { $scope.positive = d.data.count ; });
	Sentiment.getNegative($stateParams['fileid'], -1).then(function(d) { $scope.negative = d.data.count ; });
	Sentiment.getNuteral($stateParams['fileid'], 0).then(function(d) { $scope.nuteral = d.data.count ; });
	Sentiment.getTotalTweets($stateParams['fileid']).then(function(d) { 
				$scope.total = d.data.count ;
	});
});


Site.controller('HashTagCtrl', function($scope, $stateParams, $rootScope, HashTags) { 
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
		HashTags.get($stateParams['fileid'], Site.Keywords).then(function(d) { $scope.total = d.total_occurance; $scope.hashtags = d.elements; });
	})
});
Site.controller('TweetsCtrl', function($scope, $stateParams, $rootScope, Tweets) {
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
		Tweets.get($stateParams['fileid'], Site.Keywords).then(function(d) { $scope.total = d.total_count; $scope.tweets = d.elements; });
	});
	$scope.parseDate = function(date) {
       	var str = date;
		var nstr = str.split(' ');
		var bstr = nstr[nstr.length-1]+"-"+getMonthFromString(nstr[1])+"-"+nstr[2]+"T"+nstr[3];//+"-"+nstr[4];
		return bstr;
    }
	
	function getMonthFromString(mon){
		var m = new Date(Date.parse(mon +" 1, 2012")).getMonth()+1;
		if(m<10){m = '0'+m}
		return m
	}
});
Site.controller('FollowersCtrl', function($scope, $stateParams, $rootScope, Followers) {
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
		Followers.get($stateParams['fileid'], Site.Keywords).then(function(d) { $scope.followers = d; });
	})
});
Site.controller('LinksCtrl', function($scope, $stateParams, $rootScope, Links) { 
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
		Links.get($stateParams['fileid'], Site.Keywords).then(function(d) { $scope.total = d.total_count;  $scope.links =  d.elements; });
	})
});

Site.controller('DiscoveredSubjectsCtrl', function($scope, $stateParams, $interval, $rootScope, DiscoveredSubjects) {
	$scope.discoveredsubjects = {};
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
		DiscoveredSubjects.get($stateParams['fileid'], Site.Keywords).then(function(d) { $scope.total = d.total_cluster_count;  $scope.discoveredsubjects =  d.elements; });
	})
});

Site.controller('HeatMapCtrl', function($scope, $stateParams, $rootScope, HeatMap) { 
	$scope.map = {};
	$scope.$on('$destroy', function() { cleanit(); });
	
	var cleanit = $rootScope.$on("cookieready",function(){
		$scope.map = [{"name":"Riyadh","lat":"24.653664","lng":"46.71522","count":9.0},{"name":"Jeddah","lat":"21.516944","lng":"39.219167","count":7.0}];
		//HeatMap.get($stateParams['fileid'], Site.Keywords).then(function(d) { $scope.map =  d; });
	})
});

// tomorrow
/*Site.controller('TrendingCtrl', function($scope, $stateParams, TrendingReport) {
	TrendingReport.get($stateParams['fileid']).then(function(d) { $scope.reports =  d; });
});*/


Site.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
/*Site.filter('test', function(){
  return function(val) {
	  
	  alert(val);
    return val;
  };
});*/

/*Site.filter('numberWithCommas', function() {
  return function(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
})*/

