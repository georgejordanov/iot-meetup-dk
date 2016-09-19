// var Points = new Meteor.Collection(null);

// if(Points.find({}).count() === 0){
// 	for(i = 0; i < 20; i++)
// 		Points.insert({
// 			date:moment().startOf('day').subtract('days', Math.floor(Math.random() * 1000)).toDate(),
// 			value:Math.floor(Math.random() * 100)+500
// 		});
// }

Session.setDefault("graph", true);


Template.lineChartTemp.helpers({


	  graph: function () {
            return Session.get("graph");
        }
});

Template.lineChartTemp.events({

	'click #graph': function (e) {
		if (Session.get("graph") == true) {
			 Session.set("graph", false);
			var a = Session.get("graph");
			console.log(a);
		}
           else {
           	 Session.set("graph", true);
           	var a = Session.get("graph");
			console.log(a);
           }
        }

});


Template.lineChartTemp.rendered = function(){
	
	// if(Meteor.isMobile || Meteor.isCordova) {
	// 	console.log("Chart detect CORDOVA");
	// 	var margin = {top: 20, right: 45, bottom: 30, left: 35},

	// 	ww = document.getElementById("lineChart").clientWidth,
	// 	width = ww - margin.left - margin.right,
	// 	height = 400 - margin.top - margin.bottom;

	// 	// width = 600 - margin.left - margin.right,
	// 	// height = 400 - margin.top - margin.bottom;

	// }
	// else {
	// 	//Width and height
	// 	var margin = {top: 20, right: 20, bottom: 30, left: 50},
	// 	// ww = document.getElementById("lineChart").clientWidth,
	// 	// width = ww - margin.left - margin.right,
	// 	// height = 400 - margin.top - margin.bottom;


	// 	width = 1100 - margin.left - margin.right,
	// 	height = 400 - margin.top - margin.bottom;



	// }

	var ww = {};

	if (window.matchMedia("(orientation: portrait)").matches) {
   // you're in PORTRAIT mode
   		ww = document.getElementById("wellChart").clientWidth
	}

	if (window.matchMedia("(orientation: landscape)").matches) {
	  // you're in LANDSCAPE mode
	  	ww = document.getElementById("wellChart").clientWidth
	}




	var margin = {top: 20, right: 45, bottom: 30, left: 35},

		
		width = ww - margin.left - margin.right,

		height = 400 - margin.top - margin.bottom;





	var formatDate = d3.time.format("%c");	

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var line = d3.svg.line()
		.x(function(d) {
			// d.time = formatDate.parse(d.time);
			return x(d.time);
		})
		.y(function(d) {
			if (Session.get("graph") == true){
				return y(d.temperature);
			}
			else { return y(d.humidity); }
		});

	var svg = d3.select("#lineChart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		
		.attr("transform", "translate(0," + height + ")")
		

	// svg.append("g")
	// 	.attr("class", "y axis")
	// 	.append("text")
	// 	.attr("transform", "rotate(-90)")
	// 	.attr("y", 10)
	// 	.attr("dy", ".71em")
	// 	.style("text-anchor", "end")
	// 	.text(Session.get("graph"));


		
			  svg.append("g")
		.attr("class", "y axis")
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 10)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Temperature (C) / Humidity (%)");
		
          
        


	// function type(d) {
	//   d.time = formatDate.parse(d.time);
	//   d.temperature = +d.temperature;
	//   return d;
	// }	


// };
	
   

// Template.lineChartTemp.onRendered = function(){


	Meteor.defer(function() {
	Deps.autorun(function(){
		var current = Router.current();
	    // if (current.route.name === 'sensorList' && current.params._id === this._id) {
	    //   return 'active';

	    // }
	    console.log(current);

	    var graphdev = Meteor.users.findOne({_id: current.params._id});


	    if( Meteor.isCordova || Meteor.isMobile) {
	    	// var dataset = Sensors.find({},{ limit : 30 , sort:{time:-1}}).fetch();	
	    	var dataset = Sensors.find({"macAddr": graphdev.macAddr},{ limit : 30 , sort:{time:-1}}).fetch();

	    } else {
	    	// var dataset = Sensors.find({},{ limit : 60 , sort:{time:-1}}).fetch();	
	    	var dataset = Sensors.find({"macAddr": graphdev.macAddr},{ limit : 100 , sort:{time:-1}}).fetch();
	    		
	    }



		
		// console.log(this.macAddr);
		// console.log(dataset);
		var paths = svg.selectAll("path.line")
			.data([dataset]); //todo - odd syntax here - should use a key function, but can't seem to get that working

		x.domain(d3.extent(dataset, function(d) {  return d.time; }));
		y.domain(d3.extent(dataset, function(d) { if (Session.get("graph") == true){  return d.temperature;  }  else { return d.humidity;} }));

		//Update X axis
		svg.select(".x.axis")
			.transition()
			.duration(1000)
			.call(xAxis);
			
		//Update Y axis
		svg.select(".y.axis")
			.transition()
			.duration(1000)
			.call(yAxis);
		
		paths
			.enter()
			.append("path")
			.attr("class", "line")
			.attr('d', line);

		paths
			.attr('d', line); //todo - should be a transisition, but removed it due to absence of key
			
		paths
			.exit()
			.remove();
	});
	});
};