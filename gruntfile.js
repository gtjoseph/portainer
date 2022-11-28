const os = require('os');
const loadGruntTasks = require('load-grunt-tasks');
const webpackDevConfig = require('./webpack/webpack.develop');
const webpackProdConfig = require('./webpack/webpack.production');
const webpackTestingConfig = require('./webpack/webpack.testing');

let arch = os.arch();
if (arch === 'x64') {
  arch = 'amd64';
}
let platform = os.platform();
switch (platform) {
  case 'windows':
  case 'darwin':
    break;
  default:
    platform = 'linux';
}

module.exports = function (grunt) {
  loadGruntTasks(grunt, {
    pattern: ['grunt-*', 'gruntify-*'],
  });

  grunt.initConfig({
    root: 'dist',
    distdir: 'dist/public',
    env: gruntConfig.env,
    clean: gruntConfig.clean,
    shell: gruntConfig.shell,
    webpack: gruntConfig.webpack,
  });

  grunt.registerTask('lint', ['eslint']);

  grunt.task.registerTask('build:server', 'build:server:<platform>:<arch>', function (p = platform, a = arch) {
    grunt.task.run([`shell:build_binary:${p}:${a}`, `download_binaries:${p}:${a}`]);
  });

  grunt.registerTask('build:client', ['webpack:dev']);

  grunt.registerTask('build', ['build:server', 'build:client']);

  grunt.registerTask('start:server', ['build:server:linux', 'shell:run_container']);

  grunt.registerTask('start:localserver', [`shell:build_binary:${platform}:${arch}`, 'shell:run_localserver']);

  grunt.registerTask('start:client', ['shell:install_yarndeps', 'webpack:devWatch']);

  grunt.registerTask('start', ['start:server', 'start:client']);

  grunt.registerTask('start:toolkit', ['start:localserver', 'start:client']);

  grunt.task.registerTask('release', 'release:<platform>:<arch>', function (platform = 'linux', a = arch) {
    grunt.task.run(['env:prod', 'clean:all', `shell:build_binary:${platform}:${a}`, `download_binaries:${platform}:${a}`, 'webpack:prod']);
  });

  grunt.task.registerTask('devopsbuild', 'devopsbuild:<platform>:<arch>:<env>', function (platform, a = arch, env = 'prod') {
    grunt.task.run([
      `env:${env}`,
      'clean:all',
      `shell:build_binary_azuredevops:${platform}:${a}`,
      `download_binaries:${platform}:${a}`,
      `webpack:${env}`,
      `shell:storybook:${env}`,
    ]);
  });

  grunt.task.registerTask('download_binaries', 'download_binaries:<platform>:<arch>', function (platform = 'linux', a = arch) {
    grunt.task.run([`shell:download_binaries:${platform}:${a}`]);
  });
};

/***/
const gruntConfig = {};

gruntConfig.env = {
  dev: {
    NODE_ENV: 'development',
  },
  prod: {
    NODE_ENV: 'production',
  },
  testing: {
    NODE_ENV: 'testing',
  },
};

gruntConfig.webpack = {
  dev: webpackDevConfig,
  devWatch: Object.assign({ watch: true }, webpackDevConfig),
  prod: webpackProdConfig,
  testing: webpackTestingConfig,
};

gruntConfig.clean = {
  server: ['<%= root %>/portainer'],
  client: ['<%= distdir %>/*'],
  all: ['<%= root %>/*'],
};

gruntConfig.shell = {
  build_binary: { command: shell_build_binary },
  build_binary_azuredevops: { command: shell_build_binary_azuredevops },
  download_binaries: { command: 'build/download_binaries.sh' },
  run_container: { command: shell_run_container },
  run_localserver: { command: shell_run_localserver, options: { async: true } },
  install_yarndeps: { command: shell_install_yarndeps },
  storybook: { command: shell_storybook },
};

function shell_storybook(env) {
  if (env === 'production') {
    return '';
  }

  return `
    yarn build-storybook
  `;
}

function shell_build_binary(platform, arch) {
  const binfile = 'dist/portainer';
  if (platform === 'linux' || platform === 'darwin') {
    return `
      if [ -f ${binfile} ]; then
        echo "Portainer binary exists";
      else
        build/build_binary.sh ${platform} ${arch};
      fi
    `;
  }

  // windows
  return `
      powershell -Command "& {if (Get-Item -Path ${binfile}.exe -ErrorAction:SilentlyContinue) {
        Write-Host "Portainer binary exists"
      } else {
        & ".\\build\\build_binary.ps1" -platform ${platform} -arch ${arch}
      }}"
    `;
}

function shell_build_binary_azuredevops(platform, arch) {
  return `build/build_binary_azuredevops.sh ${platform} ${arch};`;
}

function shell_run_container() {
  const portainerData = '${PORTAINER_DATA:-/tmp/portainer}';
  const portainerRoot = process.env.PORTAINER_PROJECT ? process.env.PORTAINER_PROJECT : process.env.PWD;
  const portainerFlags = '${PORTAINER_FLAGS:-}';

  return `
    docker rm -f portainer
    docker run -d \
      -p 8000:8000 \
      -p 9000:9000 \
      -p 9443:9443 \
      -v ${portainerRoot}/dist:/app \
      -v ${portainerData}:/data \
      -v /var/run/docker.sock:/var/run/docker.sock:z \
      -v /var/run/docker.sock:/var/run/alternative.sock:z \
      -v /tmp:/tmp \
      --name portainer \
      portainer/base \
      /app/portainer ${portainerFlags}
  `;
}

function shell_run_localserver() {
  return './dist/portainer';
}

function shell_install_yarndeps() {
  return 'yarn';
}
