/* vim: set noexpandtab autoindent smartindent tabstop=4 shiftwidth=4: */

// Mustache partial views
var _partials = function () {
	var result = Object.create(null),
		id,
		html,
		$p;

	$('script[data-type="partial"]').each(function (index, partial) {
		$p = $(partial);
		id = $p.attr('id');
		html = $p.html();

		result[id] = html;
	});

	console.log(result);
	return result;
}();

//
// Simple namespace for this Main applcation

var App = App || {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {}
};



// Helpers

function errorHandler () {
	console.error(this, arguments);
}



// Courses MVC stack using Backbone

App.Models.Course = Backbone.Model.extend({
	urlRoot: '/api/v1/courses'
});

App.Collections.Courses = Backbone.Collection.extend({
	url: '/api/v1/courses',
	model: App.Models.Course,

	toJSON: function () {
		return this.models.map(function (model) {
			return model.toJSON();
		});
	}
});

App.Views.CoursesView = Backbone.View.extend({
	el: '#bones-app',
	template: $('#courses').html(),

	initialize: function () {
		this.model.on('add reset', this.render);
		this.render();
	},

	render: function () {
		var model = Object.create(null),
			courses = this.model.toJSON(),
			html;

		model.available = courses.filter(function (course) { return course.state == 'available'; }),
		model.unavailable = courses.filter(function (course) { return course.state == 'unavailable'; });
		html = Mustache.to_html(this.template, model, _partials);

		this.$el.html(html);
		return this;
	}
});

App.Routers.CourseRouter = Backbone.Router.extend({
	routes: {
		'courses': 'list',
		'courses/:id': 'list'
	},

	list: function (id) {
		this.courses = new App.Collections.Courses;
		this.courses.fetch({
			success: _.bind(function () {
				new App.Views.CoursesView({ model: this.courses });
		}	, this),
			error: _.bind(errorHandler, this)
		});
	}
});

App.Routers.MainRouter = Backbone.Router.extend({
	routes: {
		'': 'index'
	},

	index: function () {
		$('#bones-app').html($('#index').html());
	}
});


// Load the app

var routers = {
	'main': new App.Routers.MainRouter,
	'courses': new App.Routers.CourseRouter
};
Backbone.history.start({ pushState: true });

$(document).on('click', 'a[href]', function (event) {
	event.preventDefault();

	var $this = $(this),
		href = $this.attr('href'),
		type = $this.attr('data-type') || 'main',
		router = routers[type]

	router.navigate(href, { trigger: true });
});
