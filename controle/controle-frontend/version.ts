import fs = require('fs');
import { combineLatest, Observable } from 'rxjs';

let exec = require('child_process').exec;

const revision = new Observable<string>(s => {
  exec('git rev-parse --short HEAD',
    function(error: Error, stdout: Buffer, stderr: Buffer) {
      if (error !== null) {
        console.log('git error: ' + error + stderr);
      }
      s.next(stdout.toString().trim());
      s.complete();
    });
});

const branch = new Observable<string>(s => {
  exec('git rev-parse --abbrev-ref HEAD',
    function(error: Error, stdout: Buffer, stderr: Buffer) {
      if (error !== null) {
        console.log('git error: ' + error + stderr);
      }
      s.next(stdout.toString().trim());
      s.complete();
    });
});

const timestamp = new Observable<string>(s => {
  let date = new Date();

  let res = '' + date.getFullYear();
  res += '' + ((date.getMonth() < 9) ? '0' : '') + (date.getMonth() + 1);
  res += '' + (date.getDate() < 10 ? 0 + '' + date.getDate() : date.getDate());
  res += '' + (date.getHours() < 10 ? 0 + '' + date.getHours() : date.getHours());
  res += '' + (date.getMinutes() < 10 ? 0 + '' + date.getMinutes() : date.getMinutes());

  s.next(res);
  s.complete();
});

combineLatest(revision, branch, timestamp)
  .subscribe(([revision, branch, timestamp]) => {
    console.log(`version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}', timestamp: '${timestamp}'`);

    const content = '// this file is automatically generated by version.ts script\n' +
      `export const versions = {version: '${process.env.npm_package_version}', revision: '${revision}', branch: '${branch}', timestamp: '${timestamp}'};`;

    fs.writeFileSync(
      'src/environments/versions.ts',
      content,
      { encoding: 'utf8' },
    );
  });
