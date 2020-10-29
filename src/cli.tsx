#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

const cli = meow(`
	Usage
	  $ blast-off

	Options
		--name  Your name

	Examples
	  $ blast-off --name=Jane
	  Hello, Jane
`, {
	flags: {
		name: {
			type: 'string'
		}
	}
});

render(<App name={cli.flags.name}/>);
