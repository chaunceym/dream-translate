#!/usr/bin/env node

import * as commander from 'commander';
import {translate} from './index';

const program = new commander.Command();

program.version('0.0.1');

program
  .name('translate')
  .usage(`<english>`)
  .arguments(`<english>`)
  .action(english => {
    translate(english);
  });

program.parse(process.argv);
