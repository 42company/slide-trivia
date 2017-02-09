// # Ghost Configuration
// Setup your Ghost install for various [environments](http://support.ghost.org/config/#about-environments).

// Ghost runs in `development` mode by default. Full documentation can be found at http://support.ghost.org/config/

var path = require('path'),
    config;

function pgDatabase (pgUrl) {
    return {
        client: 'pg',
        connection: {
            host: pgUrl.match(/@(.*):/)[1],
            user: pgUrl.match(/postgres:\/\/([^:]*):/)[1],
            password: pgUrl.match(/:([^:]*)@/)[1],
            database: pgUrl.match(/([^\/]*$)/)[1],
            charset: 'utf8'
        }
    }
}

config = {
    // ### Production
    // When running Ghost in the wild, use the production environment.
    // Configure your URL and mail settings here
    production: {
        url: process.env.URL || 'http://my-ghost-blog.com',
        mail: {},
        database: process.env.DATABASE_URL ? pgDatabase(process.env.DATABASE_URL) : {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost.db')
            },
            debug: false
        },
        server: {
            host: '0.0.0.0',
            port: process.env.PORT || 2368
        },
        storage: {
            active: 's3',
            's3': {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                bucket: process.env.S3_BUCKET,
                region: process.env.S3_REGION,
                assetHost: process.env.ASSET_HOST
            }
        }
    },

    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        // Change this to your Ghost blog's published URL.
        url: 'http://localhost:2368',

        // Example refferer policy
        // Visit https://www.w3.org/TR/referrer-policy/ for instructions
        // default 'origin-when-cross-origin',
        // referrerPolicy: 'origin-when-cross-origin',

        // Example mail config
        // Visit http://support.ghost.org/mail for instructions
        // ```
        //  mail: {
        //      transport: 'SMTP',
        //      options: {
        //          service: 'Mailgun',
        //          auth: {
        //              user: '', // mailgun username
        //              pass: ''  // mailgun password
        //          }
        //      }
        //  },
        // ```

        // #### Database
        // postgres://bngieymlpugufa:a43aa4a1ca0bbfbea4cfa219b68237f1db2cd49310ee67754d61441fe0ee479b@ec2-23-21-238-246.compute-1.amazonaws.com:5432/dandp6nsbs99d9
        // Ghost supports sqlite3 (default), MySQL & PostgreSQL
        database: process.env.HEROKU_POSTGRESQL_OLIVE_URL ? pgDatabase(process.env.HEROKU_POSTGRESQL_OLIVE_URL) : {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost.db')
            },
            debug: false
        },
        // #### Server
        // Can be host & port (default), or socket
        server: {
            // Host to be passed to node's `net.Server#listen()`
            host: '0.0.0.0',
            // Port to be passed to node's `net.Server#listen()`, for iisnode set this to `process.env.PORT`
            port: process.env.PORT || 2368
        },
        // #### Paths
        // Specify where your content directory lives
        paths: {
            contentPath: path.join(__dirname, '/content/')
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-test.db')
            },
            pool: {
                afterCreate: function (conn, done) {
                    conn.run('PRAGMA synchronous=OFF;' +
                    'PRAGMA journal_mode=MEMORY;' +
                    'PRAGMA locking_mode=EXCLUSIVE;' +
                    'BEGIN EXCLUSIVE; COMMIT;', done);
                }
            },
            useNullAsDefault: true
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing MySQL
    // Used by Travis - Automated testing run through GitHub
    'testing-mysql': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'mysql',
            connection: {
                host     : '127.0.0.1',
                user     : 'root',
                password : '',
                database : 'ghost_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    },

    // ### Testing pg
    // Used by Travis - Automated testing run through GitHub
    'testing-pg': {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'pg',
            connection: {
                host     : '127.0.0.1',
                user     : 'postgres',
                password : '',
                database : 'ghost_testing',
                charset  : 'utf8'
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        },
        logging: false
    }
};

module.exports = config;
