var directives = angular.module("Site.directives", []);

directives.directive("discoveredSubject", function($parse, $window) {
  return{
      restrict:'EA',
      template:"<svg id='diagram' width='470' height='200'></svg>",
	  scope: { chart: '=' },
      link: function(scope, elem, attrs){
          
		  scope.$watch('chart', function(chart) {
			   if(chart.length > 0){ initialize(chart) }
			});
		  
		  function initialize(chart){
					var rawSvg = angular.element( document.querySelector( '#diagram' ) );
					var diameter = 450, format = d3.format(",d"), color = d3.scale.category20c();
					
					var bubble = d3.layout.pack().sort(null).size([diameter, diameter]).padding(.5);
					//var svg = d3.select(svgbox).append("svg")
					var svg = d3.select(rawSvg[0])
						.attr("width", diameter)
						.attr("height", diameter)
						.attr("class", "bubble");
					
					
					var node;
					
						node = svg.selectAll(".node")
						  .data(bubble.nodes(classes(chart))
						  .filter(function(d) { return !d.children; }) )
						  .enter().append("g")
						  .attr("class", "node")
						  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
					
					  node.append("title").text(function(d) { return d.className + ": " + format(d.value); });
					
					  node.append("circle").attr("r", function(d) { return d.r; })
					  .style("fill", function(d) { return color(d.className); })
					
					  node.append("text")
						  .attr("dy", "0em")
						  .style("text-anchor", "middle")
						  .text(function(d) { return d.className.substring(0, d.r / 3); });
						
					  node.append("text")
						  .attr("dy", "1.2em")
						  .style({"text-anchor":"middle", "font-weight":"bold"})
						  .text(function(d) { return d.value; });
					
					
			 // d3.select(this.frameElement).style("height", diameter + "px");
		   }
		   
		   function classes(root) {
			  var classes = [];
					root.forEach(function(item) {  classes.push({className: item.tag, value: item.count}) });
			  	return {children: classes};
			} 
		  
       }
   };
});


directives.directive("heatMap", function($parse, $window) {
  return{
      restrict:'EA',
      template:"<div id='map-canvas'></div>",
	  scope: {
		  map: '='
    	},
       link: function(scope, elem, attrs){
		   scope.$watch('map', function(map) {
			   if(map.length > 0){ initialize(map) }
				//angular.forEach(locations, function(location, key){ });
			});
		   
		   
          var map, pointarray, heatmap, count, place;
		  
		  function initialize(data) {
			
			  var myLatlng = new google.maps.LatLng(26.115986, 46.669922);
			  var myOptions = {
					  zoom: 3,
					  center: myLatlng,
					  mapTypeId: google.maps.MapTypeId.ROADMAP,
					  disableDefaultUI: false,
					  scrollwheel: true,
					  draggable: true,
					  navigationControl: false,
					  mapTypeControl: false,
					  scaleControl: false,
					  disableDoubleClickZoom: false
				};
				
			  map = new google.maps.Map(document.getElementById('map-canvas'), myOptions);
			  
				var t = [];
				var infowindow =  new google.maps.InfoWindow({ content: "" });
				
				for(var x=0; x<data.length; x++){
					var tobj = {};
						tobj.location = new google.maps.LatLng(data[x].lat, data[x].lng);
						tobj.weight = data[x].count;	
					
					var mark = new google.maps.Marker({ position: tobj.location, map: map, title: data[x].name });
						bindInfoWindow(mark, map, infowindow, data[x].name);
			
					t.push(tobj);
				}
			  
			  var pointArray = new google.maps.MVCArray(t);
			  
				heatmap = new google.maps.visualization.HeatmapLayer({ data: pointArray });
				heatmap.set('radius', heatmap.get('radius') ? null : 40);
				
				heatmap.setMap(map);
			
			 // if(data.length < 1){ $('#emptymessage').attr('style','display:block'); } 
			}// initialize ends here
			
			function bindInfoWindow(marker, map, infowindow, area) {
				
				google.maps.event.addListener(marker, 'click', function() {
					place = area;
					var appurl = Site.url+"/twitter/tweets?file_id="+Site.File.id+"&count=5&misbar_tweet_location="+area;
					
					var out = '';
				
						$.ajax({
							url: appurl,
							xhrFields: {withCredentials: true },
							dataType : "json",
							beforeSend: function(xhr){ xhr.setRequestHeader('Authorization', 'Basic YWRtaW5AeGNlZWQ6MTIz'); },
						}).done(function(d) {
							if(d.elements.length > 0){
								$.each(d.elements, function(i,v){
									out += '<div class="tweet"><img src="'+v.tweet.user.profile_image_url+'" onerror="this.src=\'images/tt_temp_image.jpg\'" />';
									out += '<span class="uname"><span class="name" style="cursor:pointer">'+v.tweet.user.screen_name+'</span><span class="retweets"><strong>Retweets:</strong> '+ v.occurrence+'</span></span><span class="date">'+v.tweet.created_at+'</span>';
									out += '<div class="tweetText">'+v.tweet.text+'</div></div>';
								});
							} else {
								out += '<span>There is no data for this query, click on other markers.</span>';	
							}
							
							infowindow.setContent(out);
							infowindow.open(map, marker);
						});
							
				});
			}// bind for windows end here
		  
       }
   };
});








directives.directive("sentiment", function($parse, $window) {
  return{
      restrict:'EA',
      template:"<svg id='chart' width='200' height='200'></svg>",
	  scope: { positive: '=', negative: '=', nuteral: '=' },
      link: function(scope, elem, attrs){
        scope.$watchCollection('[positive, negative, nuteral]', function(data){

				if(angular.isNumber(data[0]) && angular.isNumber(data[1]) && angular.isNumber(data[2]) ){
					generateGraph(data[0], data[1], data[2]);
				}
		
		});
		
		
				function generateGraph(pos, neg, nut){
					
					var width = 200, height = 200, radius = 80;
					var jsondata = [ {"label":"إيجابي", "value":pos}, {"label":"سلبي", "value":neg}, {"label":"محايد", "value":nut} ];
							
					var rawSvg = angular.element( document.querySelector( '#chart' ) );
					var color = d3.scale.ordinal().range(["#3e9a9a", "#e67471", "#aaa79f"]);
					
					var svg = d3.select(rawSvg[0])
							.attr("width", width)
							.attr("height", height)
							.attr("class", "piechart")
							.append("g")
							.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
									
							svg.append("g").attr("class", "slices");
							svg.append("g").attr("class", "labels");
							svg.append("g").attr("class", "lines");	
				
					var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });
					var arc = d3.svg.arc().outerRadius(radius).innerRadius(radius-20);
					
					var outerArc = d3.svg.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);
								
					var key = function(d){ return d.data.label; };
					
								
								
								function change(data) {
								
									var slice = svg.select(".slices").selectAll("path.slice")
										.data(pie(data), key);
								
									slice.enter()
										.insert("path")
										.style("fill", function(d) { return color(d.data.label); })
										.attr("class", "slice");
								
									
									slice.transition().duration(1000)
										.attrTween("d", function(d) {
											this._current = this._current || d;
											var interpolate = d3.interpolate(this._current, d);
											this._current = interpolate(0);
											return function(t) {
												return arc(interpolate(t));
											};
									})
								
									slice.exit().remove();
									
									
									// ------- TEXT LABELS -------
								
									var text = svg.select(".labels").selectAll("text").data(pie(data), key);
								
									text.enter().append("text").attr("dy", ".35em").text(function(d) { return d.data.label; });
									
									function midAngle(d){ return d.startAngle + (d.endAngle - d.startAngle)/2; }
								
									text.transition().duration(500)
									.attrTween("transform", function(d) {
											this._current = this._current || d;
											var interpolate = d3.interpolate(this._current, d);
											this._current = interpolate(0);
											return function(t) {
												var d2 = interpolate(t);
												var pos = outerArc.centroid(d2);
												pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
												return "translate("+ pos +")";
											};
										})
									.styleTween("text-anchor", function(d){
											this._current = this._current || d;
											var interpolate = d3.interpolate(this._current, d);
											this._current = interpolate(0);
											return function(t) {
												var d2 = interpolate(t);
												return midAngle(d2) < Math.PI ? "start":"end";
											};
										});
									
									text.enter().append("text").attr("dy", "1.50em").style("fill", '#000000').text(function(d) { return /*d.data.value*/; });
									text.transition().duration(500)
										.attrTween("transform", function(d) {
											this._current = this._current || d;
											var interpolate = d3.interpolate(this._current, d);
											this._current = interpolate(0);
											return function(t) {
												var d2 = interpolate(t);
												var pos = outerArc.centroid(d2);
												pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
												return "translate("+ pos +")";
											};
										})
										.styleTween("text-anchor", function(d){
												this._current = this._current || d;
												var interpolate = d3.interpolate(this._current, d);
												this._current = interpolate(0);
												return function(t) {
													var d2 = interpolate(t);
													return midAngle(d2) < Math.PI ? "start":"end";
												};
											})	
									
									
									text.exit().remove();
								
									// ------- SLICE TO TEXT POLYLINES -------
								
									/*var polyline = svg.select(".lines").selectAll("polyline")
										.data(pie(data), key);
									
									polyline.enter().append("polyline");
								
									polyline.transition().duration(1000)
										.attrTween("points", function(d){
											this._current = this._current || d;
											var interpolate = d3.interpolate(this._current, d);
											this._current = interpolate(0);
											return function(t) {
												var d2 = interpolate(t);
												var pos = outerArc.centroid(d2);
												pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
												return [arc.centroid(d2), outerArc.centroid(d2), pos];
											};			
										});
									
									polyline.exit().remove();	*/
								}
								
					
					
					change(jsondata);
					
					
					
					}		
						
		
		
		
		
		
		
       }
   };
});

