/* jshint camelcase: false */
/* jshint strict: false */

window.PopCorn = {
	Config: {},
	Modules: {},
	Models: {},
	Collection: {},
	Views: {}
};

PopCorn.Config = {
	URL: 'https://api.themoviedb.org/3/',
	API_KEY: 'a72102da66ee19ab12bb96649561c471'
};

PopCorn.Modules.Request = (function(){
	getCompleteData = function(data){
		return $.extend({api_key: PopCorn.Config.API_KEY}, data);
	};
	getCompleteUrl = function(path){
		return PopCorn.Config.URL + path;
	};
	requestAjax = function(verb, path, data, callback){
		$.ajax({
			data:  getCompleteData(data),
			url:   getCompleteUrl(path),
			type:  verb,
			success: callback
		});
	};
	return {
		GET: function(path, data, callback){
			requestAjax('GET', path, data, callback );
		}
	};
})();

PopCorn.Views.movieView = (function() {
    imageUrl = function(imagePath){
        return 'http://image.tmdb.org/t/p/w150' + imagePath;
    };
    return {
        moviesView: {},
        movie: {},
        init: function(movie, moviesView){
            this.moviesView = moviesView;
            this.movie = movie;
            this.render();
        },
        render: function(){
            var $container = $(this.moviesView.el);
            $container.append("<li class='"+this.movie.id+"'><img src='"+ imageUrl(this.movie.poster_path) +"' />"+"</li>");
        }
    };
})();

PopCorn.Views.moviesView = {
    render: function(movies){
        var _this = this;
        $.each(movies, function(index, movie) {
            PopCorn.Views.movieView.init(movie, _this);
        });
    }
};

PopCorn.Collection.Movies = (function() {
    return {
        collection: [],
        data: {},
        init: function(){
            this.fetch();
        },
        fetch: function(){
            PopCorn.Modules.Request.GET(this.path, this.data, this.loadCollection.bind(this));
        },
        loadCollection: function(response){
            this.collection = response.results;
            PopCorn.Views.moviesView.el = this.el;
            PopCorn.Views.moviesView.render(this.collection);
        }
    };
});

$(function() {
    PopCorn.Collection.MoviesPopular = new PopCorn.Collection.Movies();
    PopCorn.Collection.MoviesTopRated = new PopCorn.Collection.Movies();
    
    PopCorn.Collection.MoviesPopular.path = 'movie/popular';
    PopCorn.Collection.MoviesPopular.el= '.popular-movies';
    
    PopCorn.Collection.MoviesTopRated.path = 'movie/top_rated';
    PopCorn.Collection.MoviesTopRated.el = '.top-rated-movies';
    
    PopCorn.Collection.MoviesPopular.init();
    PopCorn.Collection.MoviesTopRated.init();
});
                            
                         
