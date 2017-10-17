#!/usr/bin/env python

import ConfigParser
import os

config = ConfigParser.ConfigParser()

config.add_section('path')
config.set('path', 'root', os.path.join(os.path.dirname(__file__), '..'))
config.set('path', 'output', "projects")
config.set('path', 'defects4j', os.path.expanduser("~/git/defects4j"))
config.set('path', 'checkout', os.path.expanduser("/mnt/scondary/projects"))
config.set('path', 'fix_checkout', os.path.expanduser("/mnt/scondary/projects_fix"))

config.add_section('git')
config.set('git', 'url', 'https://github.com/program-repair/defects4j-dissection')

path_config_file = os.path.join(config.get('path', 'root'), 'script', 'config.cfg')

if os.path.isfile(path_config_file):
    with open(path_config_file, 'r') as configfile:
        config.readfp(configfile)
        for option in config.options('path'):
            value = config.get('path', option)
            if '~' in value:
                config.set('path', option, os.path.expanduser(value))
else:
    with open(path_config_file, 'wb') as configfile:
        config.write(configfile)
