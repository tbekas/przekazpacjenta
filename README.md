# Przekaż Pacjenta

[![Deploy status](https://img.shields.io/github/workflow/status/tbekas/przekazpacjenta/CD%20-%20deploy%20on%20merge%20to%20main?label=deploy)](https://github.com/tbekas/przekazpacjenta/actions/workflows/cd.yml) [![Last commit (branch)](https://img.shields.io/github/last-commit/tbekas/przekazpacjenta/main)](https://github.com/tbekas/przekazpacjenta/commits/main) [![License](https://img.shields.io/github/license/tbekas/przekazpacjenta)](https://github.com/tbekas/przekazpacjenta/blob/main/LICENSE)

Source code for [staging.przekazpacjenta.pl](https://staging.przekazpacjenta.pl).

## Set up

### `npm install`

Installs backend dependencies.

### `npm install --prefix site`

Installs frontend dependencies.

## Local development

### `npm run start`

Starts the backend development environment.

### `npm run start --prefix site`

Starts the local frontend development server.

### `npm run prettier -- --write .`

Prettifies all files.

## Clean up

### `npm run remove`

Removes all your stacks from AWS.
