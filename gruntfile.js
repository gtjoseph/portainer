const os = require('os');
const loadGruntTasks = require('load-grunt-tasks');
const webpackProdConfig = require('./webpack/webpack.production');

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
    env: gruntConfig.env,
    clean: gruntConfig.clean,
    shell: gruntConfig.shell,
    webpack: gruntConfig.webpack,
  });

  grunt.task.registerTask('release', 'release:<platform>:<arch>', function (platform = 'linux', a = arch) {
    grunt.task.run(['env:prod', 'clean:all', `shell:build_binary:${platform}:${a}`, `download_binaries:${platform}:${a}`, 'webpack:prod']);
  });

  grunt.task.registerTask('devopsbuild', 'devopsbuild:<platform>:<arch>:<env>', function (platform, a = arch, env = 'prod') {
    grunt.task.run([`shell:devops:${platform}:${a}:${env}`]);
  });

  grunt.task.registerTask('download_binaries', 'download_binaries:<platform>:<arch>', function (platform = 'linux', a = arch) {
    grunt.task.run([`shell:download_binaries:${platform}:${a}`]);
  });
};

/***/
const gruntConfig = {};

gruntConfig.env = {
  prod: {
    NODE_ENV: 'production',
  },
};

gruntConfig.webpack = {
  prod: webpackProdConfig,
};

gruntConfig.clean = {
  all: ['<%= root %>/*'],
};

gruntConfig.shell = {
  build_binary: { command: shell_build_binary },
  download_binaries: { command: shell_download_binaries },
  devops: { command: shell_devops },
};

function shell_devops(platform, arch, env) {
  return `build/devops.sh ${platform} ${arch} ${env};`;
}

function shell_download_binaries(platform, arch) {
  return `build/download_binaries.sh ${platform} ${arch}`;
}

function shell_build_binary(platform, arch) {
  const binfile = 'dist/portainer';
  if (platform === 'linux' || platform === 'darwin') {
    return `build/build_binary.sh ${platform} ${arch}`;
  }

  // windows
  return `
      powershell -Command "& {if (Get-Item -Path ${binfile}.exe -ErrorAction:SilentlyContinue) {
        Write-Host "Portainer binary exists"
      } else {
        & ".\\build\\build_binary.ps1"
      }}"
    `;
}
