const apm = require('elastic-apm-node').start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: 'fakelook-node',

  // Use if APM Server requires a token
  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'http://apm:8200',
  active: process.env.NODE_ENV === 'production',
});

const container = require('kontainer-di');
const config = require('config');
const yaml = require('js-yaml');
const fs = require('fs');

const dbConfig = { ...config.get('server.dbConfig'), parseJSON: true };
const elasticConfig = { ...config.get('server.elasticConfig'), parseJSON: true };
const jwtSecret = config.get('server.secret');
const imagePath = config.get('server.imagesPath');
const serverConfig = config.get('server.app');
const corsOptions = config.get('server.corsOptions');
const logPaths = config.get('server.log.paths');

container.register('apm', [], apm);

// configs
container.register('dbConfig', [], dbConfig);
container.register('elasticConfig', [], elasticConfig);
container.register('jwtSecret', [], jwtSecret);
container.register('imagePath', [], imagePath);
container.register('serverConfig', [], serverConfig);
container.register('corsOptions', [], corsOptions);
container.register('logPaths', [], logPaths);

const swaggerDocument = yaml.safeLoad(fs.readFileSync('./openapi.yaml', 'utf8'));
container.register('swaggerDocument', [], swaggerDocument);

// elastic init
container.register('mappings', [], require('./elastic/mapping.json'));
container.register('addLike', [], require('./elastic/add-like.json'));
container.register('removeLike', [], require('./elastic/remove-like.json'));
container.register('elasticInit', ['mappings', 'addLike', 'removeLike'], require('./elastic/init'));

// db connections
container.register('sqlPool', ['dbConfig'], require('./db/sqlDb'));
container.register('elasticClient', ['elasticConfig', 'elasticInit'], require('./db/elasticClient'));
container.register('elasticApi', ['elasticClient'], require('./db/elasticApi'));


// db repositories
container.register('authDb', ['sqlPool'], require('./db/auth.db'));
container.register('commentsDb', ['elasticApi'], require('./db/comment.db'));
container.register('postDb', ['elasticApi'], require('./db/post.db'));
container.register('socialDb', ['sqlPool'], require('./db/social.db'));
container.register('tagsDb', ['elasticApi'], require('./db/tags.db'));

// services
container.register('authService', ['authDb', 'socialService', 'jwtSecret'], require('./services/auth.service'));
container.register('commentsService', ['commentsDb', 'postDb', 'socialService'], require('./services/comments.service'));
container.register('imageService', ['imagePath'], require('./services/images.service'));
container.register('postService', ['postDb', 'commentsService', 'imageService', 'socialService'], require('./services/post.service'));
container.register('socialService', ['socialDb'], require('./services/social.service'));
container.register('tagsService', ['tagsDb'], require('./services/tags.service'));
container.register('notificationService', ['postService', 'commentsService'], require('./services/notifications.service'));

// controllers
container.register('authController', ['authService'], require('./controllers/auth.controller'));
container.register('commentsController', ['commentsService'], require('./controllers/comments.controller'));
container.register('imageController', ['imageService'], require('./controllers/images.controller'));
container.register('postController', ['postService'], require('./controllers/posts.controller'));
container.register('socialController', ['socialService'], require('./controllers/social.controller'));
container.register('tagsController', ['tagsService'], require('./controllers/tags.controller'));

// middleware
container.register('authMiddleware', ['authService'], require('./middleware/auth.middleware'));
container.register('middleware', ['logPaths'], require('./middleware'));

// routes
container.register('authRoute', ['authController'], require('./routes/api/auth.route'));
container.register('postsRoute', ['postController', 'middleware'], require('./routes/api/posts.route'));
container.register('commentsRoute', ['commentsController'], require('./routes/api/comments.route'));
container.register('tagsRoute', ['tagsController'], require('./routes/api/tags.route'));
container.register('usersRoute', ['socialController'], require('./routes/api/users.route'));
container.register('apiRoutes', ['authRoute', 'postsRoute', 'usersRoute', 'tagsRoute', 'commentsRoute', 'authMiddleware'], require('./routes/api'));
container.register('imageRoute', ['imageController'], require('./routes/images'));
container.register('routes', ['apiRoutes', 'imageRoute'], require('./routes'));
container.register('socketio', ['notificationService', 'authService'], require('./socketio'));

container.register('server', ['routes', 'middleware', 'serverConfig', 'corsOptions', 'logPaths', 'swaggerDocument', 'socketio'], require('./server'));

module.exports = container;
