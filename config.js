var config = {
	"sessionSecret": "glossy-node",
	"port": 9999,
	"host": "127.0.0.1",

	"debug": (process.env.NODE_ENV != "production")
};


if (process.env.NODE_ENV == "production") {
	config.host = "http://glossy-node.heroku.com";
	config.port = process.env.PORT || 80;
}


module.exports = config;
