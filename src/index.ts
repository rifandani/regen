#!/usr/bin/env node
import chalk from 'chalk';
import cli from './cli';

/**
 * Check current installed Node version is compatible or not
 */
function isNotValidNodeVersion() {
  // get installed node version
  const currentNodeVersion = process.versions.node;
  const semver = currentNodeVersion.split('.');
  const major = semver[0];

  // if lower than 16, then escape early
  if (Number(major) < 16) {
    console.error(
      chalk.yellow(
        `You are running Node ${currentNodeVersion}. ${chalk.yellow.bold.italic(
          'Regen'
        )} CLI requires Node 16 or higher. Please update your version of Node first.`
      )
    );

    return true;
  }

  return false;
}

// exit process, if user is running Node 16 or lower.
if (isNotValidNodeVersion()) {
  process.exit(1);
}

// run the program
cli(process.argv).catch((err) => {
  console.error(chalk.red('❌ Regen CLI error ❌'), err);
  process.exit(1);
});
