module.exports = {
  apps : [{
    name: 'particle_ec2',
    script: 'particle.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development',
      AWS_PW: 'meSDzeJ8HjwtSFuAnF',
      DARKSKY: 'f9bce033285c1507e96e615fc74b2090',
      GMAIL: 'pgfblzeowjlewhvn',
      PARTICLE: 'ea996992c1eb911e6957355685d8616115cc76b2'
    },
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
      'post-deploy' : "cd week9 && nvm install 6.10.3 && npm install && npm install pm2 -g && export NODE_ENV='development' && export AWS_PW='meSDzeJ8HjwtSFuAnF' && export DARKSKY='f9bce033285c1507e96e615fc74b2090' && export GMAIL='pgfblzeowjlewhvn' && export PARTICLE='ea996992c1eb911e6957355685d8616115cc76b2' && pm2 reload ecosystem.config.js --env production"
    }
  }
};
