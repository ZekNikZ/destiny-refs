#!/bin/bash

yarn run ts-json-schema-generator --path src/data/*types.ts --type ActivitiesJson --tsconfig tsconfig.json -o public/data/schema/activities.json
yarn run ts-json-schema-generator --path src/data/*types.ts --type RotationsJson --tsconfig tsconfig.json -o public/data/schema/rotations.json
yarn run ts-json-schema-generator --path src/data/*types.ts --type LootJson --tsconfig tsconfig.json -o public/data/schema/loot.json
yarn run ts-json-schema-generator --path src/data/*types.ts --type ActivityJson --tsconfig tsconfig.json -o public/data/schema/activity.json