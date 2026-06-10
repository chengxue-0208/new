#!/usr/bin/env python3
import os
import re

for filename in os.listdir('.'):
    if filename.endswith('.entity.ts'):
        with open(filename, 'r') as f:
            content = f.read()

        # Add ! to properties that don't have it
        content = re.sub(r'(\s+)(@[\w]+.*\n)(\s+)(\w+): (string|number|bigint|Date|boolean)(;)', r'\1\2\3\4\5!', content)

        with open(filename, 'w') as f:
            f.write(content)

print("Done!")