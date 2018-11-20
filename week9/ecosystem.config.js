module.exports = {
  apps : [{
    name: 'particle_ec2',
    script: 'particle.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      key: 'ParticleTempPM2.pem',
      user : 'ec2-user',
      host : 'ec2-18-223-164-222.us-east-2.compute.amazonaws.com',
      ssh_options: "StrictHostKeyChecking=no",
      ref  : 'origin/master',
      repo : 'https://github.com/ryanabest/data-structures.git',
      path : '/home/ec2-user/www/data-structures',
      'post-deploy' : 'cd week9 && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
