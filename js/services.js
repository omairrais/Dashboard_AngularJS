var services = angular.module('Site.Services', []);
	//services.url = 'http://app-dev.misbaronline.com:8010';
	//services.config = { headers:  { 'Authorization': 'Basic YWRtaW5AeGNlZWQ6MTIz'} };
	services.url = 'http://72.14.179.56:8010';
	services.config = { headers:  { 'Authorization': 'Basic YWRtaW5AZGVtbzoxMjM0NTY='} };

services.factory('Files', function($http)  {
	var promise;
	var files = {};
	
	files.async = function(){
		if ( !promise ) {
						promise = $http.get(services.url+'/files', services.config).then(function (response) {
						return response.data;
					});
				}
			// Return the promise to the controller
			return promise;
		}
	files.get = function(fileid) {
				promise.then(function(d){
					for (var i = 0; i < d.length; i++) {
						if (d[i].id === parseInt(fileid)) {
					  		console.log('found it');
							return d[i];
						}
				  	}
					console.log('null prinitng');
					return null;
				})
	}	
	//return $filter('filter')(d, {id: id})[0];
  return files;
});

services.factory('Summery', function($http)  {
	//var promise;
	var summery = {};
		summery.get = function(fileid, keywords){
			//if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/stats/summary?file_id='+fileid+''+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return promise;
		}
  return summery;
});

services.factory('Sentiment', function($http)  {
	//var positive, negative, nuteral, total;
	var sentiment = {};
		sentiment.getPositive = function(fileid, num){
			//if ( !positive ) {
			var	positive = $http.get(services.url+'/twitter/getTweetCountsForSentimentAndGender?file_id='+fileid+'&tweet_sentiment='+num, services.config).then(function (response) {
				//promise = $http.get(services.url+'/files/Sentimentdist?file_id='+fileid+''+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return positive;
		}
		sentiment.getNegative = function(fileid, num){
			//if ( !negative ) {
			var	negative = $http.get(services.url+'/twitter/getTweetCountsForSentimentAndGender?file_id='+fileid+'&tweet_sentiment='+num, services.config).then(function (response) {
						return response.data;
				});
			//}
		return negative;
		}
		sentiment.getNuteral = function(fileid, num){
			//if ( !nuteral ) {
			var	nuteral = $http.get(services.url+'/twitter/getTweetCountsForSentimentAndGender?file_id='+fileid+'&tweet_sentiment='+num, services.config).then(function (response) {
						return response.data;
				});
			//}
		return nuteral;
		}
		sentiment.getTotalTweets = function(fileid){
			//if ( !total ) {
			var	total = $http.get(services.url+'/twitter/getTweetCountsForSentimentAndGender?file_id='+fileid, services.config).then(function (response) {
						return response.data;
				});
			//}
		return total;
		}
		
  return sentiment;
});

services.factory('HashTags', function($http)  {
	//var promise;
	var hashtags = {};
		hashtags.get = function(fileid, keywords){
			//if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/stats/hashtags?file_id='+fileid+'&count=5'+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return promise;
		}
  return hashtags;
});

services.factory('Tweets', function($http)  {
	//var promise;
	var tweets = {};
		tweets.get = function(fileid, keywords){
			//if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/tweets?sort_direction=Desc&twitter_sort_by=Retweets&file_id='+fileid+'&count=10'+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return promise;
		}
  return tweets;
});

services.factory('Followers', function($http)  {
	//var promise;
	var followers = {};
		followers.get = function(fileid, keywords){
		//	if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/stats/followed?file_id='+fileid+'&count=5'+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return promise;
		}
  return followers;
});

services.factory('Links', function($http)  {
	//var promise;
	var links = {};
		links.get = function(fileid, keywords){
			//if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/stats/links?file_id='+fileid+'&count=5'+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return promise;
		}
  return links;
});


services.factory('DiscoveredSubjects', function($http)  {
	//var promise;
	var subjects = {};
		subjects.get = function(fileid, keywords){
			//if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/tweets/clusters?file_id='+fileid+'&count=10&labels_count=5'+keywords, services.config).then(function (response) {
						return response.data;
				});
			//}
		return promise;
		}
  return subjects;
});

services.factory('HeatMap', function($http)  {
	//var promise;
	var map = {};
		map.get = function(fileid, keywords){
			//if ( !promise ) {
			var	promise = $http.get(services.url+'/twitter/stats/heatMap?file_id='+644+'&count=10'+keywords, services.config).then(function (response) {
						return response.data;
				})
			//}
		//return promise;
		return promise; //[{"name":"Riyadh","lat":"24.653664","lng":"46.71522","count":9.0},{"name":"Jeddah","lat":"21.516944","lng":"39.219167","count":7.0}];
		}

  return map;
});

/*services.factory('TrendingReport', function($http, $cookies)  {
	var keywords = $cookies.selectedkeywords;
	//var promise;
	var report = {};
		report.get = function(fileid){
		//	if ( !promise ) {
			var	promise = $http.get(services.url+'/reports/2014/volume/trend?file_id='+fileid+'&start_time=1436389200&end_time=1436993999&time_frame=week'+keywords, services.config).then(function (response) {
						return response.data;
				});
		//	}
		return promise;
		}
  return report;
});*/








